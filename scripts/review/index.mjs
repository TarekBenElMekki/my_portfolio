import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .replace("Z", "");

const reviewName = `review-${timestamp}`;
const reviewsRoot = path.join(root, "reviews");
const reviewDirectory = path.join(reviewsRoot, reviewName);
const zipPath = `${reviewDirectory}.zip`;

const excludedDirectories = new Set([
  ".git",
  ".next",
  "node_modules",
  "reviews",
  "backups",
  "logs",
  "temp",
  "exports",
  ".vercel",
]);

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".json",
  ".md",
  ".txt",
  ".html",
  ".svg",
  ".yml",
  ".yaml",
]);

let serverProcess = null;
let browser = null;
let serverOutput = "";
let serverError = "";
let fatalError = null;

await fs.mkdir(reviewDirectory, { recursive: true });

function commandParts(command, args) {
  if (process.platform !== "win32") {
    return {
      executable: command,
      arguments: args,
    };
  }

  const commandLine = [command, ...args]
    .map((part) => {
      const value = String(part);

      if (/[\s"&|<>^]/.test(value)) {
        return `"${value.replaceAll('"', '\\"')}"`;
      }

      return value;
    })
    .join(" ");

  return {
    executable: "cmd.exe",
    arguments: ["/d", "/s", "/c", commandLine],
  };
}

function runCommand(command, args, options = {}) {
  const {
    stream = false,
    environment = {},
  } = options;

  const { executable, arguments: commandArguments } = commandParts(
    command,
    args,
  );

  return new Promise((resolve) => {
    const child = spawn(executable, commandArguments, {
      cwd: root,
      env: {
        ...process.env,
        ...environment,
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;

      if (stream) {
        process.stdout.write(text);
      }
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;

      if (stream) {
        process.stderr.write(text);
      }
    });

    child.on("error", (error) => {
      stderr += `${error.stack ?? error.message}\n`;
    });

    child.on("close", (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr,
      });
    });
  });
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.once("error", reject);

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to select a free port."));
        return;
      }

      const port = address.port;

      server.close(() => {
        resolve(port);
      });
    });
  });
}

async function waitForWebsite(url, childProcess) {
  for (let attempt = 1; attempt <= 90; attempt += 1) {
    if (childProcess.exitCode !== null) {
      throw new Error(
        `Next.js stopped before becoming ready. Exit code: ${childProcess.exitCode}`,
      );
    }

    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  throw new Error(`Website did not become ready at ${url}.`);
}

async function stopServer() {
  if (!serverProcess || serverProcess.exitCode !== null) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync(
      "taskkill.exe",
      [
        "/PID",
        String(serverProcess.pid),
        "/T",
        "/F",
      ],
      {
        windowsHide: true,
        stdio: "ignore",
      },
    );

    return;
  }

  serverProcess.kill("SIGTERM");
}

async function createDirectoryTree(directory, prefix = "") {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const filteredEntries = entries
    .filter((entry) => {
      if (
        entry.isDirectory() &&
        excludedDirectories.has(entry.name)
      ) {
        return false;
      }

      if (entry.name === "package-lock.json") {
        return false;
      }

      return true;
    })
    .sort((left, right) => {
      if (left.isDirectory() !== right.isDirectory()) {
        return left.isDirectory() ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  const lines = [];

  for (let index = 0; index < filteredEntries.length; index += 1) {
    const entry = filteredEntries[index];
    const last = index === filteredEntries.length - 1;
    const connector = last ? "└── " : "├── ";
    const fullPath = path.join(directory, entry.name);

    lines.push(`${prefix}${connector}${entry.name}`);

    if (entry.isDirectory()) {
      const childPrefix = `${prefix}${last ? "    " : "│   "}`;

      lines.push(
        ...(await createDirectoryTree(fullPath, childPrefix)),
      );
    }
  }

  return lines;
}

async function collectCodeFiles(directory) {
  const output = [];

  async function visit(currentDirectory) {
    const entries = await fs.readdir(currentDirectory, {
      withFileTypes: true,
    });

    entries.sort((left, right) =>
      left.name.localeCompare(right.name),
    );

    for (const entry of entries) {
      const fullPath = path.join(currentDirectory, entry.name);
      const relativePath = path.relative(root, fullPath);

      if (
        entry.isDirectory() &&
        excludedDirectories.has(entry.name)
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        await visit(fullPath);
        continue;
      }

      if (
        entry.name === "package-lock.json" ||
        !textExtensions.has(path.extname(entry.name).toLowerCase())
      ) {
        continue;
      }

      const stats = await fs.stat(fullPath);

      if (stats.size > 1_500_000) {
        continue;
      }

      const content = await fs.readFile(fullPath, "utf8");

      output.push(
        [
          "=".repeat(88),
          `FILE: ${relativePath.replaceAll("\\", "/")}`,
          "=".repeat(88),
          content.trimEnd(),
          "",
        ].join("\n"),
      );
    }
  }

  await visit(directory);

  return output.join("\n");
}

async function createZipArchive() {
  if (process.platform !== "win32") {
    return false;
  }

  const escapedReviewDirectory = reviewDirectory.replaceAll(
    "'",
    "''",
  );

  const escapedZipPath = zipPath.replaceAll("'", "''");

  const script = [
    `$source = '${escapedReviewDirectory}\\*'`,
    `$destination = '${escapedZipPath}'`,
    "Compress-Archive -Path $source -DestinationPath $destination -Force",
  ].join("; ");

  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      script,
    ],
    {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    },
  );

  if (result.status !== 0) {
    await fs.writeFile(
      path.join(reviewDirectory, "zip-error.log"),
      `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
      "utf8",
    );

    return false;
  }

  return true;
}

async function openReviewPackage(zipCreated) {
  if (process.platform !== "win32") {
    return;
  }

  if (zipCreated) {
    const explorer = spawn(
      "explorer.exe",
      ["/select,", zipPath],
      {
        detached: true,
        stdio: "ignore",
        windowsHide: true,
      },
    );

    explorer.unref();
    return;
  }

  const explorer = spawn(
    "explorer.exe",
    [reviewDirectory],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    },
  );

  explorer.unref();
}

async function captureReviewScreenshot(
  page,
  outputPath,
  {
    fullPage = false,
    segmentPrefix = "capture",
  } = {},
) {
  try {
    await page.screenshot({
      path: outputPath,
      fullPage,
      animations: "disabled",
      caret: "hide",
      timeout: 30_000,
    });

    return [path.basename(outputPath)];
  } catch (error) {
    if (!fullPage) {
      throw error;
    }

    console.warn(
      `Full-page screenshot failed for ${segmentPrefix}. Falling back to segmented capture.`,
    );

    console.warn(
      error instanceof Error
        ? error.message
        : String(error),
    );

    const viewport = page.viewportSize();

    if (!viewport) {
      throw error;
    }

    const pageHeight = await page.evaluate(() =>
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ),
    );

    const originalScrollY = await page.evaluate(
      () => window.scrollY,
    );

    const capturedFiles = [];

    let partNumber = 1;

    for (
      let scrollY = 0;
      scrollY < pageHeight;
      scrollY += viewport.height
    ) {
      await page.evaluate((targetY) => {
        window.scrollTo({
          top: targetY,
          behavior: "instant",
        });
      }, scrollY);

      await page.waitForTimeout(180);

      const partFilename =
        partNumber === 1
          ? path.basename(outputPath)
          : `${segmentPrefix}-part-${String(
              partNumber,
            ).padStart(2, "0")}.png`;

      const partPath =
        partNumber === 1
          ? outputPath
          : path.join(
              path.dirname(outputPath),
              partFilename,
            );

      await page.screenshot({
        path: partPath,
        fullPage: false,
        animations: "disabled",
        caret: "hide",
        timeout: 30_000,
      });

      capturedFiles.push(partFilename);

      console.log(
        `Captured ${partFilename} (${Math.min(
          scrollY + viewport.height,
          pageHeight,
        )}/${pageHeight}px)`,
      );

      partNumber += 1;
    }

    await page.evaluate((targetY) => {
      window.scrollTo({
        top: targetY,
        behavior: "instant",
      });
    }, originalScrollY);

    await page.waitForTimeout(150);

    return capturedFiles;
  }
}

try {
  console.log("");
  console.log("==============================================");
  console.log(" TAREK PORTFOLIO AUTOMATIC REVIEW");
  console.log("==============================================");
  console.log("");

  console.log("1/8 Exporting project tree...");

  const treeLines = [
    path.basename(root),
    ...(await createDirectoryTree(root)),
  ];

  await fs.writeFile(
    path.join(reviewDirectory, "tree.txt"),
    `${treeLines.join("\n")}\n`,
    "utf8",
  );

  console.log("2/8 Exporting complete text codebase...");

  const codebase = await collectCodeFiles(root);

  await fs.writeFile(
    path.join(reviewDirectory, "codebase.txt"),
    codebase,
    "utf8",
  );

  await fs.copyFile(
    path.join(root, "package.json"),
    path.join(reviewDirectory, "package.json"),
  );

  console.log("3/8 Exporting Git information...");

  const gitStatus = await runCommand(
    "git",
    ["status", "--short", "--branch"],
  );

  const gitDiff = await runCommand(
    "git",
    ["diff", "--no-color"],
  );

  const gitLog = await runCommand(
    "git",
    ["log", "-10", "--oneline", "--decorate"],
  );

  await fs.writeFile(
    path.join(reviewDirectory, "git-status.txt"),
    `${gitStatus.stdout}${gitStatus.stderr}`,
    "utf8",
  );

  await fs.writeFile(
    path.join(reviewDirectory, "git-diff.patch"),
    `${gitDiff.stdout}${gitDiff.stderr}`,
    "utf8",
  );

  await fs.writeFile(
    path.join(reviewDirectory, "git-log.txt"),
    `${gitLog.stdout}${gitLog.stderr}`,
    "utf8",
  );

  console.log("4/8 Running ESLint...");

  const lintResult = await runCommand(
    "npm",
    ["run", "lint"],
    {
      stream: true,
    },
  );

  await fs.writeFile(
    path.join(reviewDirectory, "lint.log"),
    `${lintResult.stdout}\n${lintResult.stderr}`,
    "utf8",
  );

  console.log("5/8 Running production build...");

  const buildResult = await runCommand(
    "npm",
    ["run", "build"],
    {
      stream: true,
    },
  );

  await fs.writeFile(
    path.join(reviewDirectory, "build.log"),
    `${buildResult.stdout}\n${buildResult.stderr}`,
    "utf8",
  );

  if (lintResult.code !== 0) {
    throw new Error(
      `ESLint failed with exit code ${lintResult.code}.`,
    );
  }

  if (buildResult.code !== 0) {
    throw new Error(
      `Production build failed with exit code ${buildResult.code}.`,
    );
  }

  console.log("6/8 Starting temporary production server...");

  const port = await getFreePort();
  const url = `http://127.0.0.1:${port}`;

  const serverCommand = commandParts(
    "npm",
    [
      "run",
      "start",
      "--",
      "--port",
      String(port),
    ],
  );

  serverProcess = spawn(
    serverCommand.executable,
    serverCommand.arguments,
    {
      cwd: root,
      env: {
        ...process.env,
        PORT: String(port),
      },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  serverProcess.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    serverOutput += text;
    process.stdout.write(text);
  });

  serverProcess.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    serverError += text;
    process.stderr.write(text);
  });

  await waitForWebsite(url, serverProcess);

  console.log(`Website ready: ${url}`);
  console.log("7/8 Capturing desktop, tablet and mobile...");

  browser = await chromium.launch({
    headless: true,
  });

  const viewportConfigurations = [
    {
      name: "desktop",
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
    },
    {
      name: "tablet",
      width: 900,
      height: 1100,
      deviceScaleFactor: 1,
    },
    {
      name: "mobile",
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
    },
  ];

  const browserLogs = [];
  const screenshotMetadata = [];

  for (const viewport of viewportConfigurations) {
    const context = await browser.newContext({
      viewport: {
        width: viewport.width,
        height: viewport.height,
      },
      deviceScaleFactor: viewport.deviceScaleFactor,
      colorScheme: "dark",
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    page.on("console", (message) => {
      browserLogs.push(
        `[${viewport.name}] [${message.type()}] ${message.text()}`,
      );
    });

    page.on("pageerror", (error) => {
      browserLogs.push(
        `[${viewport.name}] [pageerror] ${error.stack ?? error.message}`,
      );
    });

    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });

    if (!response || !response.ok()) {
      throw new Error(
        `${viewport.name} page returned an invalid HTTP response.`,
      );
    }

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await page.waitForTimeout(900);

    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      title: document.title,
    }));

    const screenshotPath = path.join(
      reviewDirectory,
      `${viewport.name}.png`,
    );

    const capturedPageFiles =
      await captureReviewScreenshot(
        page,
        screenshotPath,
        {
          fullPage: true,
          segmentPrefix: viewport.name,
        },
      );

    screenshotMetadata.push({
      viewport: viewport.name,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      pageWidth: dimensions.width,
      pageHeight: dimensions.height,
      title: dimensions.title,
      screenshot: `${viewport.name}.png`,
      screenshotFiles: capturedPageFiles,
      segmented: capturedPageFiles.length > 1,
    });

    console.log(`Captured ${viewport.name}.png`);

    if (
      viewport.name === "desktop" ||
      viewport.name === "mobile"
    ) {
      const activeProjectCard = page.locator(
        ".project-carousel-card.is-active",
      );

      if ((await activeProjectCard.count()) > 0) {
        await activeProjectCard.scrollIntoViewIfNeeded();
        await activeProjectCard.click();

        const projectModal = page.locator(".project-modal");

        await projectModal.waitFor({
          state: "visible",
          timeout: 10_000,
        });

        await page.waitForTimeout(350);

        const modalScreenshotName =
          `project-modal-${viewport.name}.png`;

        await page.screenshot({
          path: path.join(
            reviewDirectory,
            modalScreenshotName,
          ),
          fullPage: false,
          animations: "disabled",
          caret: "hide",
        });

        screenshotMetadata.push({
          viewport: `${viewport.name}-project-modal`,
          viewportWidth: viewport.width,
          viewportHeight: viewport.height,
          pageWidth: viewport.width,
          pageHeight: viewport.height,
          title: dimensions.title,
          screenshot: modalScreenshotName,
        });

        console.log(`Captured ${modalScreenshotName}`);

        await page.locator(".project-modal-close").click();

        await projectModal.waitFor({
          state: "hidden",
          timeout: 10_000,
        });
      }
    }

    await context.close();
  }

  await fs.writeFile(
    path.join(reviewDirectory, "browser-console.log"),
    browserLogs.length
      ? `${browserLogs.join("\n")}\n`
      : "No browser console errors or messages were recorded.\n",
    "utf8",
  );

  await fs.writeFile(
    path.join(reviewDirectory, "screenshots.json"),
    `${JSON.stringify(screenshotMetadata, null, 2)}\n`,
    "utf8",
  );

  await fs.writeFile(
    path.join(reviewDirectory, "environment.json"),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        reviewName,
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        websiteUrl: url,
        lintExitCode: lintResult.code,
        buildExitCode: buildResult.code,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log("8/8 Review capture completed.");
} catch (error) {
  fatalError = error;

  const message =
    error instanceof Error
      ? error.stack ?? error.message
      : String(error);

  await fs.writeFile(
    path.join(reviewDirectory, "fatal-error.log"),
    `${message}\n`,
    "utf8",
  );

  console.error("");
  console.error(message);
} finally {
  if (browser) {
    await browser.close().catch(() => {});
  }

  await stopServer();

  await fs.writeFile(
    path.join(reviewDirectory, "terminal.log"),
    [
      "=== SERVER STANDARD OUTPUT ===",
      serverOutput || "No server standard output was recorded.",
      "",
      "=== SERVER STANDARD ERROR ===",
      serverError || "No server standard error was recorded.",
      "",
    ].join("\n"),
    "utf8",
  );

  await fs.writeFile(
    path.join(reviewDirectory, "review-summary.json"),
    `${JSON.stringify(
      {
        reviewName,
        generatedAt: new Date().toISOString(),
        successful: fatalError === null,
        error:
          fatalError instanceof Error
            ? fatalError.message
            : fatalError
              ? String(fatalError)
              : null,
        files: [
          "desktop.png",
          "tablet.png",
          "mobile.png",
          "project-modal-desktop.png",
          "project-modal-mobile.png",
          "codebase.txt",
          "tree.txt",
          "git-status.txt",
          "git-diff.patch",
          "git-log.txt",
          "lint.log",
          "build.log",
          "terminal.log",
          "browser-console.log",
          "package.json",
        ],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const zipCreated = await createZipArchive();

  console.log("");
  console.log("==============================================");
  console.log(
    fatalError
      ? " REVIEW PACKAGE CREATED WITH ERRORS"
      : " REVIEW PACKAGE CREATED SUCCESSFULLY",
  );
  console.log("==============================================");
  console.log("");
  console.log(`Folder: ${reviewDirectory}`);

  if (zipCreated) {
    console.log(`ZIP:    ${zipPath}`);
  }

  await openReviewPackage(zipCreated);

  if (fatalError) {
    process.exitCode = 1;
  }
}
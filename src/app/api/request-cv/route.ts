import {
  existsSync,
} from "node:fs";

import path from "node:path";

import nodemailer from "nodemailer";

import {
  NextRequest,
  NextResponse,
} from "next/server";


export const runtime =
  "nodejs";


type RateRecord = {
  count: number;
  resetAt: number;
};


const RATE_LIMIT_WINDOW_MS =
  15 * 60 * 1000;

const RATE_LIMIT_MAX =
  3;


const rateStore =
  new Map<
    string,
    RateRecord
  >();


function getClientIp(
  request: NextRequest,
) {

  const forwarded =
    request.headers.get(
      "x-forwarded-for",
    );


  if (forwarded) {

    return (
      forwarded
        .split(",")[0]
        ?.trim() ||
      "unknown"
    );
  }


  return (
    request.headers.get(
      "x-real-ip",
    ) ||
    "unknown"
  );
}


function isRateLimited(
  key: string,
) {

  const now =
    Date.now();

  const record =
    rateStore.get(
      key,
    );


  if (
    !record ||
    now >= record.resetAt
  ) {

    rateStore.set(
      key,
      {
        count: 1,

        resetAt:
          now +
          RATE_LIMIT_WINDOW_MS,
      },
    );

    return false;
  }


  if (
    record.count >=
    RATE_LIMIT_MAX
  ) {

    return true;
  }


  record.count += 1;

  rateStore.set(
    key,
    record,
  );

  return false;
}


function isValidEmail(
  email: string,
) {

  if (
    email.length < 5 ||
    email.length > 254
  ) {

    return false;
  }


  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}


export async function POST(
  request: NextRequest,
) {

  try {

    const body =
      (await request.json()) as {
        email?: unknown;
        website?: unknown;
      };


    /*
      Honeypot.
      Real visitors never fill this.
    */

    if (
      typeof body.website ===
        "string" &&
      body.website.trim()
    ) {

      return NextResponse.json({
        success: true,
      });
    }


    const email =
      typeof body.email ===
      "string"

        ? body.email
            .trim()
            .toLowerCase()

        : "";


    if (
      !isValidEmail(
        email,
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }


    const clientIp =
      getClientIp(
        request,
      );


    if (
      isRateLimited(
        clientIp,
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again in a few minutes.",
        },
        {
          status: 429,
        },
      );
    }


    const gmailUser =
      process.env
        .GMAIL_USER
        ?.trim();

    const gmailPassword =
      process.env
        .GMAIL_APP_PASSWORD
        ?.replace(
          /\s+/g,
          "",
        )
        .trim();


    if (
      !gmailUser ||
      !gmailPassword ||
      gmailPassword.includes(
        "PASTE_YOUR",
      )
    ) {

      console.error(
        "Gmail credentials are not configured.",
      );

      return NextResponse.json(
        {
          error:
            "CV delivery is not configured.",
        },
        {
          status: 503,
        },
      );
    }


    /*
      CV assets stored inside /public.
    */

    const cvPath =
      path.join(
        /* turbopackIgnore: true */
        process.cwd(),
        "public",
        "Tarek-Ben-El-Mekki-CV.pdf",
      );


    const previewPath =
      path.join(
        /* turbopackIgnore: true */
        process.cwd(),
        "public",
        "cv-preview.png",
      );


    if (
      !existsSync(
        cvPath,
      )
    ) {

      console.error(
        `CV missing: ${cvPath}`,
      );

      return NextResponse.json(
        {
          error:
            "The CV is temporarily unavailable.",
        },
        {
          status: 503,
        },
      );
    }


    if (
      !existsSync(
        previewPath,
      )
    ) {

      console.error(
        `CV preview missing: ${previewPath}`,
      );

      return NextResponse.json(
        {
          error:
            "The CV preview is temporarily unavailable.",
        },
        {
          status: 503,
        },
      );
    }


    /*
      In production, PORTFOLIO_URL should be:
      https://your-real-domain.com

      Locally it falls back to localhost.
    */

    const configuredBaseUrl =
      process.env
        .PORTFOLIO_URL
        ?.trim();


    const baseUrl =
      configuredBaseUrl ||
      request.nextUrl.origin;


    const cvDownloadUrl =
      new URL(
        "/Tarek-Ben-El-Mekki-CV.pdf",
        baseUrl,
      ).toString();


    const transporter =
      nodemailer.createTransport({
        service:
          "gmail",

        auth: {
          user:
            gmailUser,

          pass:
            gmailPassword,
        },
      });


    await transporter.sendMail({

      from:
        `Tarek Ben El Mekki <${gmailUser}>`,

      to:
        email,

      replyTo:
        gmailUser,

      subject:
        "Tarek Ben El Mekki — CV",


      /*
        Very minimal fallback for clients
        that do not render HTML.
      */

      /*
        Minimal plain-text fallback.
      */

      text: [
        "TBEM. — CV DELIVERY",
        "",
        "$ delivery_complete",
        "",
        "01  Request validated       DONE",
        "02  CV prepared             READY",
        "03  Secure delivery         COMPLETE",
        "",
        "Your requested CV is ready.",
        "",
        `Download CV: ${cvDownloadUrl}`,
        "",
        "Tarek Ben El Mekki",
        "Master Graduate · Tunisia",
      ].join("\n"),


      /*
        TBEM terminal-style email.

        Email clients do not reliably support CSS animation,
        so this represents the completed state of the same
        visual experience used by the website loader.
      */

      html: `
<!doctype html>

<html lang="en">

<body
  style="
    margin:0;
    padding:0;
    background:#050506;
    color:#ffffff;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
  "
>

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    width:100%;
    background:#050506;
  "
>

<tr>

<td
  align="center"
  style="
    padding:
      42px
      16px;
  "
>


<!-- =====================================================
     MAIN TERMINAL CARD
     ===================================================== -->

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    width:100%;
    max-width:580px;
    overflow:hidden;
    border:
      1px solid
      #202024;
    border-radius:12px;
    background:#09090b;
  "
>


<!-- HEADER -->

<tr>

<td
  style="
    padding:
      18px
      22px;
    border-bottom:
      1px solid
      #1b1b1f;
  "
>

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
>

<tr>

<td
  align="left"
>

<span
  style="
    color:#ffffff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:15px;
    font-weight:700;
    letter-spacing:-0.04em;
  "
>
  TBEM.
</span>

</td>


<td
  align="right"
>

<span
  style="
    color:#606068;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    font-weight:600;
    letter-spacing:0.12em;
  "
>
  SECURE DELIVERY SYSTEM
</span>

</td>

</tr>

</table>

</td>

</tr>


<!-- TERMINAL STATUS -->

<tr>

<td
  style="
    padding:
      27px
      26px
      24px;
  "
>


<p
  style="
    margin:
      0
      0
      25px;
    color:#ffffff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:12px;
    line-height:1.5;
  "
>

<span
  style="
    color:#4f8cff;
  "
>
  $
</span>

&nbsp;delivery_complete

</p>


<!-- STEP 01 -->

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    margin-bottom:10px;
  "
>

<tr>

<td
  width="34"
  style="
    color:#4f8cff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:9px;
  "
>
  01
</td>

<td
  style="
    color:#9b9ba3;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:10px;
  "
>
  request validated
</td>

<td
  align="right"
  style="
    color:#5bd38f;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    font-weight:600;
  "
>
  DONE
</td>

</tr>

</table>


<!-- STEP 02 -->

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    margin-bottom:10px;
  "
>

<tr>

<td
  width="34"
  style="
    color:#4f8cff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:9px;
  "
>
  02
</td>

<td
  style="
    color:#9b9ba3;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:10px;
  "
>
  CV prepared
</td>

<td
  align="right"
  style="
    color:#5bd38f;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    font-weight:600;
  "
>
  READY
</td>

</tr>

</table>


<!-- STEP 03 -->

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
>

<tr>

<td
  width="34"
  style="
    color:#4f8cff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:9px;
  "
>
  03
</td>

<td
  style="
    color:#ffffff;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:10px;
  "
>
  secure delivery
</td>

<td
  align="right"
  style="
    color:#5bd38f;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    font-weight:600;
  "
>
  COMPLETE
</td>

</tr>

</table>


<!-- 100% PROGRESS BAR -->

<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    margin-top:24px;
  "
>

<tr>

<td
  style="
    height:3px;
    overflow:hidden;
    border-radius:99px;
    background:#4f8cff;
  "
>
&nbsp;
</td>

</tr>

</table>


<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
  style="
    margin-top:11px;
  "
>

<tr>

<td
  style="
    color:#6f6f78;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:9px;
  "
>

<span
  style="
    color:#5bd38f;
  "
>
  ●
</span>

&nbsp; CV READY

</td>


<td
  align="right"
  style="
    color:#707079;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:9px;
  "
>
  100%
</td>

</tr>

</table>


</td>

</tr>


<!-- =====================================================
     CV PREVIEW
     ===================================================== -->

<tr>

<td
  align="center"
  style="
    padding:
      10px
      26px
      26px;
  "
>


<table
  role="presentation"
  width="100%"
  cellspacing="0"
  cellpadding="0"
  border="0"
>

<tr>

<td
  style="
    padding:
      11px
      0;
    border-top:
      1px solid
      #19191d;
  "
>

<span
  style="
    color:#55555e;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    letter-spacing:0.08em;
  "
>
  DOCUMENT_PREVIEW / TAREK_BEN_EL_MEKKI_CV
</span>

</td>

</tr>

</table>


<a
  href="${cvDownloadUrl}"
  target="_blank"
  style="
    display:block;
    text-decoration:none;
  "
>

<img
  src="cid:tbem-cv-preview"
  alt="Tarek Ben El Mekki CV preview"
  width="430"
  style="
    display:block;
    width:100%;
    max-width:430px;
    height:auto;
    margin:0 auto;
    border:
      1px solid
      #29292e;
    border-radius:5px;
    background:#ffffff;
  "
/>

</a>


<p
  style="
    margin:
      11px
      0
      0;
    color:#55555e;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
  "
>
  Click the document preview to open the full CV
</p>


</td>

</tr>


<!-- DOWNLOAD -->

<tr>

<td
  align="center"
  style="
    padding:
      0
      26px
      34px;
  "
>

<a
  href="${cvDownloadUrl}"
  target="_blank"
  style="
    display:inline-block;
    min-width:150px;
    padding:
      14px
      24px;
    border:
      1px solid
      #4f8cff;
    border-radius:7px;
    background:#101b32;
    color:#ffffff;
    font-family:
      Arial,
      Helvetica,
      sans-serif;
    font-size:13px;
    font-weight:600;
    text-decoration:none;
  "
>
  Download CV&nbsp;&nbsp;→
</a>

</td>

</tr>


<!-- FOOTER -->

<tr>

<td
  style="
    padding:
      20px
      26px
      24px;
    border-top:
      1px solid
      #1b1b1f;
    background:#070708;
  "
>

<p
  style="
    margin:0;
    color:#ffffff;
    font-size:13px;
    font-weight:600;
    line-height:1.5;
  "
>
  Tarek Ben El Mekki
</p>

<p
  style="
    margin:
      3px
      0
      0;
    color:#62626b;
    font-size:11px;
    line-height:1.5;
  "
>
  Master Graduate · Tunisia
</p>

</td>

</tr>


</table>


<!-- SMALL DELIVERY NOTE -->

<p
  style="
    max-width:580px;
    margin:
      14px
      auto
      0;
    color:#474750;
    font-family:
      Consolas,
      Monaco,
      monospace;
    font-size:8px;
    line-height:1.6;
    text-align:center;
  "
>
  This CV was requested through Tarek Ben El Mekki's portfolio.
</p>


</td>

</tr>

</table>

</body>

</html>
      `,

      attachments: [
        {
          filename:
            "cv-preview.png",

          path:
            previewPath,

          cid:
            "tbem-cv-preview",

          contentDisposition:
            "inline",
        },
      ],

    });


    return NextResponse.json({

      success: true,

      message:
        "CV sent successfully.",

    });


  } catch (
    error
  ) {

    console.error(
      "CV request failed:",
      error,
    );


    return NextResponse.json(
      {
        error:
          "The CV could not be sent right now.",
      },
      {
        status: 500,
      },
    );

  }
}
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


type CvLanguage =
  "en" |
  "fr";


type RateLimitEntry = {

  count:
    number;

  resetAt:
    number;

};


const RATE_LIMIT =
  3;


const RATE_WINDOW_MS =
  15 *
  60 *
  1000;


const rateLimits =
  new Map<
    string,
    RateLimitEntry
  >();


const cvFiles: Record<
  CvLanguage,
  {

    file:
      string;

    preview:
      string;

    attachmentName:
      string;

    label:
      string;

    subject:
      string;

  }
> = {

  en: {

    file:
      "TarekBenElMekki_EN.pdf",

    preview:
      "TarekBenElMekki_EN_preview.png",

    attachmentName:
      "Tarek_Ben_El_Mekki_CV_EN.pdf",

    label:
      "English",

    subject:
      "Tarek Ben El Mekki — CV | English",

  },


  fr: {

    file:
      "TarekBenElMekki_FR.pdf",

    preview:
      "TarekBenElMekki_FR_preview.png",

    attachmentName:
      "Tarek_Ben_El_Mekki_CV_FR.pdf",

    label:
      "Français",

    subject:
      "Tarek Ben El Mekki — CV | Français",

  },

};


function validEmail(
  value:
    string,
) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );

}


function getClientIp(
  request:
    NextRequest,
) {

  return (

    request.headers
      .get(
        "x-forwarded-for",
      )
      ?.split(",")[0]
      ?.trim() ||

    request.headers
      .get(
        "x-real-ip",
      ) ||

    "unknown"

  );

}


function allowRequest(
  key:
    string,
) {

  const now =
    Date.now();


  const existing =
    rateLimits.get(
      key,
    );


  if (
    !existing ||
    existing.resetAt <
      now
  ) {

    rateLimits.set(
      key,
      {

        count:
          1,

        resetAt:
          now +
          RATE_WINDOW_MS,

      },
    );


    return true;

  }


  if (
    existing.count >=
    RATE_LIMIT
  ) {

    return false;

  }


  existing.count +=
    1;


  return true;

}


export async function POST(
  request:
    NextRequest,
) {

  try {

    const raw =
      await request
        .json()
        .catch(
          () => null,
        );


    if (
      !raw ||
      typeof raw !==
        "object"
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid request.",
        },
        {
          status:
            400,

          headers: {

            "Cache-Control":
              "no-store",

          },
        },
      );

    }


    const body =
      raw as Record<
        string,
        unknown
      >;


    const email =
      typeof body.email ===
        "string"

        ? body.email
            .trim()
            .toLowerCase()

        : "";


    const language:
      CvLanguage =
        body.language ===
        "fr"

          ? "fr"

          : "en";


    const honeypot =
      typeof body.website ===
        "string"

        ? body.website.trim()

        : "";


    if (
      honeypot
    ) {

      return NextResponse.json({

        success:
          true,

      });

    }


    if (
      !validEmail(
        email,
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status:
            400,
        },
      );

    }


    if (
      !allowRequest(
        getClientIp(
          request,
        ),
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again later.",
        },
        {
          status:
            429,
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
        ?.trim();


    if (
      !gmailUser ||
      !gmailPassword
    ) {

      console.error(
        "Missing Gmail credentials.",
      );


      return NextResponse.json(
        {
          error:
            "The CV delivery service is temporarily unavailable.",
        },
        {
          status:
            503,
        },
      );

    }


    const selected =
      cvFiles[
        language
      ];


    const assetFolder =
      path.join(
        process.cwd(),
        "src",
        "server-assets",
        "cv",
      );


    const cvPath =
      path.join(
        assetFolder,
        selected.file,
      );


    const previewPath =
      path.join(
        assetFolder,
        selected.preview,
      );


    if (
      !existsSync(
        cvPath,
      )
    ) {

      console.error(
        `Missing CV: ${cvPath}`,
      );


      return NextResponse.json(
        {
          error:
            "The selected CV is temporarily unavailable.",
        },
        {
          status:
            503,
        },
      );

    }


    if (
      !existsSync(
        previewPath,
      )
    ) {

      console.error(
        `Missing preview: ${previewPath}`,
      );


      return NextResponse.json(
        {
          error:
            "The CV preview is temporarily unavailable.",
        },
        {
          status:
            503,
        },
      );

    }


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


    const french =
      language ===
      "fr";


    const headline =
      french

        ? "Voici le CV que vous avez demandé."

        : "Here is the CV you requested.";


    const spamText =
      french

        ? "Si cet e-mail n’apparaît pas dans votre boîte de réception, vérifiez votre dossier Spam / Courrier indésirable."

        : "If this email does not appear in your inbox, please check your Spam / Junk folder.";


    const attachmentText =
      french

        ? "Le CV complet est joint directement à cet e-mail."

        : "The complete CV is attached directly to this email.";


    await transporter.sendMail({

      from:
        `Tarek Ben El Mekki <${gmailUser}>`,

      to:
        email,

      replyTo:
        gmailUser,

      subject:
        selected.subject,


      text: [

        french
          ? "Bonjour,"
          : "Hello,",

        "",

        headline,

        "",

        spamText,

        "",

        attachmentText,

        "",

        "Tarek Ben El Mekki",

        "https://tarekbenelmekki.vercel.app/",

      ].join(
        "\n",
      ),


      html: `
<!doctype html>

<html>

<body
  style="
    margin:0;
    padding:0;
    background:#080808;
    color:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
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
      background:#080808;
      padding:32px 14px;
    "
  >

    <tr>

      <td
        align="center"
      >

        <table
          role="presentation"
          width="600"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            width:100%;
            max-width:600px;
          "
        >

          <!-- HEADER -->

          <tr>

            <td
              style="
                padding:18px 0;
                border-bottom:1px solid #242424;
                font-family:Consolas,monospace;
                font-size:12px;
                color:#777777;
                letter-spacing:.04em;
              "
            >

              TBEM.<span
                style="
                  color:#3b82f6;
                "
              >CV</span>

              &nbsp;&nbsp;/&nbsp;&nbsp;

              ${selected.label}

            </td>

          </tr>


          <!-- INTRO -->

          <tr>

            <td
              style="
                padding:34px 0 20px;
              "
            >

              <div
                style="
                  margin-bottom:10px;
                  font-family:Consolas,monospace;
                  font-size:12px;
                  color:#3b82f6;
                "
              >
                $ delivery_complete
              </div>


              <h1
                style="
                  margin:0 0 14px;
                  font-size:24px;
                  line-height:1.25;
                  font-weight:600;
                  color:#ffffff;
                "
              >
                ${headline}
              </h1>


              <p
                style="
                  margin:0;
                  font-size:14px;
                  line-height:1.75;
                  color:#999999;
                "
              >

                ${spamText}

              </p>

            </td>

          </tr>


          <!-- CV PREVIEW -->

          <tr>

            <td
              style="
                padding:16px 0 20px;
              "
            >

              <img
                src="cid:tbem-cv-preview"
                alt="Tarek Ben El Mekki CV preview"
                width="600"
                style="
                  display:block;
                  width:100%;
                  max-width:600px;
                  height:auto;
                  border:1px solid #262626;
                "
              />

            </td>

          </tr>


          <!-- ATTACHMENT STATUS -->

          <tr>

            <td
              align="center"
              style="
                padding:10px 0 34px;
              "
            >

              <div
                style="
                  display:inline-block;
                  padding:13px 24px;
                  border:1px solid #3b82f6;
                  border-radius:7px;
                  color:#ffffff;
                  background:#3b82f6;
                  font-size:14px;
                  font-weight:600;
                "
              >

                ${
                  french

                    ? "CV joint à cet e-mail"

                    : "CV attached to this email"
                }

              </div>

            </td>

          </tr>


          <!-- FOOTER -->

          <tr>

            <td
              style="
                padding:20px 0;
                border-top:1px solid #242424;
                font-size:12px;
                line-height:1.8;
                color:#696969;
              "
            >

              Tarek Ben El Mekki

              <br />

              <a
                href="https://tarekbenelmekki.vercel.app/"
                style="
                  color:#8aaeff;
                  text-decoration:none;
                "
              >
                tarekbenelmekki.vercel.app
              </a>

            </td>

          </tr>

        </table>

      </td>

    </tr>

  </table>

</body>

</html>
      `,


      attachments: [

        {

          filename:
            selected.preview,

          path:
            previewPath,

          cid:
            "tbem-cv-preview",

          contentDisposition:
            "inline",

        },


        {

          filename:
            selected.attachmentName,

          path:
            cvPath,

          contentType:
            "application/pdf",

          contentDisposition:
            "attachment",

        },

      ],

    });


    return NextResponse.json(
      {

        success:
          true,

        languageLabel:
          selected.label,

      },
      {

        headers: {

          "Cache-Control":
            "no-store",

        },

      },
    );


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
        status:
          500,
      },
    );

  }

}
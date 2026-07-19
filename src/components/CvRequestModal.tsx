"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


type CvLanguage =
  "en" |
  "fr";


type RequestState =
  "idle" |
  "sending" |
  "success" |
  "error";


const languages = [

  {
    value:
      "en" as const,

    title:
      "English",

    subtitle:
      "CV · English version",

  },

  {
    value:
      "fr" as const,

    title:
      "Français",

    subtitle:
      "CV · Version française",

  },

];


export function CvRequestModal() {

  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );


  const [
    email,
    setEmail,
  ] =
    useState(
      "",
    );


  const [
    language,
    setLanguage,
  ] =
    useState<CvLanguage>(
      "en",
    );


  const [
    status,
    setStatus,
  ] =
    useState<RequestState>(
      "idle",
    );


  const [
    message,
    setMessage,
  ] =
    useState(
      "",
    );


  const [
    animationStep,
    setAnimationStep,
  ] =
    useState(
      0,
    );


  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const openModal =
    useCallback(
      () => {

        setStatus(
          "idle",
        );

        setMessage(
          "",
        );

        setAnimationStep(
          0,
        );

        setOpen(
          true,
        );

      },
      [],
    );


  const closeModal =
    useCallback(
      () => {

        if (
          status !==
          "sending"
        ) {

          setOpen(
            false,
          );

        }

      },
      [
        status,
      ],
    );


  useEffect(
    () => {

      const handler =
        (
          event:
            MouseEvent,
        ) => {

          if (
            !(
              event.target
              instanceof
              Element
            )
          ) {

            return;

          }


          const trigger =
            event.target.closest(
              "a, button",
            );


          const text =
            trigger
              ?.textContent
              ?.replace(
                /\s+/g,
                " ",
              )
              .trim();


          if (
            text?.includes(
              "Request CV",
            )
          ) {

            event.preventDefault();

            openModal();

          }

        };


      document.addEventListener(
        "click",
        handler,
      );


      return () =>
        document.removeEventListener(
          "click",
          handler,
        );

    },
    [
      openModal,
    ],
  );


  useEffect(
    () => {

      if (
        !open
      ) {

        return;

      }


      const oldOverflow =
        document.body.style
          .overflow;


      document.body.style
        .overflow =
        "hidden";


      const keyHandler =
        (
          event:
            KeyboardEvent,
        ) => {

          if (
            event.key ===
              "Escape" &&
            status !==
              "sending"
          ) {

            setOpen(
              false,
            );

          }

        };


      window.addEventListener(
        "keydown",
        keyHandler,
      );


      const timer =
        window.setTimeout(
          () =>
            inputRef.current
              ?.focus(),
          120,
        );


      return () => {

        window.clearTimeout(
          timer,
        );

        window.removeEventListener(
          "keydown",
          keyHandler,
        );

        document.body.style
          .overflow =
          oldOverflow;

      };

    },
    [
      open,
      status,
    ],
  );


  useEffect(
    () => {

      if (
        status !==
        "sending"
      ) {

        return;

      }


      const first =
        window.setTimeout(
          () =>
            setAnimationStep(
              1,
            ),
          650,
        );


      const second =
        window.setTimeout(
          () =>
            setAnimationStep(
              2,
            ),
          1350,
        );


      const third =
        window.setTimeout(
          () =>
            setAnimationStep(
              3,
            ),
          2050,
        );


      return () => {

        window.clearTimeout(
          first,
        );

        window.clearTimeout(
          second,
        );

        window.clearTimeout(
          third,
        );

      };

    },
    [
      status,
    ],
  );


  async function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();


    const normalized =
      email
        .trim()
        .toLowerCase();


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        normalized,
      )
    ) {

      setStatus(
        "error",
      );

      setMessage(
        "Please enter a valid email address.",
      );

      return;

    }


    setAnimationStep(
      0,
    );

    setStatus(
      "sending",
    );

    setMessage(
      "",
    );


    try {

      const request =
        fetch(
          "/api/request-cv",
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body:
              JSON.stringify({

                email:
                  normalized,

                language,

                website:
                  "",

              }),

          },
        );


      /*
        Guarantee enough time for the
        secure-delivery animation to
        actually be visible.
      */

      const minimumAnimation =
        new Promise<void>(
          (
            resolve,
          ) => {

            window.setTimeout(
              resolve,
              2600,
            );

          },
        );


      const [
        response,
      ] =
        await Promise.all([

          request,

          minimumAnimation,

        ]);


      const payload =
        await response.json();


      if (
        !response.ok
      ) {

        throw new Error(
          payload.error ||
          "The CV could not be sent.",
        );

      }


      setAnimationStep(
        4,
      );


      await new Promise<void>(
        (
          resolve,
        ) => {

          window.setTimeout(
            resolve,
            350,
          );

        },
      );


      setStatus(
        "success",
      );


      setMessage(
        normalized,
      );


  } catch (
      error
    ) {

      setStatus(
        "error",
      );


      setMessage(

        error
          instanceof Error

          ? error.message

          : "The CV could not be sent.",

      );

    }

  }


  if (
    !open
  ) {

    return null;

  }


  const selected =
    languages.find(
      (
        item,
      ) =>
        item.value ===
        language,
    )!;


  return (

    <div
      className="cv-request-overlay cv-secure-overlay"
      onMouseDown={
        (
          event,
        ) => {

          if (
            event.target ===
              event.currentTarget
          ) {

            closeModal();

          }

        }
      }
    >

      <section
        className="cv-request-modal cv-language-modal cv-secure-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-modal-title"
      >

        <div className="cv-request-terminal-bar">

          <span>
            TBEM.
            <strong>
              CV
            </strong>
          </span>


          <button
            type="button"
            onClick={
              closeModal
            }
            disabled={
              status ===
              "sending"
            }
            aria-label="Close"
          >
            ×
          </button>

        </div>


        {status ===
        "sending" ? (

          <div className="cv-secure-sending">

            <div className="cv-secure-eyebrow">
              TBEM. SECURE DELIVERY SYSTEM
            </div>


            <div className="cv-secure-command">
              $ dispatch_cv
              <span className="cv-secure-cursor">
                _
              </span>
            </div>


            <div className="cv-secure-orbit">

              <span />

              <i />

              <strong>
                {Math.min(
                  animationStep + 1,
                  4,
                )}
              </strong>

            </div>


            <div className="cv-secure-steps">

              <div
                className={
                  animationStep >= 0
                    ? "is-active"
                    : ""
                }
              >
                <span>
                  01
                </span>

                Validate recipient

                <strong>
                  {animationStep > 0
                    ? "done"
                    : "running"}
                </strong>
              </div>


              <div
                className={
                  animationStep >= 1
                    ? "is-active"
                    : ""
                }
              >
                <span>
                  02
                </span>

                Select {selected.title} CV

                <strong>
                  {animationStep > 1
                    ? "done"
                    : animationStep === 1
                      ? "running"
                      : "waiting"}
                </strong>
              </div>


              <div
                className={
                  animationStep >= 2
                    ? "is-active"
                    : ""
                }
              >
                <span>
                  03
                </span>

                Encrypt mail transport

                <strong>
                  {animationStep > 2
                    ? "done"
                    : animationStep === 2
                      ? "running"
                      : "waiting"}
                </strong>
              </div>


              <div
                className={
                  animationStep >= 3
                    ? "is-active"
                    : ""
                }
              >
                <span>
                  04
                </span>

                Attach document & dispatch

                <strong>
                  {animationStep >= 4
                    ? "sent"
                    : animationStep === 3
                      ? "running"
                      : "waiting"}
                </strong>
              </div>

            </div>


            <div className="cv-secure-progress">

              <span />

            </div>


            <p className="cv-secure-status">

              <i />

              Securely delivering your CV by email...

            </p>

          </div>

        ) : status ===
        "success" ? (

          <div className="cv-secure-success">

            <div className="cv-secure-eyebrow">
              TBEM. SECURE DELIVERY SYSTEM
            </div>


            <div className="cv-secure-command">
              $ delivery_complete
            </div>


            <div className="cv-secure-check">

              <span>
                ✓
              </span>

            </div>


            <h2>
              CV sent successfully.
            </h2>


            <p>

              <strong>
                {selected.title}
              </strong>

              {" "}
              version sent to

              {" "}

              <span>
                {message}
              </span>

            </p>


            <div className="cv-secure-email-only">

              <strong>
                Email delivery only
              </strong>

              <span>
                The CV is not available as a direct
                download from this website. The PDF
                is attached to the email that was
                just sent.
              </span>

            </div>


            <div className="cv-secure-mail-actions">

              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noreferrer"
              >
                Open Gmail
              </a>


              <a
                href="https://mail.google.com/mail/u/0/#spam"
                target="_blank"
                rel="noreferrer"
              >
                Check Spam
              </a>

            </div>


            <button
              type="button"
              className="cv-request-submit"
              onClick={
                closeModal
              }
            >
              Close
            </button>

          </div>

        ) : (

          <form
            className="cv-request-form"
            onSubmit={
              submit
            }
          >

            <div className="cv-request-kicker">
              $ request_cv
            </div>


            <h2
              id="cv-modal-title"
            >
              Request my CV
            </h2>


            <p className="cv-request-intro">
              Select your preferred language.
              The CV will be delivered privately
              to your email.
            </p>


            <fieldset className="cv-language-selector">

              <legend>
                CV language
              </legend>


              {languages.map(
                (
                  item,
                ) => (

                  <button
                    key={
                      item.value
                    }
                    type="button"
                    className={
                      language ===
                      item.value

                        ? "is-selected"

                        : ""
                    }
                    onClick={
                      () =>
                        setLanguage(
                          item.value,
                        )
                    }
                  >

                    <span className="cv-language-code">
                      {item.value.toUpperCase()}
                    </span>


                    <span>

                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.subtitle}
                      </small>

                    </span>


                    <i>
                      {language ===
                      item.value
                        ? "●"
                        : "○"}
                    </i>

                  </button>

                ),
              )}

            </fieldset>


            <label className="cv-request-field">

              <span>
                Email address
              </span>


              <input
                ref={
                  inputRef
                }
                type="email"
                value={
                  email
                }
                onChange={
                  (
                    event,
                  ) => {

                    setEmail(
                      event.target.value,
                    );

                    if (
                      status ===
                      "error"
                    ) {

                      setStatus(
                        "idle",
                      );

                    }

                  }
                }
                placeholder="name@example.com"
                required
                autoComplete="email"
              />

            </label>


            {status ===
            "error" ? (

              <p
                className="cv-request-error"
                role="alert"
              >
                {message}
              </p>

            ) : null}


            <button
              type="submit"
              className="cv-request-submit"
            >
              Send {selected.title} CV
            </button>


            <p className="cv-request-privacy">
              No direct download link is exposed.
              Your email is used only for CV delivery.
            </p>

          </form>

        )}

      </section>

    </div>

  );

}
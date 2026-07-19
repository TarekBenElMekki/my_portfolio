"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";


type RequestState =
  | "idle"
  | "sending"
  | "success"
  | "error";


const GMAIL_INBOX_URL =
  "https://mail.google.com/mail/u/0/#inbox";

const GMAIL_SPAM_URL =
  "https://mail.google.com/mail/u/0/#spam";


export function CvRequestModal() {

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);


  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    website,
    setWebsite,
  ] =
    useState("");


  const [
    requestState,
    setRequestState,
  ] =
    useState<RequestState>(
      "idle",
    );


  const [
    message,
    setMessage,
  ] =
    useState("");


  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const closeModal =
    useCallback(
      () => {

        if (
          requestState ===
          "sending"
        ) {

          return;
        }


        setIsOpen(
          false,
        );


        window.setTimeout(
          () => {

            setRequestState(
              "idle",
            );

            setMessage("");

          },
          180,
        );

      },
      [
        requestState,
      ],
    );


  /*
    Any visible "Request CV" link/button
    opens this modal.
  */

  useEffect(
    () => {

      const handleRequestClick = (
        event: MouseEvent,
      ) => {

        const target =
          event.target;


        if (
          !(
            target instanceof
            Element
          )
        ) {

          return;
        }


        const trigger =
          target.closest(
            "a, button",
          );


        if (
          !trigger
        ) {

          return;
        }


        const text =
          trigger.textContent
            ?.replace(
              /\s+/g,
              " ",
            )
            .trim()
            .toLowerCase();


        if (
          text !==
          "request cv"
        ) {

          return;
        }


        event.preventDefault();


        setRequestState(
          "idle",
        );

        setMessage("");

        setIsOpen(
          true,
        );
      };


      document.addEventListener(
        "click",
        handleRequestClick,
      );


      return () => {

        document.removeEventListener(
          "click",
          handleRequestClick,
        );

      };

    },
    [],
  );


  /*
    Lock page scrolling while modal is open.
  */

  useEffect(
    () => {

      if (
        !isOpen
      ) {

        return;
      }


      const previousOverflow =
        document.body.style
          .overflow;


      document.body.style
        .overflow =
        "hidden";


      const focusTimer =
        window.setTimeout(
          () => {

            if (
              requestState ===
              "idle" ||
              requestState ===
              "error"
            ) {

              inputRef.current
                ?.focus();
            }

          },
          120,
        );


      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {

        if (
          event.key ===
          "Escape"
        ) {

          closeModal();
        }

      };


      window.addEventListener(
        "keydown",
        handleKeyDown,
      );


      return () => {

        window.clearTimeout(
          focusTimer,
        );


        document.body.style
          .overflow =
          previousOverflow;


        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );

      };

    },
    [
      closeModal,
      isOpen,
      requestState,
    ],
  );


  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();


    if (
      requestState ===
      "sending"
    ) {

      return;
    }


    const normalizedEmail =
      email
        .trim()
        .toLowerCase();


    if (
      !normalizedEmail
    ) {

      setRequestState(
        "error",
      );


      setMessage(
        "Please enter your email address.",
      );

      return;
    }


    setRequestState(
      "sending",
    );

    setMessage("");


    try {

      const response =
        await fetch(
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
                  normalizedEmail,

                website,
              }),
          },
        );


      const result =
        (await response.json()) as {
          success?: boolean;

          error?: string;

          message?: string;
        };


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
            "Unable to send the CV.",
        );
      }


      setRequestState(
        "success",
      );


      setMessage(
        normalizedEmail,
      );


    } catch (
      error
    ) {

      setRequestState(
        "error",
      );


      setMessage(
        error instanceof Error

          ? error.message

          : "Unable to send the CV.",
      );

    }

  }


  if (
    !isOpen
  ) {

    return null;
  }


  return (

    <div
      className="cv-request-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-request-title"
      onMouseDown={(
        event,
      ) => {

        if (
          event.target ===
          event.currentTarget
        ) {

          closeModal();
        }

      }}
    >

      <div className="cv-request-dialog">


        <header className="cv-request-header">

          <div className="cv-request-heading">

            <span>
              TBEM · CV DELIVERY
            </span>

            <h2 id="cv-request-title">

              {requestState ===
              "sending"

                ? "Preparing delivery"

                : requestState ===
                    "success"

                  ? "Delivery complete"

                  : "Request my CV"}

            </h2>

          </div>


          <button
            type="button"
            className="cv-request-close"
            onClick={
              closeModal
            }
            disabled={
              requestState ===
              "sending"
            }
            aria-label="Close CV request"
          >
            ×
          </button>

        </header>


        {requestState ===
        "sending" ? (

          <div
            className="cv-send-loader"
            role="status"
            aria-live="polite"
          >

            <div className="cv-send-loader-brand">

              <span className="cv-send-loader-logo">
                TBEM.
              </span>

              <span>
                SECURE DELIVERY SYSTEM
              </span>

            </div>


            <div className="cv-send-terminal">

              <div className="cv-send-command">

                <span>
                  $
                </span>

                <code>
                  dispatch_cv
                </code>

              </div>


              <div className="cv-send-recipient">

                <span>
                  recipient
                </span>

                <strong>
                  {email}
                </strong>

              </div>


              <div className="cv-send-sequence">


                <div className="cv-send-step cv-send-step--1">

                  <span className="cv-send-step-indicator">
                    01
                  </span>

                  <span>
                    validating request
                  </span>

                  <span className="cv-send-step-status">
                    done
                  </span>

                </div>


                <div className="cv-send-step cv-send-step--2">

                  <span className="cv-send-step-indicator">
                    02
                  </span>

                  <span>
                    preparing CV
                  </span>

                  <span className="cv-send-step-status">
                    ready
                  </span>

                </div>


                <div className="cv-send-step cv-send-step--3">

                  <span className="cv-send-step-indicator">
                    03
                  </span>

                  <span>
                    establishing secure mail channel
                  </span>

                  <span className="cv-send-step-status">
                    sending
                  </span>

                </div>


              </div>


              <div
                className="cv-send-progress"
                aria-hidden="true"
              >

                <span />

              </div>


              <div className="cv-send-live">

                <span className="cv-send-pulse" />

                Sending your CV

                <span className="cv-send-dots">
                  ...
                </span>

              </div>

            </div>


            <p className="cv-send-wait">
              Please keep this window open for a moment.
            </p>

          </div>


        ) : requestState ===
        "success" ? (

          <div className="cv-request-success">


            <div className="cv-success-terminal-line">

              <span>
                $
              </span>

              delivery_complete

            </div>


            <div
              className="cv-request-success-icon"
              aria-hidden="true"
            >
              ✓
            </div>


            <h3>
              CV sent successfully.
            </h3>


            <p className="cv-success-recipient">

              Sent to

              <strong>
                {message}
              </strong>

            </p>


            <div
              className="cv-spam-warning"
              role="note"
            >

              <div className="cv-spam-warning-icon">
                !
              </div>


              <div>

                <strong>
                  Please check your Spam / Junk folder.
                </strong>

                <p>
                  If the email is not visible in your inbox,
                  it may have been placed in Spam.
                  Open it and mark it as
                  <strong> Not spam</strong>.
                </p>

              </div>

            </div>


            <div className="cv-mail-actions">


              <a
                href={
                  GMAIL_INBOX_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="cv-mail-action cv-mail-action--primary"
              >

                <span className="cv-mail-action-icon">
                  M
                </span>

                <span>

                  <strong>
                    Open Gmail
                  </strong>

                  <small>
                    Go directly to your inbox
                  </small>

                </span>

                <span
                  className="cv-mail-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>

              </a>


              <a
                href={
                  GMAIL_SPAM_URL
                }
                target="_blank"
                rel="noopener noreferrer"
                className="cv-mail-action cv-mail-action--spam"
              >

                <span className="cv-mail-action-icon">
                  !
                </span>

                <span>

                  <strong>
                    Check Spam
                  </strong>

                  <small>
                    Open Gmail Spam directly
                  </small>

                </span>

                <span
                  className="cv-mail-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>

              </a>


            </div>


            <button
              type="button"
              className="cv-success-close"
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
              handleSubmit
            }
          >

            <div className="cv-request-intro">

              <span className="cv-request-command">
                $ request_cv
              </span>

              <p>
                Enter your email address and
                I&apos;ll send you access to my CV.
              </p>

            </div>


            <label
              className="cv-request-field"
              htmlFor="cv-request-email"
            >

              <span>
                Email address
              </span>


              <input
                ref={
                  inputRef
                }
                id="cv-request-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={
                  email
                }
                onChange={(
                  event,
                ) => {

                  setEmail(
                    event.target.value,
                  );


                  if (
                    requestState ===
                    "error"
                  ) {

                    setRequestState(
                      "idle",
                    );

                    setMessage("");

                  }

                }}
                required
                maxLength={254}
              />

            </label>


            <div
              className="cv-request-honeypot"
              aria-hidden="true"
            >

              <label>

                Website

                <input
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={
                    website
                  }
                  onChange={(
                    event,
                  ) => {

                    setWebsite(
                      event.target.value,
                    );

                  }}
                />

              </label>

            </div>


            {requestState ===
              "error" &&
            message ? (

              <p
                className="cv-request-message cv-request-message--error"
                role="alert"
              >
                {message}
              </p>

            ) : null}


            <button
              type="submit"
              className="cv-request-submit"
            >

              <span>
                Send CV to my email
              </span>

              <span
                aria-hidden="true"
              >
                →
              </span>

            </button>


            <p className="cv-request-privacy">
              Your email is used only to deliver the requested CV.
            </p>

          </form>

        )}


      </div>

    </div>

  );

}
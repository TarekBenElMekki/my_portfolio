"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import type {
  PortfolioProject,
} from "@/data/portfolio";


type SheetsFullscreenModalProps = {

  project:
    PortfolioProject;

  onClose:
    () => void;

};


export function SheetsFullscreenModal({
  project,
  onClose,
}: SheetsFullscreenModalProps) {


  const sheets =
    project.media.filter(
      (media) =>
        media.kind ===
        "sheet",
    );


  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);


  const closeButtonRef =
    useRef<HTMLButtonElement>(
      null,
    );


  const activeSheet =
    sheets[
      activeIndex
    ];


  const showPrevious =
    () => {

      setActiveIndex(
        (current) =>
          current === 0

            ? sheets.length - 1

            : current - 1,
      );

    };


  const showNext =
    () => {

      setActiveIndex(
        (current) =>
          (
            current +
            1
          ) %
          sheets.length,
      );

    };


  useEffect(
    () => {

      const previousOverflow =
        document.body.style
          .overflow;


      const previouslyFocused =
        document.activeElement
          instanceof HTMLElement

          ? document.activeElement

          : null;


      document.body.style
        .overflow =
        "hidden";


      const handleKeyDown =
        (
          event:
            KeyboardEvent,
        ) => {

          if (
            event.key ===
            "Escape"
          ) {

            onClose();

          }


          if (
            event.key ===
              "ArrowLeft" &&
            sheets.length >
              1
          ) {

            setActiveIndex(
              (current) =>
                current === 0

                  ? sheets.length -
                    1

                  : current -
                    1,
            );

          }


          if (
            event.key ===
              "ArrowRight" &&
            sheets.length >
              1
          ) {

            setActiveIndex(
              (current) =>
                (
                  current +
                  1
                ) %
                sheets.length,
            );

          }

        };


      window.addEventListener(
        "keydown",
        handleKeyDown,
      );


      const focusTimer =
        window.setTimeout(
          () => {

            closeButtonRef.current
              ?.focus();

          },
          0,
        );


      return () => {

        window.clearTimeout(
          focusTimer,
        );


        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );


        document.body.style
          .overflow =
          previousOverflow;


        previouslyFocused
          ?.focus();

      };

    },
    [
      onClose,
      sheets.length,
    ],
  );


  if (
    sheets.length === 0 ||
    !activeSheet
  ) {

    return null;
  }


  return createPortal(

    <div
      className="sheets-fullscreen-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Google Sheets project previews"
    >


      <div className="sheets-fullscreen-stage">

        <iframe
          key={
            activeSheet.src
          }
          src={
            activeSheet.src
          }
          title={`Google Sheets preview ${
            activeIndex +
            1
          }`}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />

      </div>


      <div className="sheets-fullscreen-topbar">

        <div className="sheets-fullscreen-counter">

          <span>
            {String(
              activeIndex +
                1,
            ).padStart(
              2,
              "0",
            )}
          </span>

          <i>
            /
          </i>

          <span>
            {String(
              sheets.length,
            ).padStart(
              2,
              "0",
            )}
          </span>

        </div>


        <button
          ref={
            closeButtonRef
          }
          type="button"
          className="sheets-fullscreen-close"
          onClick={
            onClose
          }
          aria-label="Close Sheets preview"
        >

          <X
            size={20}
            aria-hidden="true"
          />

        </button>

      </div>


      {sheets.length >
      1 ? (

        <>

          <button
            type="button"
            className="
              sheets-fullscreen-arrow
              sheets-fullscreen-arrow--previous
            "
            onClick={
              showPrevious
            }
            aria-label="Previous Sheet"
          >

            <ArrowLeft
              size={22}
              aria-hidden="true"
            />

          </button>


          <button
            type="button"
            className="
              sheets-fullscreen-arrow
              sheets-fullscreen-arrow--next
            "
            onClick={
              showNext
            }
            aria-label="Next Sheet"
          >

            <ArrowRight
              size={22}
              aria-hidden="true"
            />

          </button>

        </>

      ) : null}


      <div className="sheets-fullscreen-bottom">


        <div
          className="sheets-fullscreen-pagination"
          aria-label="Select Sheet preview"
        >

          {sheets.map(
            (
              sheet,
              index,
            ) => (

              <button
                type="button"
                key={
                  sheet.src
                }
                className={
                  index ===
                  activeIndex

                    ? "is-active"

                    : ""
                }
                onClick={
                  () => {

                    setActiveIndex(
                      index,
                    );

                  }
                }
                aria-label={`Show Sheet ${
                  index +
                  1
                }`}
              />

            ),
          )}

        </div>


        {activeSheet.href ? (

          <a
            className="sheets-fullscreen-open"
            href={
              activeSheet.href
            }
            target="_blank"
            rel="noopener noreferrer"
          >

            Open Sheet

            <ArrowUpRight
              size={16}
              aria-hidden="true"
            />

          </a>

        ) : null}


      </div>


    </div>,

    document.body,

  );

}
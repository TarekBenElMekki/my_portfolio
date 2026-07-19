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


type PromotionalFullscreenModalProps = {

  project:
    PortfolioProject;

  onClose:
    () => void;

};


export function PromotionalFullscreenModal({
  project,
  onClose,
}: PromotionalFullscreenModalProps) {


  const websites =
    project.media.filter(
      (media) =>
        media.kind ===
        "website",
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


  const activeWebsite =
    websites[
      activeIndex
    ];


  const showPrevious =
    () => {

      setActiveIndex(
        (current) =>
          current === 0

            ? websites.length -
              1

            : current -
              1,
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
          websites.length,
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
            websites.length >
              1
          ) {

            setActiveIndex(
              (current) =>
                current === 0

                  ? websites.length -
                    1

                  : current -
                    1,
            );

          }


          if (
            event.key ===
              "ArrowRight" &&
            websites.length >
              1
          ) {

            setActiveIndex(
              (current) =>
                (
                  current +
                  1
                ) %
                websites.length,
            );

          }

        };


      window.addEventListener(
        "keydown",
        handleKeyDown,
      );


      const timer =
        window.setTimeout(
          () => {

            closeButtonRef.current
              ?.focus();

          },
          0,
        );


      return () => {

        window.clearTimeout(
          timer,
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
      websites.length,
    ],
  );


  if (
    websites.length === 0 ||
    !activeWebsite
  ) {

    return null;
  }


  return createPortal(

    <div
      className="promotional-fullscreen-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Promotional web platforms"
    >


      <div className="promotional-fullscreen-stage">

        <iframe
          key={
            activeWebsite.src
          }
          src={
            activeWebsite.src
          }
          title={
            activeWebsite.title
          }
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />

      </div>


      <div className="promotional-fullscreen-topbar">

        <div className="promotional-fullscreen-site">

          <span>
            {activeWebsite.title}
          </span>

          <small>

            {String(
              activeIndex +
                1,
            ).padStart(
              2,
              "0",
            )}

            {" / "}

            {String(
              websites.length,
            ).padStart(
              2,
              "0",
            )}

          </small>

        </div>


        <button
          ref={
            closeButtonRef
          }
          type="button"
          className="promotional-fullscreen-close"
          onClick={
            onClose
          }
          aria-label="Close website preview"
        >

          <X
            size={20}
            aria-hidden="true"
          />

        </button>

      </div>


      {websites.length >
      1 ? (

        <>

          <button
            type="button"
            className="
              promotional-fullscreen-arrow
              promotional-fullscreen-arrow--previous
            "
            onClick={
              showPrevious
            }
            aria-label="Previous website"
          >

            <ArrowLeft
              size={22}
              aria-hidden="true"
            />

          </button>


          <button
            type="button"
            className="
              promotional-fullscreen-arrow
              promotional-fullscreen-arrow--next
            "
            onClick={
              showNext
            }
            aria-label="Next website"
          >

            <ArrowRight
              size={22}
              aria-hidden="true"
            />

          </button>

        </>

      ) : null}


      <div className="promotional-fullscreen-bottom">


        <div className="promotional-fullscreen-pagination">

          {websites.map(
            (
              website,
              index,
            ) => (

              <button
                key={
                  website.src
                }
                type="button"
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
                aria-label={`Open ${website.title}`}
              />

            ),
          )}

        </div>


        {activeWebsite.href ? (

          <a
            href={
              activeWebsite.href
            }
            target="_blank"
            rel="noopener noreferrer"
            className="promotional-fullscreen-open"
          >

            Open Website

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
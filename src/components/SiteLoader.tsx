"use client";

import {
  useEffect,
  useState,
} from "react";

export function SiteLoader() {
  const [isVisible, setIsVisible] =
    useState(true);

  const [isLeaving, setIsLeaving] =
    useState(false);

  useEffect(() => {
    let leaveTimer: number | undefined;
    let removeTimer: number | undefined;

    const finishLoading = () => {
      leaveTimer =
        window.setTimeout(() => {
          setIsLeaving(true);

          removeTimer =
            window.setTimeout(() => {
              setIsVisible(false);

              document.body.classList.remove(
                "site-is-loading",
              );
            }, 520);
        }, 1050);
    };

    document.body.classList.add(
      "site-is-loading",
    );

    if (
      document.readyState ===
      "complete"
    ) {
      finishLoading();
    } else {
      window.addEventListener(
        "load",
        finishLoading,
        {
          once: true,
        },
      );
    }

    return () => {
      document.body.classList.remove(
        "site-is-loading",
      );

      window.removeEventListener(
        "load",
        finishLoading,
      );

      if (leaveTimer) {
        window.clearTimeout(
          leaveTimer,
        );
      }

      if (removeTimer) {
        window.clearTimeout(
          removeTimer,
        );
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`site-loader ${
        isLeaving
          ? "is-leaving"
          : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Tarek Ben El Mekki portfolio"
    >
      <div
        className="site-loader-grid"
        aria-hidden="true"
      />

      <div className="site-loader-terminal">
        <div className="site-loader-header">
          <div
            className="site-loader-controls"
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>

          <span>
            tarek@portfolio: ~/boot
          </span>

          <span
            className="site-loader-status"
            aria-hidden="true"
          >
            boot
          </span>
        </div>

        <div className="site-loader-body">
          <div className="site-loader-command">
            <span>$</span>

            <span>
              initialize_portfolio
            </span>
          </div>

          <div
            className="site-loader-modules"
            aria-hidden="true"
          >
            <div
              className="
                site-loader-module
                site-loader-module--1
              "
            >
              <span>[01]</span>

              <strong>
                robotics
              </strong>

              <i />

              <em>
                ready
              </em>
            </div>

            <div
              className="
                site-loader-module
                site-loader-module--2
              "
            >
              <span>[02]</span>

              <strong>
                embedded systems
              </strong>

              <i />

              <em>
                ready
              </em>
            </div>

            <div
              className="
                site-loader-module
                site-loader-module--3
              "
            >
              <span>[03]</span>

              <strong>
                software
              </strong>

              <i />

              <em>
                ready
              </em>
            </div>
          </div>

          <div
            className="site-loader-progress"
            aria-hidden="true"
          >
            <div className="site-loader-progress-head">
              <span>
                loading system
              </span>

              <span>
                100%
              </span>
            </div>

            <div className="site-loader-progress-track">
              <span />
            </div>
          </div>

          <div
            className="site-loader-ready"
            aria-hidden="true"
          >
            <span />

            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import type { TimelineItem } from "@/data/portfolio";

type JourneyChartProps = {
  associativeItems: TimelineItem[];
  academicItems: TimelineItem[];
};

type JourneyTrackProps = {
  label: string;
  items: TimelineItem[];
  tone: "associative" | "academic";
  onCertificateOpen: (
    item: TimelineItem,
  ) => void;
};

const milestoneLevels = [
  0,
  1,
  0,
  1,
  0,
  1,
];

const mutedMilestoneTitles =
  new Set([
    "Team Member",
    "Team Leader",
    "Vice President",
    "Biomedical Engineering",
    "Embedded Systems & Medical Equipment",
  ]);

function isMutedMilestone(
  item: TimelineItem,
) {
  return mutedMilestoneTitles.has(
    item.title,
  );
}

function getPeriodLabel(
  period: string,
) {
  const [label] =
    period.split("·");

  return label.trim();
}

function getPeriodDate(
  period: string,
) {
  const parts =
    period.split("·");

  if (parts.length < 2) {
    return null;
  }

  return parts
    .slice(1)
    .join("·")
    .trim();
}

const projectSlugsByTitle:
  Record<string, string> = {

  "Promotional Web Platforms":
    "promotional-web-platforms",

  "Automation & Data System based on Sheets & App Script":
    "operational-automation-system",

  "Internal ERP Platform":
    "internal-erp-platform",

  "Autonomous Navigation Robot":
    "autonomous-navigation-robot",

  "Teleoperated Surgical Robotic Instrument":
    "surgical-robotic-instrument",
};

function openJourneyProject(
  projectSlug: string,
) {
  const projectsSection =
    document.getElementById(
      "projects",
    );

  projectsSection?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent(
        "portfolio:open-project",
        {
          detail: {
            slug: projectSlug,
          },
        },
      ),
    );
  }, 420);
}

function calculatePosition(
  index: number,
  total: number,
) {
  if (total <= 1) {
    return 50;
  }

  const start = 6;
  const end = 94;

  return (
    start +
    (index / (total - 1)) *
      (end - start)
  );
}

function JourneyTrack({
  label,
  items,
  tone,
  onCertificateOpen,
}: JourneyTrackProps) {
  return (
    <div
      className={`dual-journey-track dual-journey-track--${tone}`}
      aria-label={`${label} timeline`}
      style={
        {
          "--milestone-count":
            items.length,
        } as CSSProperties
      }
    >
      <div
        className="dual-journey-line"
        aria-hidden="true"
      />

      {items.map(
        (
          item,
          index,
        ) => {
          const position =
            calculatePosition(
              index,
              items.length,
            );

          const level =
            milestoneLevels[
              index %
                milestoneLevels.length
            ];

          const edgeClass =
            index === 0
              ? "is-first"
              : index ===
                  items.length - 1
                ? "is-last"
                : "";

          return (
            <article
              className={`dual-journey-milestone ${edgeClass} ${
                isMutedMilestone(
                  item,
                )
                  ? "is-muted-milestone"
                  : ""
              }`}
              key={`${tone}-${item.period}-${item.title}`}
              style={
                {
                  "--milestone-position":
                    `${position}%`,

                  "--milestone-level":
                    level,

                  "--milestone-index":
                    index,
                } as CSSProperties
              }
              aria-label={`${item.period}: ${item.title}. ${item.description}`}
              title={
                item.description
              }
            >
              <div className="dual-journey-copy">

                {item.image ? (
                  <button
                    type="button"
                    className="
                      dual-journey-media
                      dual-journey-media-button
                    "
                    onClick={() => {
                      onCertificateOpen(
                        item,
                      );
                    }}
                    aria-haspopup="dialog"
                    aria-label={`Open ${item.title} certificate in full screen`}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.title} certificate`}
                      width={420}
                      height={280}
                      sizes="
                        (max-width: 760px)
                        82px,
                        118px
                      "
                      className="dual-journey-media-image"
                      unoptimized
                    />

                    <span className="dual-journey-media-zoom">
                      View
                    </span>
                  </button>
                ) : null}

                <span>
                  {getPeriodLabel(
                    item.period,
                  )}
                </span>

                <h3>
                  {projectSlugsByTitle[
                    item.title
                  ] ? (
                    <a
                      href="#projects"
                      className="dual-journey-project-link"
                      onClick={(
                        event,
                      ) => {
                        event.preventDefault();

                        openJourneyProject(
                          projectSlugsByTitle[
                            item.title
                          ],
                        );
                      }}
                      aria-label={`Open ${item.title} case study`}
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>

                {item.specialty ? (

                  <span className="dual-journey-specialty">

                    {item.specialty}

                  </span>

                ) : null}
              </div>

              <span
                className="dual-journey-stem"
                aria-hidden="true"
              />

              <span
                className="dual-journey-node"
                aria-hidden="true"
              />

              {getPeriodDate(
                item.period,
              ) ? (
                <span className="dual-journey-date">
                  {getPeriodDate(
                    item.period,
                  )}
                </span>
              ) : null}

            </article>
          );
        },
      )}

      {tone ===
      "associative" ? (

        <div className="dual-journey-brand dual-journey-brand--aiesec">

          <div className="dual-journey-brand-image dual-journey-brand-image--aiesec">

            <Image
              src="/aiesec-logo.png"
              alt="AIESEC logo"
              width={360}
              height={110}
              sizes="118px"
              priority={false}
            />

          </div>

          <div className="dual-journey-brand-copy">

            <strong>
              AIESEC
            </strong>

            <span>
              Youth-led international organization working on cross-cultural exchange.
            </span>

          </div>

        </div>

      ) : (

        <div className="dual-journey-brand dual-journey-brand--istmt">

          <div className="dual-journey-brand-image dual-journey-brand-image--istmt">

            <Image
              src="/istmt-logo.png"
              alt="ISTMT logo"
              width={256}
              height={256}
              sizes="
                (max-width: 760px)
                32px,
                44px
              "
            />

          </div>

          <div className="dual-journey-brand-copy">

            <strong>
              ISTMT
            </strong>

            <span>
              Institut Supérieur des Technologies Médicales de Tunis
            </span>

          </div>

        </div>

      )}
    </div>
  );
}

export function JourneyChart({
  associativeItems,
  academicItems,
}: JourneyChartProps) {

  const [
    selectedCertificate,
    setSelectedCertificate,
  ] =
    useState<TimelineItem | null>(
      null,
    );

  useEffect(() => {

    if (
      !selectedCertificate
    ) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style
      .overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {

      if (
        event.key ===
        "Escape"
      ) {
        setSelectedCertificate(
          null,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {

      document.body.style
        .overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };

  }, [
    selectedCertificate,
  ]);

  return (
    <>
      <div className="dual-journey">

        <div className="dual-journey-topbar">

          <div
            className="dual-journey-legend"
            aria-label="Journey timeline legend"
          >

            <div className="dual-journey-legend-item">

              <span
                className="dual-journey-legend-line dual-journey-legend-line--associative"
                aria-hidden="true"
              />

              <div>
                <strong>
                  Associative journey
                </strong>

                <span>
                  Leadership, automation and digital systems
                </span>
              </div>

            </div>

            <div className="dual-journey-legend-item">

              <span
                className="dual-journey-legend-line dual-journey-legend-line--academic"
                aria-hidden="true"
              />

              <div>
                <strong>
                  Academic journey
                </strong>

                <span>
                  Biomedical, embedded and robotic systems
                </span>
              </div>

            </div>

          </div>

          <span className="dual-journey-scroll-hint">
            Drag to explore →
          </span>

        </div>

        <div
          className="dual-journey-viewport"
          role="region"
          aria-label="Associative and academic journey timeline"
          tabIndex={0}
        >

          <div className="dual-journey-canvas">

            <JourneyTrack
              label="Associative"
              items={
                associativeItems
              }
              tone="associative"
              onCertificateOpen={
                setSelectedCertificate
              }
            />

            <JourneyTrack
              label="Academic"
              items={
                academicItems
              }
              tone="academic"
              onCertificateOpen={
                setSelectedCertificate
              }
            />

          </div>

        </div>

      </div>

      {selectedCertificate?.image ? (

        <div
          className="certificate-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCertificate.title} certificate`}
          onClick={() => {
            setSelectedCertificate(
              null,
            );
          }}
        >

          <div
            className="certificate-modal-dialog"
            onClick={(
              event,
            ) => {
              event.stopPropagation();
            }}
          >

            <header className="certificate-modal-header">

              <div className="certificate-modal-heading">

                <span>
                  {getPeriodLabel(
                    selectedCertificate.period,
                  )}
                  {" · "}
                  {getPeriodDate(
                    selectedCertificate.period,
                  )}
                </span>

                <h2>
                  {
                    selectedCertificate.title
                  }
                </h2>

              </div>

              <button
                type="button"
                className="certificate-modal-close"
                onClick={() => {
                  setSelectedCertificate(
                    null,
                  );
                }}
                aria-label="Close certificate"
                autoFocus
              >
                <span aria-hidden="true">
                  ×
                </span>
              </button>

            </header>

            <div className="certificate-modal-stage">

              <Image
                src={
                  selectedCertificate.image
                }
                alt={`${selectedCertificate.title} certificate full-screen view`}
                fill
                sizes="100vw"
                className="certificate-modal-image"
                unoptimized
                priority
              />

            </div>

          </div>

        </div>

      ) : null}
    </>
  );
}
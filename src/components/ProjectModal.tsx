"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  FileText,
  Play,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { PortfolioProject } from "@/data/portfolio";

type ProjectModalProps = {
  project: PortfolioProject;
  onClose: () => void;
};

export function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeMedia = project.media[activeMediaIndex];

  const showPreviousMedia = () => {
    setActiveMediaIndex((current) =>
      current === 0
        ? project.media.length - 1
        : current - 1,
    );
  };

  const showNextMedia = () => {
    setActiveMediaIndex((current) =>
      (current + 1) % project.media.length,
    );
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (
        event.key === "ArrowLeft" &&
        project.media.length > 1
      ) {
        setActiveMediaIndex((current) =>
          current === 0
            ? project.media.length - 1
            : current - 1,
        );
      }

      if (
        event.key === "ArrowRight" &&
        project.media.length > 1
      ) {
        setActiveMediaIndex(
          (current) =>
            (current + 1) % project.media.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousOverflow;

      previouslyFocusedElement?.focus();
    };
  }, [onClose, project.media.length]);

  return createPortal(
    <div
      className="project-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <article
        className="project-modal"
        data-project-modal={project.slug}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.slug}`}
      >
        <header className="project-modal-header">
          <div className="project-modal-header-id">
            <span>Case study</span>
            <strong>{project.slug}</strong>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="project-modal-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="project-modal-scroll">
          <section className="project-modal-intro">
            <div className="project-modal-intro-meta">
              <span>{project.category}</span>
              <i aria-hidden="true" />
              <span>{project.year}</span>
              <i aria-hidden="true" />
              <span>{project.status}</span>
            </div>

            <h2 id={`project-modal-title-${project.slug}`}>
              {project.title}
            </h2>

            <p className="project-modal-lead">
              {project.description}
            </p>

            <div className="project-modal-fact-row">
              <div>
                <span>Role</span>
                <strong>{project.role}</strong>
              </div>

              <div>
                <span>Year</span>
                <strong>{project.year}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{project.status}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{project.category}</strong>
              </div>
            </div>
          </section>

          <div className="project-modal-body">
            <main className="project-modal-main">
              <section className="project-modal-introduction">
                <span className="project-modal-section-label">
                  Overview
                </span>

                {project.longDescription.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>

              <div className="project-modal-case-grid">
                <section>
                  <span className="project-modal-section-label">
                    Challenge
                  </span>

                  <p>{project.challenge}</p>
                </section>

                <section>
                  <span className="project-modal-section-label">
                    Solution
                  </span>

                  <p>{project.solution}</p>
                </section>
              </div>

              <section className="project-modal-list-section">
                <span className="project-modal-section-label">
                  Project highlights
                </span>

                <ul>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>

              <section className="project-modal-list-section">
                <span className="project-modal-section-label">
                  My contributions
                </span>

                <ul>
                  {project.responsibilities.map((responsibility) => (
                    <li key={responsibility}>
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </section>
            </main>

            <aside className="project-modal-sidebar">
              <section className="project-modal-technologies">
                <span className="project-modal-section-label">
                  Technologies
                </span>

                <div>
                  {project.technologies.map((technology) => (
                    <span key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
              </section>

              <section className="project-modal-documents">
                <span className="project-modal-section-label">
                  Documents
                </span>

                <div>
                  {project.documents.map((document) => (
                    <a
                      href={document.href}
                      download
                      key={document.href}
                    >
                      <FileText
                        size={18}
                        aria-hidden="true"
                      />

                      <span>
                        <strong>{document.title}</strong>

                        <small>
                          {document.description}
                        </small>
                      </span>

                      <span className="project-document-format">
                        {document.format}
                      </span>

                      <Download
                        size={16}
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </section>

                            {project.externalLinks?.length ? (
                <section className="project-modal-external-links">

                  <span className="project-modal-section-label">
                    Live websites
                  </span>

                  <div>

                    {project.externalLinks.map((link) => (

                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        <span>

                          <strong>
                            {link.title}
                          </strong>

                          <small>
                            Open live website
                          </small>

                        </span>

                        <ArrowUpRight
                          size={17}
                          aria-hidden="true"
                        />

                      </a>

                    ))}

                  </div>

                </section>
              ) : null}

              {/* === PROMOTIONAL LIVE WEBSITES START === */}

              {project.slug ===
              "promotional-web-platforms" ? (

                <section className="promotional-live-websites">

                  <div className="promotional-live-websites-heading">

                    <span>
                      LIVE WEBSITES
                    </span>

                    <p>
                      Selected promotional platforms developed for AIESEC.
                    </p>

                  </div>


                  <div className="promotional-live-websites-grid">

                    <a
                      href="https://liveitwithbardo.vercel.app/en"
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      <span className="promotional-live-website-index">
                        01
                      </span>

                      <span className="promotional-live-website-copy">

                        <strong>
                          Live It With Bardo
                        </strong>

                        <small>
                          liveitwithbardo.vercel.app
                        </small>

                      </span>

                      <span
                        className="promotional-live-website-arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>

                    </a>


                    <a
                      href="https://ait2030.aiesec.org.tn/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      <span className="promotional-live-website-index">
                        02
                      </span>

                      <span className="promotional-live-website-copy">

                        <strong>
                          AIT 2030
                        </strong>

                        <small>
                          ait2030.aiesec.org.tn
                        </small>

                      </span>

                      <span
                        className="promotional-live-website-arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>

                    </a>

                  </div>

                </section>

              ) : null}

              {/* === PROMOTIONAL LIVE WEBSITES END === */}

<a
                className="project-modal-contact"
                href={`mailto:benmekkitarek@gmail.com?subject=${encodeURIComponent(
                  `Question about ${project.title}`,
                )}`}
              >
                Discuss this project

                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                />
              </a>
            </aside>
          </div>

          <section className="project-media-gallery">
            <div className="project-media-gallery-heading">
              <div>
                <span className="project-modal-section-label">
                  Project media
                </span>

                <h3>
                  Images, demonstrations &amp; development
                </h3>
              </div>

              {project.media.length > 1 ? (
                <div className="project-media-navigation">
                  <button
                    type="button"
                    onClick={showPreviousMedia}
                    aria-label="Previous project media"
                  >
                    <ArrowLeft
                      size={18}
                      aria-hidden="true"
                    />
                  </button>

                  <span>
                    {String(activeMediaIndex + 1).padStart(
                      2,
                      "0",
                    )}

                    <i>/</i>

                    {String(project.media.length).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={showNextMedia}
                    aria-label="Next project media"
                  >
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="project-media-stage">
                            {activeMedia?.kind === "website" ? (

                <div className="project-website-preview">

                  <iframe
                    key={activeMedia.src}
                    src={activeMedia.src}
                    title={`${activeMedia.title} website preview`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />

                  {activeMedia.href ? (

                    <a
                      href={activeMedia.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-website-preview-open"
                    >

                      Open live website

                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                      />

                    </a>

                  ) : null}

                </div>

              ) : null}

{activeMedia?.kind === "image" ? (
                <Image
                  src={activeMedia.src}
                  alt={activeMedia.alt ?? activeMedia.title}
                  fill
                  sizes="(max-width: 760px) 100vw, 1100px"
                />
              ) : null}

              {activeMedia?.kind === "video" ? (
                <video
                  key={activeMedia.src}
                  src={activeMedia.src}
                  poster={activeMedia.poster}
                  controls
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support embedded
                  video.
                </video>
              ) : null}

              {activeMedia?.kind === "sheet" ? (
                <div
                  className="project-sheet-preview"
                  key={activeMedia.src}
                >
                  <iframe
                    src={activeMedia.src}
                    title="Google Sheets interactive preview"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />

                  {activeMedia.href ? (
                    <a
                      className="project-sheet-open"
                      href={activeMedia.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Google Sheet

                      <span aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : null}
                </div>
              ) : null}

{!activeMedia ? (
                <div className="project-media-empty">
                  No project media attached yet.
                </div>
              ) : null}
            </div>

            {activeMedia ? (
              <div className="project-media-description">
                <div>
                  <span>
                    {activeMedia.kind === "video" ? (
                      <Play
                        size={13}
                        aria-hidden="true"
                      />
                    ) : null}

                    {activeMedia.kind}
                  </span>

                  <strong>{activeMedia.title}</strong>
                </div>

                {activeMedia.caption ? (
                  <p>{activeMedia.caption}</p>
                ) : null}
              </div>
            ) : null}

            {project.media.length > 1 ? (
              <div
                className="project-media-thumbnails"
                aria-label="Project media gallery"
              >
                {project.media.map((media, index) => (
                  <button
                    type="button"
                    key={`${media.kind}-${media.src}`}
                    className={
                      index === activeMediaIndex
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setActiveMediaIndex(index)
                    }
                    aria-label={`Show ${media.title}`}
                  >
                    <span className="project-media-thumb-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="project-media-thumb-copy">
                      <strong>{media.title}</strong>

                      <small>{media.kind}</small>
                    </div>

                    {media.kind === "video" ? (
                      <Play
                        size={14}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </article>
    </div>,
    document.body,
  );
}
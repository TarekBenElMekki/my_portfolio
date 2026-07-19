"use client";

import {
  ArrowDown,
  Download,
  GitBranch,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";

type TerminalHeroProps = {
  cvHref: string;
  cvLabel: string;
};

const focusPhrases = [
  "Building intelligent robotic systems",
  "Developing embedded medical technology",
  "Connecting mechanics, electronics and software",
  "Automating complex operational workflows",
  "Turning engineering ideas into working prototypes",
];

export function TerminalHero({
  cvHref,
  cvLabel,
}: TerminalHeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = focusPhrases[phraseIndex];

    let delay = isDeleting ? 30 : 54;

    if (!isDeleting && displayedText === phrase) {
      delay = 1900;
    }

    if (isDeleting && displayedText === "") {
      delay = 280;
    }

    const timeout = window.setTimeout(() => {
      if (!isDeleting && displayedText === phrase) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && displayedText === "") {
        setIsDeleting(false);

        setPhraseIndex(
          (current) => (current + 1) % focusPhrases.length,
        );

        return;
      }

      if (isDeleting) {
        setDisplayedText(
          phrase.slice(
            0,
            Math.max(0, displayedText.length - 1),
          ),
        );

        return;
      }

      setDisplayedText(
        phrase.slice(0, displayedText.length + 1),
      );
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [displayedText, isDeleting, phraseIndex]);

  return (
    <section className="terminal-hero">
      <div
        className="terminal-hero-glow"
        aria-hidden="true"
      />

      <div className="terminal-hero-inner">
        <div className="terminal-window">
          <div className="terminal-window-header">
            <div
              className="terminal-window-controls"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>

            <span className="terminal-window-title">
              tarek@portfolio: ~/profile
            </span>

            <span className="terminal-online">
              <span aria-hidden="true" />
              online
            </span>
          </div>

          <div className="terminal-window-body">
            <div className="terminal-command">
              <span>$</span>
              <span>whoami</span>
            </div>

            <div className="terminal-identity">
              <span className="terminal-eyebrow">
                Multidisciplinary engineering profile
              </span>

              <h1>Tarek Ben El Mekki</h1>

              <p className="terminal-role">
                Biomedical &amp; Embedded Systems Master Graduate
              </p>
            </div>

            <div className="terminal-command terminal-focus-command">
              <span>$</span>
              <span>current_focus</span>
            </div>

            <div
              className="terminal-dynamic-line"
              aria-live="polite"
            >
              <span className="terminal-chevron">
                &gt;
              </span>

              <span className="terminal-typed-text">
                {displayedText}
              </span>

              <span
                className="terminal-cursor"
                aria-hidden="true"
              />
            </div>

            <p className="terminal-description">
              I design multidisciplinary systems combining
              robotics, embedded control, medical technology,
              automation and software.
            </p>

            <div className="terminal-system-info">
              <span>
                <strong>Location</strong>
                Tunisia
              </span>

              <span>
                <strong>Domains</strong>
                Robotics · MedTech · Software
              </span>

              <span>
                <strong>Status</strong>
                Open to opportunities
              </span>
            </div>
          </div>
        </div>

        <div className="terminal-hero-actions">
          <a
            className="primary-action"
            href="#projects"
          >
            Explore selected work
            <ArrowDown size={18} aria-hidden="true" />
          </a>

          <a
            className="secondary-action"
            href={cvHref}
          >
            {cvLabel}
            <Download size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="terminal-hero-links">
          <a
            href="https://github.com/TarekBenElMekki"
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={15} aria-hidden="true" />
            GitHub
          </a>

          <span aria-hidden="true" />

          <a href="mailto:benmekkitarek@gmail.com">
            <Mail size={15} aria-hidden="true" />
            Email
          </a>

          <span aria-hidden="true" />

          <span>Tunisia</span>
        </div>
      </div>
    </section>
  );
}
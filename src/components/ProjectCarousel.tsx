"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import type { PortfolioProject } from "@/data/portfolio";

type ProjectCarouselProps = {
  projects: PortfolioProject[];
};

const accents = ["#3f72af", "#655c9f", "#4f785f", "#8a654d"];

function getRelativePosition(
  index: number,
  activeIndex: number,
  total: number,
) {
  let position = index - activeIndex;
  const half = Math.floor(total / 2);

  if (position > half) {
    position -= total;
  }

  if (position < -half) {
    position += total;
  }

  if (total % 2 === 0 && position === half) {
    position = activeIndex % 2 === 0 ? half : -half;
  }

  return position;
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef<number | null>(null);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? projects.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
  };

  useEffect(() => {
    if (paused || projects.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % projects.length,
      );
    }, 5200);

    return () => {
      window.clearInterval(timer);
    };
  }, [paused, projects.length]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) {
      return;
    }

    const distance = event.clientX - dragStart.current;
    dragStart.current = null;

    if (distance > 55) {
      showPrevious();
    }

    if (distance < -55) {
      showNext();
    }
  };

  return (
    <div
      className="project-showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="project-carousel-stage"
        role="region"
        aria-label="Selected projects carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
      >
        {projects.map((project, index) => {
          const position = getRelativePosition(
            index,
            activeIndex,
            projects.length,
          );

          const distance = Math.abs(position);
          const isActive = position === 0;

          const style = {
            "--carousel-x": `${position * 72}%`,
            "--carousel-y": `${distance * 17}px`,
            "--carousel-rotation": `${position * 5.5}deg`,
            "--carousel-scale": `${1 - distance * 0.12}`,
            "--carousel-opacity":
              distance === 0 ? "1" : distance === 1 ? "0.76" : "0.34",
            "--carousel-z": `${20 - distance}`,
            "--project-accent": accents[index % accents.length],
          } as CSSProperties;

          return (
            <button
              type="button"
              className={`project-carousel-card ${
                isActive ? "is-active" : ""
              }`}
              style={style}
              key={project.title}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show project ${index + 1}: ${project.title}`}
              aria-current={isActive ? "true" : undefined}
            >
              <div className="project-carousel-visual">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 82vw, 430px"
                />

                <span className="project-carousel-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="project-carousel-content">
                <div className="project-carousel-meta">
                  <span>{project.category}</span>
                  <span>{project.status}</span>
                </div>

                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-carousel-tags">
                  {project.technologies.slice(0, 5).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="project-carousel-controls">
        <button
          type="button"
          onClick={showPrevious}
          aria-label="Show previous project"
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </button>

        <div className="project-carousel-pagination">
          {projects.map((project, index) => (
            <button
              type="button"
              key={project.title}
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${project.title}`}
            />
          ))}
        </div>

        <span className="project-carousel-counter" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")}
          <span>/</span>
          {String(projects.length).padStart(2, "0")}
        </span>

        <button
          type="button"
          onClick={showNext}
          aria-label="Show next project"
        >
          <ArrowRight size={19} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
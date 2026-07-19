"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { ProjectModal } from "@/components/ProjectModal";
import { PromotionalFullscreenModal } from "@/components/PromotionalFullscreenModal";
import { SheetsFullscreenModal } from "@/components/SheetsFullscreenModal";
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
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const [
    erpPreviewFrame,
    setErpPreviewFrame,
  ] =
    useState(0);

  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    const handleJourneyProjectOpen = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<{
          slug?: string;
        }>;

      const slug =
        customEvent.detail?.slug;

      if (!slug) {
        return;
      }

      const projectIndex =
        projects.findIndex(
          (project) =>
            project.slug === slug,
        );

      if (projectIndex < 0) {
        return;
      }

      const project =
        projects[projectIndex];

      setActiveIndex(
        projectIndex,
      );

      setSelectedProject(
        project,
      );

      setPaused(true);
    };

    window.addEventListener(
      "portfolio:open-project",
      handleJourneyProjectOpen,
    );

    return () => {
      window.removeEventListener(
        "portfolio:open-project",
        handleJourneyProjectOpen,
      );
    };
  }, [projects]);
  const suppressClick = useRef(false);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? projects.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
  };

  /*
    ERP_PREVIEW_AUTOPLAY

    The main ERP card automatically rotates through
    the real interface screenshots while the ERP
    project is active.

    This is independent from the outer project carousel.
  */

  useEffect(() => {

    const activeProject =
      projects[activeIndex];

    if (
      !activeProject ||
      activeProject.slug !==
        "internal-erp-platform" ||
      selectedProject !== null
    ) {

      return;
    }


    const previewImages =
      activeProject.media.filter(
        (media) =>
          media.kind === "image" &&
          media.src.startsWith(
            "/project-erp/erp-interface-",
          ),
      );


    if (
      previewImages.length < 2
    ) {

      return;
    }


    const timer =
      window.setInterval(
        () => {

          setErpPreviewFrame(
            (current) =>
              (
                current +
                1
              ) %
              previewImages.length,
          );

        },
        2600,
      );


    return () => {

      window.clearInterval(
        timer,
      );

    };

  }, [
    activeIndex,
    projects,
    selectedProject,
  ]);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useEffect(() => {
    if (
      paused ||
      selectedProject !== null ||
      projects.length < 2
    ) {
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
  }, [paused, projects.length, selectedProject]);

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
    suppressClick.current = false;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) {
      return;
    }

    const distance = event.clientX - dragStart.current;

    dragStart.current = null;
    suppressClick.current = Math.abs(distance) > 12;

    if (distance > 55) {
      showPrevious();
    }

    if (distance < -55) {
      showNext();
    }
  };

  const handleProjectClick = (
    project: PortfolioProject,
    index: number,
    isActive: boolean,
  ) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }

    if (!isActive) {
      setActiveIndex(index);
      return;
    }

    setSelectedProject(project);
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
          suppressClick.current = false;
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

          const erpPreviewImages =
            project.slug ===
            "internal-erp-platform"
              ? project.media.filter(
                  (media) =>
                    media.kind ===
                      "image" &&
                    media.src.startsWith(
                      "/project-erp/erp-interface-",
                    ),
                )
              : [];


          const carouselPreviewImage =
            project.slug ===
              "internal-erp-platform" &&
            erpPreviewImages.length > 0

              ? (
                  isActive

                    ? erpPreviewImages[
                        erpPreviewFrame %
                          erpPreviewImages.length
                      ]?.src

                    : erpPreviewImages[0]?.src
                ) ||
                project.image

              : project.image;

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

          const actionLabel = isActive
            ? `Open full case study for ${project.title}`
            : `Bring ${project.title} into focus`;

          return (
            <button
              type="button"
              className={`project-carousel-card ${
                isActive ? "is-active" : ""
              }`}
              style={style}
              key={project.slug}
              onClick={() =>
                handleProjectClick(project, index, isActive)
              }
              aria-label={actionLabel}
              aria-current={isActive ? "true" : undefined}
              data-project-slug={project.slug}
              data-project-active={isActive ? "true" : "false"}
            >
              <div className="project-carousel-visual">
                <Image
                  key={carouselPreviewImage}
                  className="project-carousel-preview-image"
                  src={carouselPreviewImage}
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

                <span className="project-carousel-open">
                  View full case study
                  <Maximize2 size={15} aria-hidden="true" />
                </span>
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
              key={project.slug}
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

      {selectedProject ? (

        selectedProject.slug ===
        "operational-automation-system" ? (

          <SheetsFullscreenModal
            project={selectedProject}
            onClose={closeProject}
          />

        ) : (

          selectedProject.slug ===
          "promotional-web-platforms" ? (

            <PromotionalFullscreenModal
              project={selectedProject}
              onClose={closeProject}
            />

          ) : (

            <ProjectModal
              project={selectedProject}
              onClose={closeProject}
            />

          )

        )

      ) : null}
    </div>
  );
}
import type { CSSProperties } from "react";

import type { TimelineItem } from "@/data/portfolio";

type JourneyChartProps = {
  associativeItems: TimelineItem[];
  academicItems: TimelineItem[];
};

type JourneyTrackProps = {
  label: string;
  items: TimelineItem[];
  tone: "associative" | "academic";
};

const milestoneLevels = [0, 1, 0, 1, 0, 1];

function calculatePosition(index: number, total: number) {
  if (total <= 1) {
    return 50;
  }

  const start = 6;
  const end = 94;

  return start + (index / (total - 1)) * (end - start);
}

function JourneyTrack({
  label,
  items,
  tone,
}: JourneyTrackProps) {
  return (
    <div
      className={`dual-journey-track dual-journey-track--${tone}`}
      aria-label={`${label} timeline`}
    >
      <div className="dual-journey-line" aria-hidden="true" />

      {items.map((item, index) => {
        const position = calculatePosition(index, items.length);
        const level = milestoneLevels[index % milestoneLevels.length];

        const edgeClass =
          index === 0
            ? "is-first"
            : index === items.length - 1
              ? "is-last"
              : "";

        return (
          <article
            className={`dual-journey-milestone ${edgeClass}`}
            key={`${tone}-${item.period}-${item.title}`}
            style={
              {
                "--milestone-position": `${position}%`,
                "--milestone-level": level,
              } as CSSProperties
            }
            aria-label={`${item.period}: ${item.title}. ${item.description}`}
            title={item.description}
          >
            <div className="dual-journey-copy">
              <span>{item.period}</span>
              <h3>{item.title}</h3>
            </div>

            <span
              className="dual-journey-stem"
              aria-hidden="true"
            />

            <span
              className="dual-journey-node"
              aria-hidden="true"
            />
          </article>
        );
      })}

      <span className="dual-journey-track-name">
        {label}
      </span>
    </div>
  );
}

export function JourneyChart({
  associativeItems,
  academicItems,
}: JourneyChartProps) {
  return (
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
              <strong>Associative journey</strong>
              <span>Leadership, automation and digital systems</span>
            </div>
          </div>

          <div className="dual-journey-legend-item">
            <span
              className="dual-journey-legend-line dual-journey-legend-line--academic"
              aria-hidden="true"
            />

            <div>
              <strong>Academic journey</strong>
              <span>Biomedical, embedded and robotic systems</span>
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
            items={associativeItems}
            tone="associative"
          />

          <JourneyTrack
            label="Academic"
            items={academicItems}
            tone="academic"
          />
        </div>
      </div>
    </div>
  );
}
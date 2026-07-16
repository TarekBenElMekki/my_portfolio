import type { CSSProperties } from "react";
import type { TimelineItem } from "@/data/portfolio";

type TimelineProps = {
  title: string;
  description: string;
  items: TimelineItem[];
};

export function Timeline({ title, description, items }: TimelineProps) {
  return (
    <div className="timeline-block">
      <div className="timeline-heading">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div
        className="timeline-track"
        style={
          {
            "--timeline-columns": items.length,
          } as CSSProperties
        }
      >
        {items.map((item, index) => (
          <article className="timeline-item" key={`${item.title}-${index}`}>
            <div className="timeline-marker" aria-hidden="true" />

            <div className="timeline-content">
              <span className="timeline-label">{item.label}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>

              {item.technologies ? (
                <div className="tag-list compact">
                  {item.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
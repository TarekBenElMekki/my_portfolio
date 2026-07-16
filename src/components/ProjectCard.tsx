import Image from "next/image";
import type { PortfolioProject } from "@/data/portfolio";

type ProjectCardProps = {
  project: PortfolioProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={`project-card ${project.featured ? "featured" : ""}`}>
      <div className="project-visual">
        <Image
          src={project.image}
          alt={`${project.title} project illustration`}
          fill
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>

      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.status}</span>
        </div>

        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="tag-list">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
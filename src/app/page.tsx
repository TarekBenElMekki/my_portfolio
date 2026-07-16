import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  GitBranch,
  Mail,
} from "lucide-react";

import { ProjectCard } from "@/components/ProjectCard";
import { Timeline } from "@/components/Timeline";
import {
  academicTimeline,
  associativeTimeline,
  projects,
  skillGroups,
  supportingExperience,
} from "@/data/portfolio";

const profileAsset = "/profile.png";
const cvHref = "mailto:benmekkitarek@gmail.com?subject=CV%20request";
const cvLabel = "Request CV";

export default function Home() {
  const cvIsPdf = cvHref.endsWith(".pdf");

  return (
    <main id="top">
      <header className="site-header">
        <div className="container navigation">
          <a className="brand" href="#top" aria-label="Go to the top">
            TB<span>.</span>
          </a>

          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            className="nav-cv"
            href={cvHref}
            download={cvIsPdf}
            target={cvIsPdf ? "_blank" : undefined}
            rel={cvIsPdf ? "noreferrer" : undefined}
          >
            {cvLabel}
            <Download size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="container site-content">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Tarek Ben El Mekki</span>

            <h1>
              Building robotic, embedded and software systems
              <span>.</span>
            </h1>

            <p className="hero-role">
              Biomedical &amp; Embedded Systems Engineer
            </p>

            <p className="hero-description">
              I connect robotics, medical technology, embedded control,
              automation and software to turn multidisciplinary engineering
              challenges into practical working systems.
            </p>

            <div className="hero-actions">
              <a className="primary-action" href="#projects">
                View selected work
                <ArrowDown size={18} aria-hidden="true" />
              </a>

              <a
                className="secondary-action"
                href={cvHref}
                download={cvIsPdf}
                target={cvIsPdf ? "_blank" : undefined}
                rel={cvIsPdf ? "noreferrer" : undefined}
              >
                {cvLabel}
                <Download size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="portrait-frame">
            <Image
              src={profileAsset}
              alt="Portrait of Tarek Ben El Mekki"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 42vw"
            />
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="section-index">
            <span>01</span>
            <h2>About me</h2>
          </div>

          <div className="about-copy">
            <p className="large-copy">
              I am a biomedical and embedded systems engineer with a foundation
              in medical informatics and medical information processing.
            </p>

            <p>
              My work spans autonomous navigation with ROS1, surgical robotics
              with ROS2, embedded actuator control, force sensing, automation,
              internal tools and software systems. I enjoy understanding the
              complete system, from the physical mechanism and electronics to
              the control architecture and user-facing software.
            </p>
          </div>
        </section>

        <section className="section" id="journey">
          <div className="section-header">
            <div>
              <span className="section-number">02</span>
              <h2>Journey</h2>
            </div>

            <p>
              Two connected lines: associative leadership and its technical
              projects, followed by academic specialization and engineering
              projects.
            </p>
          </div>

          <Timeline
            title="Associative journey"
            description="From team contribution to Information Management leadership, supported by increasingly structured digital systems."
            items={associativeTimeline}
          />

          <Timeline
            title="Academic journey"
            description="From biomedical engineering and autonomous robotics to embedded medical systems and surgical robotics."
            items={academicTimeline}
          />
        </section>

        <section className="section" id="projects">
          <div className="section-header">
            <div>
              <span className="section-number">03</span>
              <h2>Selected projects</h2>
            </div>

            <p>
              Systems demonstrating robotics, embedded engineering, automation
              and software development.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-header">
            <div>
              <span className="section-number">04</span>
              <h2>Skills</h2>
            </div>

            <p>
              A multidisciplinary toolkit developed through academic,
              associative and personal engineering projects.
            </p>
          </div>

          <div className="skills-grid">
            {skillGroups.map((group) => (
              <article className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section supporting-section">
          <div className="section-header compact-header">
            <div>
              <span className="section-number">05</span>
              <h2>Additional experience</h2>
            </div>
          </div>

          <div className="supporting-grid">
            {supportingExperience.map((experience) => (
              <article key={experience.organization}>
                <span>{experience.organization}</span>
                <h3>{experience.title}</h3>
                <p>{experience.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div>
            <span className="section-number">06</span>
            <h2>Let&apos;s build something meaningful.</h2>
            <p>
              I am open to opportunities at the intersection of robotics,
              embedded systems, medical technology, automation and software.
            </p>
          </div>

          <div className="contact-links">
            <a href="mailto:benmekkitarek@gmail.com">
              <Mail size={18} aria-hidden="true" />
              <span>benmekkitarek@gmail.com</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>

            <a
              href="https://github.com/TarekBenElMekki"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={18} aria-hidden="true" />
              <span>github.com/TarekBenElMekki</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>

            <a
              href={cvHref}
              download={cvIsPdf}
              target={cvIsPdf ? "_blank" : undefined}
              rel={cvIsPdf ? "noreferrer" : undefined}
            >
              <Download size={18} aria-hidden="true" />
              <span>{cvLabel}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </section>

        <footer>
          <span>Ã‚Â© 2026 Tarek Ben El Mekki</span>
          <span>Designed and developed with Next.js</span>
        </footer>
      </div>
    </main>
  );
}


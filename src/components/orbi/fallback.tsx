import { ProjectScreen } from "@/components/project-screen";
import { site, works } from "@/data/site.config";
import { featured, type Featured } from "@/lib/orbi";
import { languages, profile, repoCount, totalBytes, yearsOnGitHub } from "@/lib/github";
import { formatBytes } from "@/lib/utils";

/**
 * The system, read without the script.
 *
 * The desktop is a client application: without JavaScript the windows never
 * open. This is the same portfolio as a plain document — one column, the real
 * numbers, every project and its stack — so a visitor with scripting off, a
 * crawler that never runs the shell and a reader that cannot follow a drag all
 * get the work. It is rendered by the server and shown only inside <noscript>.
 */
export function Fallback() {
  const projects = featured as Featured[];

  return (
    <div className="fallback">
      <header className="fallback__head">
        <p className="os-label">orbi · personal digital environment</p>
        <h1 className="fallback__title">{site.displayName}.</h1>
        <p className="fallback__roles">{site.roles.join(" · ")}</p>
        <p className="fallback__line">
          {yearsOnGitHub} years on GitHub · {repoCount} public repositories ·{" "}
          {languages.length} languages · {formatBytes(totalBytes)} committed
        </p>
        <p className="fallback__note">
          The interactive desktop needs JavaScript. This is the same work as a
          document.
        </p>
      </header>

      <section aria-labelledby="fallback-projects">
        <h2 id="fallback-projects" className="fallback__h2">
          Selected work
        </h2>
        <ul className="fallback__list">
          {projects.map((project) => (
            <li key={project.name} className="fallback__project">
              <h3 className="fallback__h3">{project.name}</h3>
              <p>{project.summary}</p>
              <p className="fallback__meta">
                {project.language || "mixed"} · {formatBytes(project.bytes)} ·{" "}
                {project.stars} stars
              </p>
              <ul className="fallback__stack">
                {(works[project.name]?.stack ?? project.stack).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {project.screen ? (
                <ProjectScreen
                  accent={project.accent}
                  screen={project.screen}
                  name={project.name}
                />
              ) : null}
              <a className="os-link" href={project.url}>
                {project.url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fallback-stack">
        <h2 id="fallback-stack" className="fallback__h2">
          Stack
        </h2>
        <ul className="fallback__list fallback__stack-list">
          {languages.map((language) => (
            <li key={language.name}>
              {language.name} — {formatBytes(language.bytes)}, {language.repos}{" "}
              {language.repos === 1 ? "repository" : "repositories"}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fallback-services">
        <h2 id="fallback-services" className="fallback__h2">
          Services
        </h2>
        <ul className="fallback__list">
          {site.services.map((service) => (
            <li key={service.index}>
              <strong>{service.title}</strong> — {service.note}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fallback-contact">
        <h2 id="fallback-contact" className="fallback__h2">
          Contact
        </h2>
        <ul className="fallback__list">
          <li>
            <a className="os-link" href={site.contact.github}>
              github.com/{site.owner}
            </a>
          </li>
          {site.contact.email ? (
            <li>
              <a className="os-link" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </li>
          ) : null}
          {site.contact.discord ? <li>discord: {site.contact.discord}</li> : null}
          <li>{profile.location || "remote · worldwide"}</li>
          <li>available for contracts and full-time work</li>
        </ul>
      </section>
    </div>
  );
}

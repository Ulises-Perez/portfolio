import { Contact } from "@/components/contact";
import { Developer } from "@/components/developer";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { Services } from "@/components/services";
import { Works } from "@/components/works";
import { featuredRepos } from "@/lib/github";
import { defaultWork, works } from "@/data/site.config";

// The featured projects carry the line written for this site when there is
// one, and the readme only fills the gap. Only the fields a card shows are
// handed to the browser.
const projects = featuredRepos.map((repo) => {
  const work =
    works[repo.name] ??
    defaultWork(
      repo.name,
      repo.summary,
      repo.language ? [repo.language] : [],
    );

  return {
    name: repo.name,
    url: repo.url,
    blurb: work.blurb,
    stack: work.stack,
    accent: work.accent,
    screen: work.screen,
    language: repo.language,
    bytes: repo.bytes,
    stars: repo.stars,
    pushedAt: repo.pushedAt,
  };
});

export default function Home() {
  return (
    <>
      <Hero />
      <Developer />
      <Works names={projects.map((project) => project.name)}>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.name}
            {...project}
            index={index}
            total={projects.length}
          />
        ))}
      </Works>
      <Services />
      <Contact />
      <Footer />
    </>
  );
}

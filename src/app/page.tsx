import { Archive } from "@/components/archive";
import { Contact } from "@/components/contact";
import { Developer } from "@/components/developer";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ProjectPanel } from "@/components/project-panel";
import { Services } from "@/components/services";
import { Stack } from "@/components/stack";
import { Works } from "@/components/works";
import { featuredRepos } from "@/lib/github";
import { summaries } from "@/data/site.config";

// The featured projects carry the line written for this site when there is
// one, and the readme only fills the gap. Only the fields a panel shows are
// handed to the browser.
const projects = featuredRepos.map((repo) => ({
  name: repo.name,
  url: repo.url,
  language: repo.language,
  languages: repo.languages,
  bytes: repo.bytes,
  stars: repo.stars,
  pushedAt: repo.pushedAt,
  summary: summaries[repo.name] ?? repo.summary,
}));

export default function Home() {
  return (
    <>
      <Hero />
      <Developer />
      <Works names={projects.map((project) => project.name)}>
        {projects.map((project, index) => (
          <ProjectPanel key={project.name} project={project} index={index} />
        ))}
        <Archive />
      </Works>
      <Services />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}

import { Contact } from "@/components/contact";
import { Developer } from "@/components/developer";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Repositories } from "@/components/repositories";
import { Stack } from "@/components/stack";
import { Works } from "@/components/works";

export default function Home() {
  return (
    <>
      <Hero />
      <Developer />
      <Works />
      <Repositories />
      <Stack />
      <Contact />
      <Footer />
    </>
  );
}

import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Offer } from "@/components/Offer";
import { About } from "@/components/About";
import { Toolkit } from "@/components/Toolkit";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Offer />
      <Process />
      <Work />
      <About />
      <Toolkit />
      <Contact />
    </main>
  );
}

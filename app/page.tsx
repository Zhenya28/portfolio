import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Toolkit } from "@/components/Toolkit";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Work />
        <About />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

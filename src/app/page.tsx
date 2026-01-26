import Background from "@/components/Background";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import Timeline from "@/components/Timeline";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="relative min-h-screen text-zinc-900 dark:text-zinc-100">
      <Background />

      <Header />

      <Hero />

      <ProjectsGrid />

      <Timeline />

      <About />

      <Contact />

      <Footer />
    </main>
  );
}

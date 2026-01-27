import Background from "@/components/Background";
import Header from "@/components/Header";
import LoaderSignalCanvas from "@/components/LoaderSignalCanvas";
import { resume } from "@/data/resume";
import FeaturedProjects from "@/components/FeaturedProjects";
import Timeline from "@/components/Timeline";
import About from "@/components/About";
import ContactSignal from "@/components/ContactSignal";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function Page() {
  return (
    <main className="relative min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* One-time loader animation */}
      <LoaderSignalCanvas />

      <Background />

      <Header />

      {/* Hero Section */}
      <section id="top" className="scroll-mt-24 py-20 px-6 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="space-y-6">
              {/* Domains */}
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                {resume.domains.join(" • ")}
              </p>

              {/* Name */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {resume.name}
              </h1>

              {/* Hero Statement */}
              <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                {resume.heroStatement}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                >
                  View Projects
                </a>
                <a
                  href="/ResumeW26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Resume PDF
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Featured Projects with Domain Filtering */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <FeaturedProjects projects={resume.featuredProjects} />
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div id="experience" className="py-20 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  Experience & Competition
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Constraints, outcomes, and technical depth
                </p>
              </div>

              {/* Professional Experience */}
              <div className="space-y-6">
                {resume.experience.map((exp, idx) => (
                  <Reveal key={idx}>
                    <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-6">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {exp.org} • {exp.dateRange}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {exp.bullets.map((bullet, bidx) => (
                          <li
                            key={bidx}
                            className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2"
                          >
                            <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                              •
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Competitions */}
              {resume.competitions.length > 0 && (
                <div className="space-y-6 pt-6">
                  {resume.competitions.map((comp, idx) => (
                    <Reveal key={idx}>
                      <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-6">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {comp.event}
                        </h3>
                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          {comp.name} • {comp.dateRange}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {comp.bullets.map((bullet, bidx) => (
                            <li
                              key={bidx}
                              className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2"
                            >
                              <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                                •
                              </span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Education */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div id="education" className="py-20">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                Education
              </h2>

              <div className="space-y-6">
                {resume.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-6"
                  >
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                      {edu.institution} • {edu.dateRange}
                    </p>
                    <ul className="mt-4 space-y-1">
                      {edu.details.map((detail, didx) => (
                        <li
                          key={didx}
                          className="text-sm text-zinc-700 dark:text-zinc-300 flex gap-2"
                        >
                          <span className="text-zinc-400 dark:text-zinc-600 flex-shrink-0">
                            ✓
                          </span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div id="skills" className="py-20">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
                Technical Skills
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resume.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-6"
                  >
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-4">
                      {skill.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, sidx) => (
                        <span
                          key={sidx}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact Signal */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <ContactSignal />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

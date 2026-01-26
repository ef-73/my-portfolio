import { SITE } from "@/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur">
      <div className="mx-auto max-w-5xl text-center text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          © {year} {SITE.name}. Built with{" "}
          <span className="text-zinc-400 dark:text-zinc-600">Next.js</span> +{" "}
          <span className="text-zinc-400 dark:text-zinc-600">Tailwind</span>.
        </p>
      </div>
    </footer>
  );
}

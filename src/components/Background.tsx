export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-950" />

      {/* floating blobs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-zinc-200/70 blur-3xl dark:bg-zinc-800/60"
           style={{ animation: "floaty 10s ease-in-out infinite" }} />
      <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-zinc-200/70 blur-3xl dark:bg-zinc-800/60"
           style={{ animation: "floaty 12s ease-in-out infinite" }} />
      <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/50"
           style={{ animation: "drift 14s ease-in-out infinite" }} />

      {/* subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06] text-zinc-900 dark:opacity-[0.08] dark:text-zinc-100"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

    </div>
  );
}

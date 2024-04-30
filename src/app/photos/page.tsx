export default function Photos() {
  return (
    <main className="flex flex-col gap-4">
      <h1
        className="animate-in font-system text-3xl font-bold"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        Photos
      </h1>
      <p className="animate-in" style={{ "--index": 2 } as React.CSSProperties}>
        A glimpse into my life through the lens.
      </p>
    </main>
  );
}

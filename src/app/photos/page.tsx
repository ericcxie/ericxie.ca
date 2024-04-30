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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.  Sit amet luctus
        venenatis lectus magna fringilla. Iaculis at erat pellentesque
        adipiscing commodo elit at imperdiet dui.
      </p>
    </main>
  );
}

import Projects from "@/components/Sections/Projects";
import Experiences from "@/components/Sections/Experiences";

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      <div>
        <h1
          className="animate-in font-system text-3xl font-bold"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Eric Xie
        </h1>
        <p
          className="animate-in text-sm md:text-base"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.  Sit amet
          luctus venenatis lectus magna fringilla. Iaculis at erat pellentesque
          adipiscing commodo elit at imperdiet dui.
        </p>
      </div>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <Projects />
      </div>
      <div
        className="animate-in"
        style={{ "--index": 4 } as React.CSSProperties}
      >
        <Experiences />
      </div>
    </main>
  );
}

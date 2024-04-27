import Projects from "@/components/Sections/Projects";
import Experiences from "@/components/Sections/Experiences";

export default function Home() {
  return (
    <main className="flex flex-col gap-10">
      <div>
        <h1 className="font-system text-3xl font-bold">Eric Xie</h1>
        <p className="text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.  Sit amet
          luctus venenatis lectus magna fringilla. Iaculis at erat pellentesque
          adipiscing commodo elit at imperdiet dui.
        </p>
      </div>
      <div>
        <Projects />
      </div>
      <div>
        <Experiences />
      </div>
    </main>
  );
}

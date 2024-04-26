import Projects from "@/components/Sections/Projects";

export default function Home() {
  return (
    <main className="flex flex-col gap-14">
      <div>
        <h1 className="font-system text-3xl font-bold">Eric Xie</h1>
        <p className="">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.  Sit amet
          luctus venenatis lectus magna fringilla. Iaculis at erat pellentesque
          adipiscing commodo elit at imperdiet dui.
        </p>
      </div>
      <div>
        <Projects />
      </div>
    </main>
  );
}

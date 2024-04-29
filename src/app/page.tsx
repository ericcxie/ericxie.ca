import Projects from "@/components/Sections/Projects";
import Experiences from "@/components/Sections/Experiences";
import LatestPosts from "@/components/Sections/LatestPosts";

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
        <div className="mt-4 space-y-1">
          <p
            className="max-w-2xl animate-in text-sm text-text-light-body dark:text-text-dark-body md:text-base"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            Currently, I’m a Computer Engineering student at the{" "}
            <span className="border-b-[2px] border-neutral-600">
              <a
                href="https://uwaterloo.ca/engineering/"
                target="_blank"
                rel="noopener noreferrer"
              >
                University of Waterloo
              </a>
            </span>{" "}
            and a Software Developer Intern at{" "}
            <span className="border-b-[2px] border-neutral-600">
              <a
                href="https://lawbrokr.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lawbrokr
              </a>
            </span>
            .
          </p>
        </div>
        <div className="mt-4 space-y-1">
          <p
            className="max-w-xl animate-in text-sm text-text-light-body dark:text-text-dark-body md:text-base"
            style={{ "--index": 3 } as React.CSSProperties}
          >
            I believe in creating software that is not only functional but also
            clean, beautiful, and enjoyable to use. Let’s build something
            together that inspires.
          </p>
        </div>
        <div className="mt-4 space-y-1">
          <p
            className="max-w-lg animate-in text-sm text-text-light-body dark:text-text-dark-body md:text-base"
            style={{ "--index": 4 } as React.CSSProperties}
          >
            You can reach me on{" "}
            <span className="border-b-[2px] border-neutral-600">
              <a
                href="https://www.linkedin.com/in/ericcxie/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </span>{" "}
            or at{" "}
            <span className="border-b-[2px] border-neutral-600">
              <a
                href="mailto:pexie@uwaterloo.ca"
                className="border-b-[2px] border-neutral-600"
              >
                pexie@uwaterloo.ca
              </a>
            </span>
            .
          </p>
        </div>
      </div>
      <div
        className="animate-in"
        style={{ "--index": 5 } as React.CSSProperties}
      >
        <Projects />
      </div>
      <div
        className="animate-in"
        style={{ "--index": 6 } as React.CSSProperties}
      >
        <Experiences />
      </div>
      <div
        className="animate-in"
        style={{ "--index": 7 } as React.CSSProperties}
      >
        <LatestPosts />
      </div>
    </main>
  );
}

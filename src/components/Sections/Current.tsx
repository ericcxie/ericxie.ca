import Map from "@/components/ui/Map";
import { readFile } from "fs/promises";
import path from "path";

interface AboutData {
  current: {
    description: string;
    location: { name: string; lng: number; lat: number };
    interests: { title: string; content: string }[];
  };
}

async function getAboutData(): Promise<AboutData> {
  const filePath = path.join(process.cwd(), "src/content/about.json");
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export default async function Current() {
  const { current } = await getAboutData();

  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Current</h1>
      <p className="mb-3 text-sm text-text-light-body dark:text-text-dark-body md:text-base">
        {current.description}
      </p>
      <div className="relative">
        <Map lng={current.location.lng} lat={current.location.lat} />
        <div className="absolute bottom-4 left-4 flex items-center rounded-lg bg-neutral-100/75 px-4 py-1.5 backdrop-blur dark:bg-neutral-900/75 md:bottom-6 md:left-6">
          <p className="text-primary text-sm font-medium">
            {current.location.name}
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg py-4">
        {current.interests.map((interest) => (
          <div
            className="flex items-start sm:items-center"
            key={interest.title}
          >
            <span className="mr-2 min-w-[80px] md:min-w-fit">
              {interest.title}
            </span>
            <div className="hidden flex-grow border-t border-dashed border-text-light-body dark:border-text-dark-body sm:inline"></div>
            <span className="ml-2 block text-left text-base text-text-light-body dark:text-text-dark-body sm:text-center">
              {interest.content}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

import Map from "@/components/ui/Map";

export default function Current() {
  return (
    <>
      <h1 className="mb-1 text-xl font-bold">Current</h1>
      <p className="mb-3 text-sm text-text-light-body dark:text-text-dark-body md:text-base">
        I'm currently on a co-op term in Toronto and eager to explore the city's
        cafe and food scene this summer. If you're around, let's connect!
      </p>
      <div className="relative">
        <Map lng={-79.347015} lat={43.65107} />
        <div className="absolute bottom-4 left-4 flex items-center rounded-lg bg-neutral-100/75 px-4 py-1.5 backdrop-blur dark:bg-neutral-900/75 md:bottom-6 md:left-6">
          <p className="text-primary text-sm font-medium">Toronto, ON</p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg py-4">
        {interestsData.map((interest) => (
          <div
            className="flex items-start md:items-center"
            key={interest.title}
          >
            <span className="mr-2 min-w-[80px] md:min-w-fit">
              {interest.title}
            </span>
            <div className="flex-grow border-t border-dashed border-text-light-body dark:border-text-dark-body"></div>
            <span className="ml-2 block text-base text-text-light-body dark:text-text-dark-body">
              {interest.content}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

const interestsData = [
  {
    title: "Interests",
    content: "Design, investing, personal finance",
  },
  {
    title: "Learning",
    content: "Open banking, photography, storytelling",
  },
  {
    title: "Listening",
    content: "Motley Fool Money, Acquired, Planet Money",
  },
];

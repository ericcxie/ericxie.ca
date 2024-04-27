import { ExperienceCard } from "../ui/ExperienceCard";
import { experienceItems } from "@/content/experience/experiences";

export default function Experiences() {
  return (
    <>
      <h1 className="mb-2 text-xl font-bold">Experiences</h1>
      <div className="space-y-7">
        {experienceItems.map((item, index) => (
          <ExperienceCard key={index} item={item} />
        ))}
      </div>
    </>
  );
}

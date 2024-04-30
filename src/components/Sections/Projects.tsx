import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";
import { cardItems } from "@/content/project/projects";

export default function Projects() {
  return (
    <>
      <h1 className="text-xl font-bold">Projects</h1>
      <InfiniteMovingCards
        items={cardItems}
        direction="right"
        speed="slow"
        pauseOnHover={true}
        className="additional-class"
      />
    </>
  );
}

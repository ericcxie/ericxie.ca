import InfiniteMovingCards from "@/components/ui/InfiniteMovingCards";
import { cardItems } from "@/content/project/projects";
import type { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { loop: true }

export default function Projects() {
  return (
    <>
      <h1 className="text-xl font-bold">Projects</h1>
      <InfiniteMovingCards slides={cardItems} options={OPTIONS} />
    </>
  );
}

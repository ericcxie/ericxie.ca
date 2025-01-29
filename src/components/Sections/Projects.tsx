import { cardItems } from "@/content/project/projects";
import EmblaCarousel from "@/components/ui/InfiniteMovingCards";
import type { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 8
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

export default function Projects() {
  return (
    <>
      <h1 className="text-xl font-bold">Projects</h1>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </>
  );
}

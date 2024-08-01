import { ParallaxScroll } from "@/components/ui/ParallaxScroll";
import {
  Balcony,
  Building,
  Condo,
  DogWaterfront,
  FoodTruck,
  LibraryStairs,
  LibraryStudy,
  MallWalk,
  ManInSuit,
  RBC,
  Romance,
  Serenity,
  ShipAirplane,
  TakeoutSign,
  WellCafe,
} from "../../../public/img";

export default function Photos() {
  return (
    <main className="flex flex-col gap-4">
      <h1
        className="animate-in font-system text-3xl font-bold"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        Photos
      </h1>
      <p
        className="animate-in text-text-light-body dark:text-text-dark-body"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <a
          href="https://www.instagram.com/ericxphoto/"
          target="_blank"
          rel="noopener noreferrer"
        >
          📸 Fujifilm XT-30 ii
        </a>
      </p>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {images.length > 0 ? (
          <ParallaxScroll images={images} />
        ) : (
          <p className="italic text-text-light-body dark:text-text-dark-body">
            Stay tuned!
          </p>
        )}
      </div>
    </main>
  );
}

const images = [
  TakeoutSign,
  LibraryStudy,
  Condo,
  ManInSuit,
  Romance,
  DogWaterfront,
  MallWalk,
  Balcony,
  RBC,
  Serenity,
  LibraryStairs,
  FoodTruck,
  WellCafe,
  ShipAirplane,
  Building,
];

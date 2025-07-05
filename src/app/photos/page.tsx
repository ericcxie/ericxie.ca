import { PhotoGallery } from "@/components/ui/PhotoGallery";
import {
  Balcony,
  ChairArtGallery,
  Corridor,
  DogWaterfront,
  FoodTruck,
  GalleryWall,
  Kamakura,
  LibraryStairs,
  LibraryStudy,
  MallWalk,
  ManInSuit,
  NYCStarbucks,
  OldCar,
  SevenEleven,
  ShipAirplane,
  Soho,
  SouthBeach,
  Stairs,
  Stairs2,
  Store,
  StreetArt,
  TakeoutSign,
  Temple,
  Umbrellas,
  VendingMachine,
  VintageTV,
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
        📸 Fujifilm XT-30 ii
      </p>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {images.length > 0 ? (
          <PhotoGallery images={images} />
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
  Kamakura,
  Store,
  VendingMachine,
  Temple,
  SevenEleven,
  NYCStarbucks,
  Soho,
  StreetArt,
  SouthBeach,
  OldCar,
  Umbrellas,
  Stairs,
  Corridor,
  Stairs2,
  LibraryStairs,
  LibraryStudy,
  ChairArtGallery,
  VintageTV,
  GalleryWall,
  DogWaterfront,
  ShipAirplane,
  ManInSuit,
  TakeoutSign,
  Balcony,
  FoodTruck,
  MallWalk,
  WellCafe,
];

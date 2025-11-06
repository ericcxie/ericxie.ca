import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { photosData } from "@/content/photos/photos";
import * as PhotoImports from "../../../public/img";

export default function Photos() {
  // Get photos with locations in chronological order (newest first)
  const photosWithLocations = photosData
    .map((photo) => ({
      image: (PhotoImports as any)[photo.exportName],
      location: photo.location,
    }))
    .filter((photo) => photo.image); // Filter out any missing imports

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
        📸 I like to capture the little moments in my life
      </p>
      <div
        className="animate-in"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {photosWithLocations.length > 0 ? (
          <PhotoGallery photosWithLocations={photosWithLocations} />
        ) : (
          <p className="italic text-text-light-body dark:text-text-dark-body">
            Stay tuned!
          </p>
        )}
      </div>
    </main>
  );
}

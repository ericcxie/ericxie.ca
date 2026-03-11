import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { photosData } from "@/content/photos/photos";
import { PhotoMetadata } from "@/app/api/photos/route";
import { list } from "@vercel/blob";
import * as PhotoImports from "../../../public/img";

const METADATA_KEY = "photos-metadata.json";

async function getBlobPhotos(): Promise<PhotoMetadata[]> {
  try {
    const { blobs } = await list({ prefix: METADATA_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Photos() {
  const blobPhotos = await getBlobPhotos();

  // Blob photos (from Vercel Blob) - newest first
  const blobPhotosWithLocations = blobPhotos.map((photo) => ({
    image: photo.url,
    location: photo.location,
    date: photo.date,
  }));

  // Local photos (from repo) - already sorted newest first
  const localPhotosWithLocations = photosData
    .map((photo) => ({
      image: (PhotoImports as any)[photo.exportName],
      location: photo.location,
      date: photo.date,
    }))
    .filter((photo) => photo.image);

  // Combine and sort all photos by date (newest first)
  const allPhotos = [...blobPhotosWithLocations, ...localPhotosWithLocations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(({ image, location }) => ({ image, location }));

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
        {allPhotos.length > 0 ? (
          <PhotoGallery photosWithLocations={allPhotos} />
        ) : (
          <p className="italic text-text-light-body dark:text-text-dark-body">
            Stay tuned!
          </p>
        )}
      </div>
    </main>
  );
}

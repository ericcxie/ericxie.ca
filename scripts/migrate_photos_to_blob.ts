/**
 * Migration script: uploads existing local photos to Vercel Blob
 * and creates the metadata JSON.
 *
 * Usage:
 *   1. Set BLOB_READ_WRITE_TOKEN in .env.local
 *   2. Run: npx tsx scripts/migrate_photos_to_blob.ts
 *
 * This is a one-time migration. After running, your existing photos
 * will be available from Vercel Blob. You can then optionally remove
 * them from the repo.
 */

import { put, list, del } from "@vercel/blob";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load .env.local
config({ path: join(process.cwd(), ".env.local") });

interface PhotoMetadata {
  url: string;
  filename: string;
  location: string;
  date: string;
}

// Import from the existing photos data
const photosData = [
  { filename: "DSCF4288.webp", date: "2025-11-06T20:44:32.169724", location: "Walensee, Switzerland" },
  { filename: "DSCF4292.webp", date: "2025-11-06T20:43:32.812229", location: "Walensee, Switzerland" },
  { filename: "DSCF4269.webp", date: "2025-11-06T20:43:11.137666", location: "Walensee, Switzerland" },
  { filename: "DSCF4105.webp", date: "2025-11-03T20:44:55.061424", location: "Venice, Italy" },
  { filename: "DSCF3953.webp", date: "2025-11-03T20:43:37.842229", location: "Venice, Italy" },
  { filename: "temple.webp", date: "2025-07-06T00:16:47.466115", location: "Kyoto, Japan" },
  { filename: "kamakura.webp", date: "2025-07-06T00:16:39.057017", location: "Kamakura, Japan" },
  { filename: "seven_eleven.webp", date: "2025-07-06T00:16:52.179718", location: "Tokyo, Japan" },
  { filename: "store.webp", date: "2025-07-06T00:16:50.043696", location: "Tokyo, Japan" },
  { filename: "vending_machine.webp", date: "2025-07-06T00:16:45.282754", location: "Tokyo, Japan" },
  { filename: "well_cafe.webp", date: "2025-05-16T18:29:12.957759", location: "Toronto, Canada" },
  { filename: "vintage_tv.webp", date: "2025-05-16T18:29:12.936118", location: "Toronto, Canada" },
  { filename: "umbrellas.webp", date: "2025-05-16T18:29:12.915298", location: "Nassau, Bahamas" },
  { filename: "street_art.webp", date: "2025-05-16T18:29:12.878564", location: "New York City, New York" },
  { filename: "soho.webp", date: "2025-05-16T18:29:12.845551", location: "New York City, New York" },
  { filename: "nyc_starbucks.webp", date: "2025-05-16T18:29:12.817077", location: "New York City, New York" },
  { filename: "south_beach.webp", date: "2025-05-16T18:29:12.852392", location: "Miami, Florida" },
  { filename: "old_car.webp", date: "2025-05-16T18:29:12.822759", location: "Miami, Florida" },
  { filename: "stairs2.webp", date: "2025-05-16T18:29:12.871325", location: "Toronto, Canada" },
  { filename: "stairs.webp", date: "2025-05-16T18:29:12.862098", location: "Toronto, Canada" },
  { filename: "library_study.webp", date: "2025-05-16T18:29:12.804773", location: "Toronto, Canada" },
  { filename: "gallery_wall.webp", date: "2025-05-16T18:29:12.796359", location: "Toronto, Canada" },
];

const METADATA_KEY = "photos-metadata.json";

async function migrate() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("Missing BLOB_READ_WRITE_TOKEN in .env.local");
    process.exit(1);
  }

  const metadata: PhotoMetadata[] = [];
  const photosDir = join(process.cwd(), "public", "img", "photos");

  for (const photo of photosData) {
    const filePath = join(photosDir, photo.filename);
    try {
      const fileBuffer = readFileSync(filePath);
      const blob = await put(`photos/${photo.filename}`, fileBuffer, {
        access: "public",
        contentType: "image/webp",
      });

      metadata.push({
        url: blob.url,
        filename: photo.filename,
        location: photo.location,
        date: photo.date,
      });

      console.log(`Uploaded: ${photo.filename} -> ${blob.url}`);
    } catch (err) {
      console.error(`Failed to upload ${photo.filename}:`, err);
    }
  }

  // Save metadata
  const { blobs: existingMeta } = await list({ prefix: METADATA_KEY });
  for (const blob of existingMeta) {
    await del(blob.url);
  }
  await put(METADATA_KEY, JSON.stringify(metadata), {
    access: "public",
    contentType: "application/json",
  });

  console.log(`\nMigration complete! ${metadata.length} photos uploaded.`);
  console.log("Metadata saved to Vercel Blob.");
  console.log(
    "\nYou can now optionally remove photos from public/img/photos/",
  );
  console.log(
    "and clean up photos.ts / public/img/index.ts if you want to go fully blob-based.",
  );
}

migrate();

"use client";
import { cn } from "@/utils/cn";
import { motion, useScroll, useTransform } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useRef } from "react";

interface PhotoWithLocation {
  image: StaticImageData;
  location: string;
}

export const PhotoGallery = ({
  images,
  photosWithLocations,
  className,
}: {
  images?: StaticImageData[];
  photosWithLocations?: PhotoWithLocation[];
  className?: string;
}) => {
  // Support both old format (just images) and new format (photos with locations)
  const photoData =
    photosWithLocations ||
    images?.map((img) => ({ image: img, location: "" })) ||
    [];
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const columns: PhotoWithLocation[][] = [[], [], []];
  photoData.forEach((photo, index) => {
    const col = index % 3;
    columns[col].push(photo);
  });

  return (
    <div
      className={cn(
        "hide-scrollbar h-full w-full items-start overflow-y-auto rounded-lg md:h-[50rem]",
        className,
      )}
      ref={gridRef}
    >
      <div
        className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3"
        ref={gridRef}
      >
        <div className="grid gap-5">
          {columns[0].map((photo, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="group relative"
            >
              <a
                href={photo.image.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={photo.image}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                {photo.location && (
                  <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    📍 {photo.location}
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-5">
          {columns[1].map((photo, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={"grid-2" + idx}
              className="group relative"
            >
              <a
                href={photo.image.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={photo.image}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                {photo.location && (
                  <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    📍 {photo.location}
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-5">
          {columns[2].map((photo, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              className="group relative"
            >
              <a
                href={photo.image.src}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={photo.image}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
                {photo.location && (
                  <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    📍 {photo.location}
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

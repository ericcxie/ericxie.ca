"use client";
import { cn } from "@/utils/cn";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

interface PhotoWithLocation {
  image: string;
  location: string;
}

function PhotoImage({
  photo,
  className,
  onClick,
}: {
  photo: PhotoWithLocation;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div className="relative" onClick={onClick}>
      <Image
        src={photo.image}
        className={cn(
          "h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0",
          className,
        )}
        height={400}
        width={400}
        alt="thumbnail"
      />
    </div>
  );
}

export const PhotoGallery = ({
  photosWithLocations,
  className,
}: {
  photosWithLocations: PhotoWithLocation[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const [activeMobilePhoto, setActiveMobilePhoto] = useState<number | null>(
    null,
  );
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const columns: PhotoWithLocation[][] = [[], [], []];
  photosWithLocations.forEach((photo, index) => {
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
      {/* Mobile: Single column in chronological order */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:hidden">
        {photosWithLocations.map((photo, idx) => (
          <div
            key={`mobile-${idx}`}
            className="relative cursor-pointer"
          >
            <PhotoImage
              photo={photo}
              className={activeMobilePhoto === idx ? "grayscale" : undefined}
              onClick={() =>
                setActiveMobilePhoto(activeMobilePhoto === idx ? null : idx)
              }
            />
            {photo.location && activeMobilePhoto === idx && (
              <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                📍 {photo.location}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: 3-column masonry grid */}
      <div
        className="mx-auto hidden max-w-5xl grid-cols-1 items-start gap-5 md:grid md:grid-cols-2 lg:grid-cols-3"
        ref={gridRef}
      >
        {columns.map((column, colIdx) => {
          const translate = [translateFirst, translateSecond, translateThird][colIdx];
          return (
            <div key={colIdx} className="grid gap-5">
              {column.map((photo, idx) => (
                <motion.div
                  style={{ y: translate }}
                  key={`grid-${colIdx}-${idx}`}
                  className="group relative"
                >
                  <a
                    href={photo.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PhotoImage
                      photo={photo}
                      className="hover:grayscale"
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
          );
        })}
      </div>
    </div>
  );
};

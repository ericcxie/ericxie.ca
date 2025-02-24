"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { StaticImageData } from "next/image";

export const PhotoGallery = ({
  images,
  className,
}: {
  images: StaticImageData[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Calculate how many images per column based on total images
  const totalImages = images.length;
  const imagesPerColumn = Math.ceil(totalImages / 3);

  // Create arrays for each column maintaining left-to-right order
  const columns: StaticImageData[][] = [[], [], []];
  images.forEach((image, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    columns[col].push(image);
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
          {columns[0].map((el, idx) => (
            <motion.div style={{ y: translateFirst }} key={"grid-1" + idx}>
              <a href={el.src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={el}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
              </a>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-5">
          {columns[1].map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx}>
              <a href={el.src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={el}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
              </a>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-5">
          {columns[2].map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx}>
              <a href={el.src} target="_blank" rel="noopener noreferrer">
                <Image
                  src={el}
                  className="h-70 !m-0 w-full gap-5 rounded-lg object-cover object-left-top !p-0 transition duration-500 hover:grayscale"
                  height="400"
                  width="400"
                  alt="thumbnail"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

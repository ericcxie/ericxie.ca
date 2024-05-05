"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

export const InfiniteMovingCards = ({
  items,
  direction,
  speed,
  pauseOnHover,
  className,
}: {
  items: {
    title: string;
    tag: string;
    description: string;
    tools: string[];
    image: string;
    link: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <div key={item.title}>
            <div
              key={idx}
              className="group relative h-[150px] w-[250px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl md:h-[250px] md:w-[430px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-50 group-hover:blur-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-50 dark:bg-black dark:bg-opacity-0">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRightIcon className="absolute right-1 top-1 h-9 w-9 p-1 opacity-0 duration-200 group-hover:opacity-70 md:h-10 md:w-10 md:hover:-translate-y-[1.5px] md:hover:translate-x-[1.5px]" />
                </a>
                <div className="px-4 py-4 text-left text-white opacity-0 group-hover:opacity-100 md:px-8">
                  <h2 className="hidden font-bold text-text-light-headerLight dark:text-text-dark-header md:inline">
                    {item.title}
                  </h2>
                  <p className="text-sm text-text-light-headerLight dark:text-text-dark-body md:text-base">
                    {item.description}
                  </p>
                  <div className="hidden flex-wrap gap-2 md:flex">
                    {item.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="mt-2 rounded-lg bg-stone-800/80 px-3 py-1 text-sm text-white"
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs md:text-base">
              <h2 className="mr-2 inline-block font-bold text-text-light-headerLight dark:text-white">
                {item.title}
              </h2>
              <span className="inline-block align-middle text-text-light-body dark:text-text-dark-body">
                ⸺
              </span>
              <p className="ml-2 inline-block text-text-light-body dark:text-text-dark-body">
                {item.tag}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

"use client";

import { cn } from '@/utils/cn';
import { ArrowUpRightIcon } from '@heroicons/react/20/solid';
import { EmblaOptionsType } from 'embla-carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import React from 'react';

interface Slide {
  title: string;
  tag: string;
  description: string;
  tools: string[];
  image: string;
  link: string;
}

type PropType = {
  slides: Slide[]
  options?: EmblaOptionsType
}

const InfiniteMovingCards: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: true, direction: "backward", startDelay: 500, speed: 0.3 })
  ])

  return (
    <div className={cn(
      "scroller relative pt-4 z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
    )}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="backface-hidden flex touch-pan-y">
          {slides.map((slide, idx) => (
            <div key={slide.title} className="min-w-0 shrink-0 grow-0 basis-auto px-2">
              <div
                key={idx}
                className="group relative h-[150px] w-[250px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl md:h-[250px] md:w-[430px]"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-50 group-hover:blur-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-0 transition-opacity duration-300 ease-in-out group-hover:bg-opacity-50 dark:bg-black dark:bg-opacity-0">
                  <a href={slide.link} target="_blank" rel="noopener noreferrer">
                    <ArrowUpRightIcon className="absolute right-1 top-1 h-9 w-9 p-1 opacity-0 duration-200 group-hover:opacity-70 md:h-10 md:w-10 md:hover:-translate-y-[1.5px] md:hover:translate-x-[1.5px]" />
                  </a>
                  <div className="px-4 py-4 text-left text-white opacity-0 group-hover:opacity-100 md:px-8">
                    <h2 className="hidden font-bold text-text-light-headerLight dark:text-text-dark-header md:inline">
                      {slide.title}
                    </h2>
                    <p className="text-sm text-text-light-headerLight dark:text-text-dark-body md:text-base">
                      {slide.description}
                    </p>
                    <div className="hidden flex-wrap gap-2 md:flex">
                      {slide.tools.map((tool, index) => (
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
                  {slide.title}
                </h2>
                <span className="inline-block align-middle text-text-light-body dark:text-text-dark-body">
                  ⸺
                </span>
                <p className="ml-2 inline-block text-text-light-body dark:text-text-dark-body">
                  {slide.tag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InfiniteMovingCards;

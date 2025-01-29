"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: true, stopOnInteraction: false, stopOnMouseEnter: true, direction: "ltr", startDelay: 500, speed: 1 })
  ])

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number bg-red-500">
                <span>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel

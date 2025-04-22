---
title: "Rebuilding Shopify.vc"

category: "Work"

date: "04-25-2025"
---

![shopify ventures](/img/blog/shopify/shopify_ventures.webp)

# Background

As I wrap up my 4 months Software Engineering internship at Shopify, I wanted a chance to reflect on my experience and share some of the things I learned along the way. I worked on the Creative team where our goal was to capture the long-term brand value of Shopify. Some past projects that my team was involved with includes [Shopify Milestones](https://milestones.shopify.com/), [Shopify x MrBeast](https://www.shopify.com/mrbeast), and [BFCM](https://bfcm.shopify.com/) to just name a few. This term, my main project was to rebuild/revamp [shopify.vc](https://shopify.vc/), the main site for Shopify Ventures, our investment division.

# Shopify Ventures Rewrite

My manager came to me one day and told me that he had an exciting project for me where I'd get the chance to take full ownership. The Venture's team had requested some overhaul to the site such as the ability to self-serve content update and more interactivity.

For some context, the original site was built by a third-party agency and so naturally the repo contained a lot of technical debt (dependency hell 🥲). So much so that my manager saw this as a good opportunity to start from scratch and build it in-house.

## Image to ASCII

In the old site, the ASCII art animation was implemented using a series of images which as you can imagine is a pretty big performance bottleneck.

The way ASCII art is generated is actually pretty simple. An image is comprised of thousands of pixels each composed of three primary colour values: Red (R), Green (G), and Blue (B). These values are typically 8-bit integers that range from 0 to 255, representing the intensity of the colour in the pixel.

![pixel RGB](/img/blog/shopify/pixel_rgb.webp)

For each pixel of a given image, we calculate its grayscale value (how light or dark the pixel is) using the formula `0.3 x R + 0.59 x G + 0.11 x B` where R, G, and B represents the red, green and blue colour values.

Once we have this, we can map the grayscale value to a set of ASCII characters. In my case, I defined it as:

`const asciiChars = ' ,:;+*>%S#X';`

Where the characters are ordered from lightest to darkest. We then map the grayscale value to an ASCII character

`const char = asciiChars[Math.floor((pixel / 255) * (asciiChars.length - 1))];`

Where `pixel` is the grayscale value. After we get the corresponding ASCII character, we append this to a string `asciiString` with line breaks `\n` to denote the end of each row of characters.

This string gets passed into another function `drawAscii` which iterates through these lines and uses `context.fillText(line, x, y)` to draw each line of characters at the appropriate position on the canvas, where `x` and `y` are the starting horizontal and vertical positions respectively.

## Spinning Globe

This ASCII function allows us to create some pretty cool stuff. For example, this spinning globe was implemented using only 20kb of JavaScript and a single 26kb WebP image. No additional libraries. No three.js.

![landing page](/img/blog/shopify/landing.gif)

This was done by using a technique called UV mapping where we take a 128x128 sphere with its UV values as a fragment shader and then map a flat Earth image onto it, effectively mapping the 2D surface to a 3D sphere. The UV map contains coordinates that map each pixel on a sphere to a location on the flat Earth image.

![flat earth](/img/blog/shopify/uv_mapping.png)

You can read more about UV mapping [here](https://en.wikipedia.org/wiki/UV_mapping). To simulate the rotation, we adjust the x-coordinate offset, creating a continuous illusion of spinning. For each "rotated" frame of the globe, we convert it to ASCII characters and then draw these onto the canvas.

Here's another example of where the Image to ASCII function was used.

![flat earth](/img/blog/shopify/differences.gif)

This one actually contains a transition between two ASCII images by blending the characters together slowly as the user scrolls.

# My Intern Experience

![office](/img/blog/shopify/office.webp)

## New York City Burst

![burst](/img/blog/shopify/burst.webp)

## Shopify x Socratica Symposium

![socratica](/img/blog/shopify/socratica.webp)

# What I learned

# Ending Remarks

And of course... all the amazing food and matcha!

![food](/img/blog/shopify/food.webp)

---
title: "Rebuilding Shopify.vc"

category: "Work"

date: "04-25-2025"
---

![shopify ventures](/img/blog/shopify/shopify_ventures.webp)

# Background

As I wrap up my 4 months Software Engineering internship at Shopify, I wanted a chance to reflect on my experience and share some of the things I learned along the way. I worked on the Creative team where our goal was to capture the long-term brand value of Shopify. Some past projects that my team was involved with includes [Shopify Milestones](https://milestones.shopify.com/), [Shopify x MrBeast](https://www.shopify.com/mrbeast), and [BFCM](https://bfcm.shopify.com/) to just name a few. This term, my main project was to revamp [shopify.vc](https://shopify.vc/), the main site for Shopify Ventures, our investment division.

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

Where the characters are ordered from lightest to darkest. We then map the grayscale value to an ASCII character.

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

This one contains a transition between two ASCII images by blending the characters together slowly as the user scrolls.

## Storefront API

This feature is arguably less interesting but very useful. Since this site is built on [Hydrogen](https://hydrogen.shopify.dev/), it's super easy to connect to a Shopify store using the Storefront API. This allows us to effectively treat the store as a Content Management System (CMS).

![burst](/img/blog/shopify/storefront.png)

In the past, whenever the Venture's team needed to make an update to the list of clients or news cards, they'd have to ask a developer to manually make a change in the codebase.

Now, all the metaobjects are stored in the storefront and we retrieve the data by making a simple GraphQL call.

# My Intern Experience

I still remember the sheer awe I felt as my manager and mentor showed me around the Toronto Port office for the first time.

![office](/img/blog/shopify/office.webp)

Each floor had its own theme ranging from Ski resorts to Toronto parks. The cool thing is that all the furniture and snacks in the office were sourced from local Shopify merchants.

![food](/img/blog/shopify/food.webp)

Can't forget about all the food and matcha! If there's one thing I can walk away from this experience having learned, it's how to make matcha. I think I averaged at least a cup of matcha a day 😅

## New York City Burst

One of the highlights of my internship was getting to spend a week in New York City for a "burst"—an in-person gathering that happens about twice a year. Since many many people work remotely, we have colleagues from all over the world so these bursts are a great opportunity for everyone to come together and connect face-to-face.

![burst](/img/blog/shopify/burst.webp)

It was cool seeing the New York office, and I had a lot of fun doing team bonding activities like taking a custom scent-making class.

## Shopify x Socratica Symposium

I also went to [Socratica Winter 2025 Symposium](https://symposium.socratica.info/) as a Shopify sponsor! I think the best part was having reserved front row seats 😎

I don't think I've ever been that close to so many big cameras before...

![socratica](/img/blog/shopify/socratica.webp)

I had a lot more fun than I initially expected. It was super inspiring to see all these cool projects that these people have been working on.

# What I learned

- Absorb like a sponge
- Learning with an open mind
- Have fun!

# Ending Remarks

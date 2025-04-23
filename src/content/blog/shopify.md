---
title: "Rebuilding Shopify.vc"

category: "Work"

date: "04-25-2025"
---

![shopify ventures](/img/blog/shopify/shopify_ventures.webp)

# Background

As I wrap up my 4-month Software Engineering internship at Shopify, I wanted a chance to reflect on my experience and share some of the things I learned along the way. I worked on the Creative team where our goal was to capture the long-term brand value of Shopify. Some past projects that my team was involved with include [Shopify Milestones](https://milestones.shopify.com/), [Shopify x MrBeast](https://www.shopify.com/mrbeast), and [BFCM](https://bfcm.shopify.com/) to name a few. This term, my main project was to revamp [shopify.vc](https://shopify.vc/), the main site for Shopify Ventures, our investment division.

# Shopify Ventures Rewrite

My manager came to me one day and told me that he had an exciting project for me where I'd get the chance to take full ownership.

For some context, the original site was built by a third-party agency and so naturally the repo contained a lot of technical debt (dependency hell 🥲). So much so that my manager saw this as a good opportunity to start from scratch and build it in-house.

## Image to ASCII

In the old site, the ASCII art animation was implemented using a series of images which as you can imagine is a pretty big performance bottleneck.

The way ASCII art is generated is actually pretty simple. An image is comprised of pixels each composed of three primary colour values: Red (R), Green (G), and Blue (B). These values are typically 8-bit integers that range from 0 to 255, representing the intensity of the colour in the pixel.

![pixel RGB](/img/blog/shopify/pixel_rgb.webp)

For each pixel of a given image, we calculate its grayscale value (how light or dark the pixel is) using the formula `0.3 x R + 0.59 x G + 0.11 x B` where R, G, and B represent the red, green and blue colour values.

Once we have this, we can map the grayscale value to a set of ASCII characters. In my case, I defined it as:

`const asciiChars = ' ,:;+*>%S#X';`

Where the characters are ordered from lightest to darkest. We then map the grayscale value to an ASCII character.

`const char = asciiChars[Math.floor((pixel / 255) * (asciiChars.length - 1))];`

Where `pixel` is the grayscale value. After we get the corresponding ASCII character, we append this to a string `asciiString` with line breaks `\n` to denote the end of each row of characters.

This string gets passed into another function `drawAscii` which iterates through these lines and uses `context.fillText(line, x, y)` to draw each line of characters at the appropriate position on the canvas, where `x` and `y` are the starting horizontal and vertical positions respectively.

## Spinning Globe

This ASCII function allows us to create some pretty cool stuff. For example, this spinning globe was implemented using only 20kb of JavaScript and a single 26kb WebP image. No additional libraries. No three.js.

![landing page](/img/blog/shopify/landing_page.gif)

This was done by using a technique called UV mapping where we take a 128x128 sphere with its UV values as a fragment shader and then map a flat Earth image onto it, effectively mapping the 2D surface to a 3D sphere. The UV map contains coordinates that map each pixel on a sphere to a location on the flat Earth image.

![uv mapping](/img/blog/shopify/uv_mapping.webp)

You can read more about UV mapping [here](https://en.wikipedia.org/wiki/UV_mapping). To simulate the rotation, we adjust the x-coordinate offset, creating a continuous illusion of spinning. For each "rotated" frame of the globe, we convert it to ASCII characters and then draw these onto the canvas.

Here's another example of where the Image to ASCII function was used.

![differences page](/img/blog/shopify/differences_page.gif)

This one contains a transition between two ASCII images by blending the characters together slowly as the user scrolls.

## Storefront API

This feature is arguably less interesting but very useful. Since this site is built on [Hydrogen](https://hydrogen.shopify.dev/), it's super easy to connect to a Shopify store using the Storefront API. This allows us to effectively treat the store as a Content Management System (CMS).

![storefront](/img/blog/shopify/storefront.webp)

In the past, whenever the Venture's team needed to make an update to the list of clients or news cards, they'd have to ask a developer to manually make a change in the codebase.

Now, all the metaobjects are stored in the storefront and we retrieve the data by making a simple GraphQL call.

# My Intern Experience

I still remember the sheer awe I felt as my manager and mentor showed me around the Toronto Port office for the first time.

![toronto port](/img/blog/shopify/toronto_port.webp)

Each floor had its own theme ranging from ski resorts to Toronto parks. The cool thing is that all the furniture and snacks in the office are sourced from local Shopify merchants.

![food](/img/blog/shopify/food.webp)

Can't forget about all the food and matcha! If there's one thing I can walk away from this experience having learned, it's how to make matcha. I think I averaged at least a cup of matcha a day 😅

## New York City Burst

One of the highlights of my internship was getting to spend a week in New York City with my team for a "burst"—an in-person gathering that happens about twice a year. Since many people work remotely, we have colleagues from all over the world so these bursts are a great opportunity for everyone to come together and connect face-to-face.

![burst](/img/blog/shopify/burst.webp)

It was cool seeing the New York office, and I had a lot of fun doing team bonding activities like taking a custom scent-making class.

## Shopify x Socratica Symposium

I also went to [Socratica Winter 2025 Symposium](https://symposium.socratica.info/) as a Shopify sponsor! I think the best part was having reserved front-row seats 😎

I don't think I've ever been that close to so many big cameras before...

![socratica](/img/blog/shopify/socratica.webp)

I had a lot more fun than I initially expected. It was super inspiring to see all these cool projects that these people have been working on.

# What I learned

Admittedly, I was a bit disappointed when I first saw my team matching results. I had been hoping to get the chance to improve my backend skills as I felt like that was an area that I was lacking. However, I believe there are always learning opportunities, you just have to look for them. Here are three takeaways from my internship.

## Absorb like a sponge

The biggest mindset shift for me this term was learning how to be comfortable not knowing everything right away. Whether that's going through an unfamiliar codebase, or watching designers present creative directions, I tried to soak in as much knowledge as I could. Four months believe it or not is a really short time, so you want to maximize the amount of knowledge you can get.

## Learn with an open mind

As engineers, it's often easy to dismiss anything that isn't directly technical or related to your goals. Being surrounded by a team filled with designers, creatives, and marketers, gave me a better appreciation for the non-technical sides of product development. I honestly never thought I'd work with creative coding ever but at the end of the day—I'm glad I did. When else in my career would I get the chance to animate ASCII art.

## When in doubt, go with the simple solution

It's easy to think that a more complex solution must be better. I used to believe that if a library exists, you should use it. But in practice, I've found that it's often better _not_ to. I could've used GSAP or Framer for animations, or an ASCII rendering library, but that would've added extra dependencies, increased the bundle size, and reduced my creative control. That's not to say that you should rebuild everything from scratch. But when the problem is simple enough, building it yourself often results in cleaner, faster, and more maintainable code.

# Ending Remarks

It's kinda surreal that this term has already come to an end. I'd be lying if I said I wouldn't miss the bottomless snacks on the 11th floor or the weekly pair programming session with my mentor in room 6.225° every Wednesday.

![office](/img/blog/shopify/office.webp)

I’m incredibly thankful to my team for being so welcoming, and to my manager and mentor for consistently supporting my growth and learning throughout the term.

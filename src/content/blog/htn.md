---
title: "Building platforms for Canada's biggest hackathon"

category: "Work"

date: "12-30-2024"
---

![hackthenorth](/img/blog/htn/hackthenorth.jpg)

# Overview

A year ago, I applied as a hacker to Canada's biggest hackathon—Hack the North. It was THE hackathon to attend for any aspiring student looking to pursue a career in tech and like many others, I dreamt of attending it one day. To my dismay, I was rejected.

For those who don't know, Hack the North is an annual event where 1,000+ students from around the world come together to build something cool in 36 hours. We provide all resources and accommodations, such as travel, mentorship, and food, so that hackers can focus on one thing—building.

This year, instead of joining as a hacker, I was an organizer on the frontend development team. Here are some of the projects I worked on and what I learned.

# Projects

The first thing I noticed when I joined the team was how organized and meticulous the entire process was from the development to project timelines. It's a true testament to the success of Hack the North and goes to show all the continuous improvements made to the process over the years. Every year, the entire frontend team works on the static site and hacker application first. We then split off into separate projects. I worked on travel and volunteer tool.

The way things usually work is we'd start with a design handoff where the frontend team meets with the design team to discuss feasibility. Seeing the designs for the first time is always exciting (kudos to the design team), but eventually, the technical realities dawn on you. Once the design is all sorted out, the tasks get delegated to respective frontend developers and we get to work!

## Static Site

This was our first project and probably one of the more important ones. Every year, we come up with a new theme/branding. This year's theme was more dreamy and nostalgic to encourage hackers to dream big. To reflect this, we completely redesign our website annually to align with the new theme.

I developed the hacker testimonial and sponsors section of the website. Check out the completed product [here](https://hackthenorth.com/)!

![landing page](/img/blog/htn/landing.jpg)

## Hacker Applications

Similar to how we had to revamp our static site, we also redesigned the hacker application portal to match this year's theme. We try to make the application experience as seamless and interactive as possible. This year, we gave applicants the ability to customize their own car which guides them throughout the entire process.

![customize car](/img/blog/htn/customize_car.png)

I worked on the long answer sections (application and survey).

![hacker app](/img/blog/htn/hacker_app.gif)

## Travel Tool

I was the DRI for this project. It was my first time leading a project, though it was relatively short since the tool was already built. This year, backend decided to revise the bus schema to support multiple bus stops so there were some changes that needed to be made on the frontend side.

Previously, each route was represented as its own bus object (e.g. Western → UWaterloo). However, since we have buses that can travel through multiple stops (e.g. UMichigan → Western → UWaterloo) and they share the same capacity, it made more sense to encapsulate them into a single bus object.

Backend made a change that saved bus information into a `BusStops` array as part of the bus object. This meant that we had to update the way we search for buses and assign/remove users from stops.

![travel_tool](/img/blog/htn/travel_tool.png)

## Volunteer Tool

This project was definitely more difficult as we had to build it from scratch. In past years, we used third-party software for our volunteers to sign up for shifts. However, this became rather costly and so this year, it was decided that we would attempt to build it in-house.

Unfortunately, we were unable to launch the tool on time this year due to hiccups along the way and the tight timeline we had. Nevertheless, I'm proud of the progress we made and it certainly sets the stage for the frontend team next year to take over! I'm looking forward to seeing this tool shipped and used by volunteers for years to come.

![travel_tool](/img/blog/htn/volunteer_dashboard.png)

![travel_tool](/img/blog/htn/volunteer_database.png)

# What I learned

When I joined, I never thought I’d learn as much as I have in the past eight months. Despite it being a hackathon, it's been surprising how much engineering principles are distilled. For me, the biggest takeaway is the importance of _shipping fast and iterate_.

Given the nature of organizing a hackathon, we are constantly under a strict timeline as the event date approaches much quicker than you'd expect. If we delay one project, the subsequent projects would also be affected and so because of this, I had to learn to let go of my perfectionist tendencies and to prioritize tasks to deliver projects on time. Minor issues can always be addressed later, so they shouldn’t become blockers.

Honourable mention: QA is grossly overlooked. The amount of issues we could've avoided with users if someone had caught it in QA would've saved us so much time.

# Ending Remarks

Although I won't be returning to the team next year, I'm glad I got the opportunity to be a part of organizing such an impactful event and I can confidently say that it is one of my most fulfilling experiences yet.

I'm grateful to have had the chance to work with such a talented group of people and I'm sure HTN 2025 will be even better!

![frontend team](/img/blog/htn/fe_team.jpg)

![htn team](/img/blog/htn/htn_team.jpg)

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import clsx from "clsx";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import NavLink from "@/components/ui/NavLink";

import local from "next/font/local";

const links = [
  { label: "About", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Photos", href: "/photos" },
];

const autograf = local({
  src: [{ path: "../../../public/fonts/Autograf.ttf", weight: "400" }],
  variable: "--font-autograf",
});

export default function Header() {
  const pathname = `/${usePathname().split("/")[1]}`;
  const [hoveredPath, setHoveredPath] = useState(pathname);
  console.log("pathname:", pathname);
  console.log("hoveredPath:", hoveredPath);

  return (
    <header className="md:mt-6">
      <nav className="mx-auto flex max-w-[700px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="dark:text-text-dark-headerDark ml-2 shrink-0 text-text-light-body md:ml-0"
        >
          <h1 className={`${autograf.className} text-3xl`}>Eric</h1>
        </Link>
        {/* Main links */}
        {/* <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul> */}
        <div className="hidden gap-2 md:flex">
          {links.map((item) => {
            const isActive = item.href === pathname;

            return (
              <Link
                key={item.href}
                className={`relative rounded-md px-4 py-1 text-sm no-underline duration-300 ease-in lg:text-base ${
                  isActive
                    ? "text-text-light-headerLight dark:text-text-dark-header"
                    : "dark:text-text-dark-headerDark text-text-light-body"
                }`}
                data-active={isActive}
                href={item.href}
                onMouseOver={() => setHoveredPath(item.href)}
                onMouseLeave={() => setHoveredPath(pathname)}
              >
                <span>{item.label}</span>
                {item.href === hoveredPath && (
                  <motion.div
                    className="absolute bottom-0 left-0 -z-10 h-full rounded-md bg-stone-200 dark:bg-stone-800/80"
                    layoutId="navbar"
                    aria-hidden="true"
                    style={{
                      width: "100%",
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 130,
                      damping: 15,
                      duration: 0.05,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex h-8 w-8 items-center justify-center md:ml-0">
          <ThemeSwitcher />
        </div>

        <Popover className="relative md:hidden">
          <Popover.Button className="dark:text-text-dark-headerDark flex h-8 w-8 items-center justify-center rounded-lg text-text-light-body">
            <Bars3Icon className="hover:text-primary dark:text-text-dark-headerDark h-8 w-8 cursor-pointer text-text-light-body transition-colors" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="border-secondary bg-primary absolute right-0 z-10 mt-2 w-40 origin-top-right overflow-auto rounded-xl border bg-background-light p-2 text-base shadow-lg focus:outline-none dark:bg-background-dark sm:text-sm">
              <div className="grid">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "hover:text-primary rounded-md px-4 py-2 transition-colors",
                      pathname === link.href
                        ? "bg-gray-200 font-medium dark:bg-stone-800/80"
                        : "font-normal",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </nav>
    </header>
  );
}
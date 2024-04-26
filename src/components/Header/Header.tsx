"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

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

  return (
    <header className="md:mt-6">
      <nav className="mx-auto flex max-w-[700px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="text-primary shrink-0">
          <h1 className={`${autograf.className} text-3xl`}>Eric</h1>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href}>{link.label}</NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex h-8 w-8 items-center justify-center md:ml-0">
          <ThemeSwitcher />
        </div>

        <Popover className="relative md:hidden">
          <Popover.Button className="text-secondary flex h-8 w-8 items-center justify-center rounded-lg">
            <Bars3Icon className="text-secondary hover:text-primary h-5 w-5 cursor-pointer transition-colors" />
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
            <Popover.Panel className="border-secondary bg-primary absolute right-0 z-10 mt-2 w-40 origin-top-right overflow-auto rounded-xl border p-2 text-base shadow-lg focus:outline-none sm:text-sm">
              <div className="grid">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "hover:text-primary rounded-md px-4 py-2 transition-colors",
                      pathname === link.href
                        ? "bg-secondary font-medium"
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

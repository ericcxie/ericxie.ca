import type { Metadata } from "next";

import Header from "@/components/Header/Header";
import { ThemeProvider } from "@/providers/ThemeProvider";
import local from "next/font/local";
import "./globals.css";

const akkurat = local({
  src: [{ path: "../../public/fonts/AkkuratPro.ttf", weight: "400" }],
  variable: "--font-akkurat",
});

export const metadata: Metadata = {
  title: "Eric Xie",
  description: "Eric Xie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${akkurat.className} bg-background-light dark:bg-background-dark`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Header />
          <div className="mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

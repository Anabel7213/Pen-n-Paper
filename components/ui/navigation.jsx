"use client";

import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Separator } from "./separator";

export default function Menu() {
  const routes = [
    {
      href: "/dictionary",
      label: "Dictionary",
    },
    {
      href: "/translator",
      label: "Translator",
    },
    {
      href: "/about",
      label: "About",
    },
  ];
  return (
    <>
      <nav className="flex justify-between py-2 px-6 items-center">
        <Link href="/" className="font-black">
          Pen & Paper
        </Link>
        <div className="menu flex gap-6 items-center text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              {route.label}
            </Link>
          ))}
           <ModeToggle />
        </div>
      </nav>
      <Separator />
    </>
  );
}

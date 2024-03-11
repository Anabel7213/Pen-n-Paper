"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    const routes = [
        {
            href: "https://www.linkedin.com/in/anastasia-bielievitina-b20396259/",
            label: "LinkedIn"
        },
        {
            href: "https://github.com/Anabel7213",
            label: "Github"
        },
        {
            href: "https://www.abielievitina.com/",
            label: "Website"
        }
    ]
  return (
    <>
      <div className="flex h-screen mx-4">
        <div className="m-auto flex flex-col gap-4 max-w-[400px]">
          <h3 className="font-black text-6xl">About</h3>
          <p className="font-medium flex flex-wrap">
            Hey! I’m Anastasia, a UX/UI designer & Full Stack developer based out of New York. Programming is something I can do 24/7 and still never run out of motivation to problem solve and deliver fun user experience. There’s immense freedom in being able to make any idea come alive. Hit me up if you want to collaborate, I’m more than open to ✌️.
            </p>
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
            {routes.map((routes) => (
                <Link className="w-full" href={routes.href} key={routes.href}>
                    <Button variant="outline" className="w-full hover:bg-gradient-to-tr">{routes.label}</Button>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </>
  );
}

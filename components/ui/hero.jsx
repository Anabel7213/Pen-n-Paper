import { Button } from "./button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex h-screen">
      <div className="m-auto flex flex-col gap-4 max-w-[400px]">
        <span role="img" aria-label="waving-hand" className="text-4xl">
          👋
        </span>
        <h3 className="font-black text-6xl">Hello.</h3>
        <p className="font-medium flex flex-wrap">
          Welcome to Pen & Paper, an English word dictionary and translator. Simplistic yet powerful.
        </p>
        <div className="flex gap-4">
          <Link href="/translator">
            <Button className="w-full">
              Use Translator
            </Button>
          </Link>
          <Link href="/dictionary">
            <Button className="w-full" variant="ghost">
              Use Dictionary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
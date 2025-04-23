"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="w-full py-4" role="banner">
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold italic"
            aria-label="SK - Home"
          >
            sk.
          </Link>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

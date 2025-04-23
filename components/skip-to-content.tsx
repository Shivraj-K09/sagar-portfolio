"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SkipToContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white dark:focus:bg-black focus:text-black dark:focus:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 focus:rounded-md"
    >
      Skip to content
    </Link>
  );
}

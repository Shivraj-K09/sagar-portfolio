import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-16 border-t border-neutral-200 dark:border-neutral-800"
      role="contentinfo"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-normal mb-4">Sagar Kadgond</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-md font-light">
              I'm a video editor with a passion for storytelling through visual
              media. Turning ideas into impactful visual experiences.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <h3 className="text-lg font-normal mb-4">Contact</h3>
            <Link
              href="mailto:kadgonds@gmail.com"
              className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors mb-2 font-light"
              aria-label="Email Sagar Kadgond"
            >
              kadgonds@gmail.com
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 font-light">
              India
            </p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm font-light">
          <p>© {currentYear} Sagar Kadgond. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

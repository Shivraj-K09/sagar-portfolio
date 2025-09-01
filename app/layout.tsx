import type React from "react";
import "@/app/globals.css";
import { Geist, Dancing_Script } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { FilmGrain } from "@/components/film-grain";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

// Adding a cursive font for the name
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const metadata = {
  title: "Sagar Kadgond | Professional Video Editor",
  description:
    "Sagar Kadgond is a professional video editor specializing in narrative-driven editing, visual storytelling, and cinematic techniques. View portfolio and hire for your next project.",
  keywords: [
    "video editor",
    "video editing",
    "film editing",
    "post-production",
    "visual storytelling",
    "Sagar Kadgond",
    "video portfolio",
    "professional editor",
    "cinematic editing",
    "narrative editing",
  ],
  authors: [{ name: "Sagar Kadgond" }],
  creator: "Sagar Kadgond",
  publisher: "Sagar Kadgond",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sagarcuts.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sagar Kadgond | Professional Video Editor",
    description:
      "Professional video editor specializing in narrative-driven editing, visual storytelling, and cinematic techniques.",
    url: "https://sagarcuts.vercel.app",
    siteName: "SagarCuts",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sagar Kadgond - Professional Video Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagar Kadgond | Professional Video Editor",
    description:
      "Professional video editor specializing in narrative-driven editing, visual storytelling, and cinematic techniques.",
    creator: "@samundarmai",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://sagarcuts.vercel.app" />
      </head>
      <body className={`${geist.className} ${dancingScript.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FilmGrain />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

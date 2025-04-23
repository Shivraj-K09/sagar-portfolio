import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VideoShowcase } from "@/components/video-showcase"
import { Footer } from "@/components/footer"
import { VideoScrubber } from "@/components/video-scrubber"
import { StructuredData } from "@/components/seo/structured-data"
import { SkipToContent } from "@/components/skip-to-content"

export default function VideoEditorPortfolio() {
  return (
    <>
      <StructuredData />
      <SkipToContent />
      <main id="main-content" className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Header />
        <HeroSection />
        <VideoShowcase />
        <Footer />
        <VideoScrubber />
      </main>
    </>
  )
}

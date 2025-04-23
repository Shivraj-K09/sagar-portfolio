"use client"

import { useEffect, useState } from "react"

export function VideoScrubber() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [timecode, setTimecode] = useState("00:00:00:00")

  useEffect(() => {
    // Show the scrubber after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Calculate scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      setProgress(scrollPercent)

      // Generate timecode based on scroll position (HH:MM:SS:FF)
      const totalFrames = Math.floor(scrollPercent * 1800) // 60 seconds × 30fps = 1800 frames
      const frames = totalFrames % 30
      const totalSeconds = Math.floor(totalFrames / 30)
      const seconds = totalSeconds % 60
      const minutes = Math.floor(totalSeconds / 60) % 60
      const hours = Math.floor(totalSeconds / 3600)

      setTimecode(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}:${frames.toString().padStart(2, "0")}`,
      )
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm transition-opacity duration-500 hover:opacity-100 group"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Page scroll progress"
    >
      {/* Timecode */}
      <div className="font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">
        {timecode}
      </div>

      {/* Scrubber track */}
      <div className="w-32 sm:w-48 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white rounded-full"
          style={{ width: `${progress * 100}%` }}
          aria-hidden="true"
        />
      </div>

      {/* In/Out markers */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <div className="w-1 h-3 border-l border-t border-b border-black dark:border-white opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="w-1 h-3 border-r border-t border-b border-black dark:border-white opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

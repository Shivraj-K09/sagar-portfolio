"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadButtonProps {
  videoId: string
  size: string
  label: string
}

export function DownloadButton({ videoId, size, label }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Get the thumbnail URL
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${size}.jpg`

      // Fetch the image
      const response = await fetch(thumbnailUrl)
      const blob = await response.blob()

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `youtube-thumbnail-${videoId}-${size}.jpg`

      // Trigger the download
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading thumbnail:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading} className="mt-2">
      <Download className="h-4 w-4 mr-2" />
      {downloading ? "Downloading..." : `Download ${label}`}
    </Button>
  )
}

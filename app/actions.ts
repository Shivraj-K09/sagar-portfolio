"use server"

// This is a server action to fetch video details from the YouTube API
export async function fetchVideoDetails(videoId: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY

  if (!API_KEY) {
    throw new Error("YouTube API key is not configured")
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found. Please check the video ID and try again.")
    }

    const videoDetails = data.items[0].snippet
    const videoStats = data.items[0].statistics || { viewCount: "0", likeCount: "0" }

    return {
      id: videoId,
      title: videoDetails.title,
      description: videoDetails.description,
      channelTitle: videoDetails.channelTitle,
      publishedAt: videoDetails.publishedAt,
      thumbnails: videoDetails.thumbnails,
      statistics: {
        viewCount: Number.parseInt(videoStats.viewCount || "0", 10),
        likeCount: Number.parseInt(videoStats.likeCount || "0", 10),
      },
    }
  } catch (error) {
    console.error("Error fetching video details:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch video details")
  }
}

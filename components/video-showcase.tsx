"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchVideoDetails } from "@/app/actions"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { VideoStats } from "@/components/video-stats"

// Helper function to extract video ID from YouTube URL
function extractVideoId(url) {
  // Handle regular YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[2].length === 11) {
    return match[2]
  }

  // Handle YouTube Shorts URLs
  const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/
  const shortsMatch = url.match(shortsRegExp)

  if (shortsMatch && shortsMatch[2].length === 11) {
    return shortsMatch[2]
  }

  return null
}

// Updated portfolio projects with the provided YouTube videos
const PORTFOLIO_PROJECTS = [
  {
    id: extractVideoId("https://www.youtube.com/watch?v=r-_40oLqawY"),
    title: "Video Project 1",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=UeNa1cJhO5s"),
    title: "Video Project 2",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=5KvmYGkMIvM"),
    title: "Video Project 3",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=HfUTAtIy0MA"),
    title: "Video Project 4",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=90nd1uhdrM4"),
    title: "Video Project 5",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=eTmvtdsHb8w"),
    title: "Video Project 6",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KgPq-v7TjYI"),
    title: "Short Video 1",
    category: "Short",
    year: "2023",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KGqmHB-7fFc"),
    title: "Short Video 2",
    category: "Short",
    year: "2023",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/FBmjQ6fNpas"),
    title: "Short Video 3",
    category: "Short",
    year: "2023",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/_VMyiirPCtU"),
    title: "Short Video 4",
    category: "Short",
    year: "2023",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=PjDgNbg1RtM"),
    title: "Short Video 5",
    category: "Short",
    year: "2023",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=G62QsMn1sG8"),
    title: "Video Project 7",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=0xE_PmWqqu0"),
    title: "Video Project 8",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-W3dWXB3H_U"),
    title: "Video Project 9",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=RyOZv_eVLw4"),
    title: "Video Project 10",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=wvEVQB6r5Tg"),
    title: "Video Project 11",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-vEtFnyz4wU"),
    title: "Video Project 12",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  // Adding the two new videos
  {
    id: extractVideoId("https://www.youtube.com/watch?v=ZxKPSctpi0E"),
    title: "What if Palpatine Defeated Mace Windu Before Anakin Arrived",
    category: "Video",
    year: "2023",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=lveGVl5S06k"),
    title: "What If R2-D2 Was Reprogrammed with HK-47's Assassin Protocols",
    category: "Video",
    year: "2023",
    isShort: false,
  },
]

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

interface VideoProject {
  id: string
  title: string
  category: string
  year: string
  isShort?: boolean
  thumbnailUrl?: string
  statistics?: {
    viewCount: number
    likeCount: number
  }
}

export function VideoShowcase() {
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)
  const [totalStats, setTotalStats] = useState({
    views: 0,
    likes: 0,
  })
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)

  useEffect(() => {
    // Shuffle the projects initially
    const shuffledProjects = shuffleArray(PORTFOLIO_PROJECTS)

    const fetchThumbnails = async () => {
      try {
        const updatedProjects = await Promise.all(
          shuffledProjects.map(async (project) => {
            try {
              const details = await fetchVideoDetails(project.id)
              return {
                ...project,
                title: details.title || project.title,
                thumbnailUrl:
                  details.thumbnails?.maxres?.url ||
                  details.thumbnails?.high?.url ||
                  `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
                statistics: details.statistics,
              }
            } catch (error) {
              console.error(`Error fetching details for ${project.id}:`, error)
              return {
                ...project,
                thumbnailUrl: `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
                statistics: { viewCount: 0, likeCount: 0 },
              }
            }
          }),
        )

        // Calculate total views and likes
        const totalViews = updatedProjects.reduce((sum, project) => sum + (project.statistics?.viewCount || 0), 0)
        const totalLikes = updatedProjects.reduce((sum, project) => sum + (project.statistics?.likeCount || 0), 0)

        setTotalStats({
          views: totalViews,
          likes: totalLikes,
        })

        setProjects(updatedProjects)
      } catch (error) {
        console.error("Error fetching project details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchThumbnails()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (autoScroll && !isDragging && !loading) {
      interval = setInterval(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft += 2

          // Reset to beginning when reaching end
          if (
            carouselRef.current.scrollLeft >=
            carouselRef.current.scrollWidth - carouselRef.current.offsetWidth - 10
          ) {
            carouselRef.current.scrollLeft = 0
          }
        }
      }, 15)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoScroll, isDragging, loading])

  // Create duplicated projects for infinite effect
  const duplicatedProjects = [...projects, ...projects, ...projects]

  // Mouse event handlers for drag scrolling
  function handleMouseDown(event) {
    setIsDragging(true)
    setAutoScroll(false)

    if (carouselRef.current) {
      setStartX(event.pageX - carouselRef.current.offsetLeft)
      setScrollLeftPos(carouselRef.current.scrollLeft)
    }
  }

  function handleMouseUp() {
    setIsDragging(false)
    setAutoScroll(true)
  }

  function handleMouseLeave() {
    if (isDragging) {
      setIsDragging(false)
      setAutoScroll(true)
    }
  }

  function handleMouseMove(event) {
    if (!isDragging) return

    event.preventDefault()

    if (carouselRef.current) {
      const x = event.pageX - carouselRef.current.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      carouselRef.current.scrollLeft = scrollLeftPos - walk
    }
  }

  // Arrow navigation functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = 600 // Adjust this value to control scroll distance
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = 600 // Adjust this value to control scroll distance
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Keyboard navigation for the carousel
  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setCurrentFocusIndex((index + 1) % duplicatedProjects.length)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setCurrentFocusIndex((index - 1 + duplicatedProjects.length) % duplicatedProjects.length)
    }
  }

  return (
    <>
      <section id="work" className="py-16 bg-black overflow-hidden" aria-labelledby="work-heading">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="mb-10">
            <div>
              <h2 id="work-heading" className="text-2xl font-normal mb-2 text-white">
                Selected Work
              </h2>
              <div className="h-px w-16 bg-neutral-700" aria-hidden="true"></div>
            </div>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-hidden" aria-label="Loading videos...">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[500px] h-[350px] bg-neutral-800 animate-pulse" aria-hidden="true"></div>
              ))}
            </div>
          ) : (
            <div
              className="overflow-hidden relative"
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
              aria-roledescription="carousel"
              aria-label="Video showcase carousel"
            >
              {/* Left Arrow - Increased size */}
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-4 backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 shadow-lg"
                aria-label="Previous videos"
              >
                <ChevronLeft size={36} aria-hidden="true" />
              </button>

              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing px-16"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                role="region"
                aria-live="polite"
              >
                {duplicatedProjects.map((project, index) => (
                  <div
                    key={`${project.id}-${index}`}
                    className={`relative flex-shrink-0 overflow-hidden ${
                      project.isShort
                        ? "min-w-[197px] h-[350px]" // Vertical aspect ratio (9:16)
                        : "min-w-[500px] h-[350px]" // Horizontal aspect ratio (16:9)
                    } border border-neutral-700 rounded-sm transition-all duration-300 group-hover:border-neutral-500`}
                    onMouseEnter={() => setHoveredVideo(project.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    tabIndex={0}
                    onFocus={() => setCurrentFocusIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    <Link
                      href={`https://www.youtube.com/watch?v=${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full group"
                      aria-label={`Watch ${project.title}`}
                    >
                      <div className="relative h-full overflow-hidden bg-neutral-900">
                        {hoveredVideo === project.id ? (
                          // Custom video player when hovered
                          <div className="h-full w-full relative">
                            {/* Custom video player with CSS overlay to hide YouTube UI */}
                            <div className="absolute inset-0 w-full h-full youtube-embed-container">
                              <div className="relative w-full h-full overflow-hidden">
                                <iframe
                                  src={`https://www.youtube.com/embed/${project.id}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${project.id}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
                                  title={project.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  className="absolute inset-0 w-[300%] h-[300%] left-[-100%] top-[-100%]"
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  frameBorder="0"
                                  aria-hidden="true" // Hide from screen readers since it's just visual
                                ></iframe>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Thumbnail image when not hovered
                          <div className="h-full w-full relative transition-transform duration-700 ease-out group-hover:scale-105">
                            <Image
                              src={
                                project.thumbnailUrl ||
                                `/placeholder.svg?height=720&width=${project.isShort ? "405" : "1280"}&query=minimal video ${project.isShort ? "short" : "editing"}`
                              }
                              alt={`Thumbnail for ${project.title}`}
                              fill
                              className="object-cover transition-all duration-700 ease-out"
                              priority={index < 5} // Prioritize loading the first few images
                            />
                          </div>
                        )}

                        {/* Background overlay with gradient for title readability */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                          aria-hidden="true"
                        ></div>

                        {/* Play button (only show when not playing) */}
                        {hoveredVideo !== project.id && (
                          <div
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-75 group-hover:scale-100">
                              <Play className="h-7 w-7 text-black ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Video title */}
                        <div className="absolute bottom-0 left-0 p-4 w-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                          <h3 className="text-white text-sm font-medium line-clamp-2">{project.title}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Right Arrow - Increased size */}
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-4 backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 shadow-lg"
                aria-label="Next videos"
              >
                <ChevronRight size={36} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video Stats Section */}
      {!loading && (
        <VideoStats
          totalViews={totalStats.views}
          totalLikes={totalStats.likes}
          totalVideos={PORTFOLIO_PROJECTS.length}
        />
      )}
    </>
  )
}

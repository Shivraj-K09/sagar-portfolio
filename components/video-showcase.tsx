"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchVideoDetails } from "@/app/actions";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoStats } from "@/components/video-stats";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: any) {
  // Handle regular YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  // Handle YouTube Shorts URLs
  const shortsRegExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
  const shortsMatch = url.match(shortsRegExp);

  if (shortsMatch && shortsMatch[2].length === 11) {
    return shortsMatch[2];
  }

  return null;
}

// Updated portfolio projects with the provided YouTube videos
const PORTFOLIO_PROJECTS = [
  {
    id: extractVideoId("https://www.youtube.com/watch?v=r-_40oLqawY"),
    title: "Video Project 1",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=UeNa1cJhO5s"),
    title: "Video Project 2",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=5KvmYGkMIvM"),
    title: "Video Project 3",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=HfUTAtIy0MA"),
    title: "Video Project 4",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=90nd1uhdrM4"),
    title: "Video Project 5",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=eTmvtdsHb8w"),
    title: "Video Project 6",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KgPq-v7TjYI"),
    title: "Short Video 1",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/KGqmHB-7fFc"),
    title: "Short Video 2",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/FBmjQ6fNpas"),
    title: "Short Video 3",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/shorts/_VMyiirPCtU"),
    title: "Short Video 4",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=PjDgNbg1RtM"),
    title: "Short Video 5",
    category: "Short",
    isShort: true,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=G62QsMn1sG8"),
    title: "Video Project 7",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=0xE_PmWqqu0"),
    title: "Video Project 8",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-W3dWXB3H_U"),
    title: "Video Project 9",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=RyOZv_eVLw4"),
    title: "Video Project 10",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=wvEVQB6r5Tg"),
    title: "Video Project 11",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=-vEtFnyz4wU"),
    title: "Video Project 12",
    category: "Video",
    isShort: false,
  },
  // Adding the two new videos
  {
    id: extractVideoId("https://www.youtube.com/watch?v=ZxKPSctpi0E"),
    title: "What if Palpatine Defeated Mace Windu Before Anakin Arrived",
    category: "Video",
    isShort: false,
  },
  {
    id: extractVideoId("https://www.youtube.com/watch?v=lveGVl5S06k"),
    title: "What If R2-D2 Was Reprogrammed with HK-47's Assassin Protocols",
    category: "Video",
    isShort: false,
  },

  {
    id: extractVideoId("https://www.youtube.com/watch?v=kU0ZwzQlSFk"),
    title: "What if Padme JOINED Anakin on Mustafar",
    category: "Video",
    isShort: false,
  },
];

// Pre-define thumbnail URLs to avoid API calls
const THUMBNAIL_URLS = {
  "r-_40oLqawY": "https://img.youtube.com/vi/r-_40oLqawY/hqdefault.jpg",
  UeNa1cJhO5s: "https://img.youtube.com/vi/UeNa1cJhO5s/hqdefault.jpg",
  "5KvmYGkMIvM": "https://img.youtube.com/vi/5KvmYGkMIvM/hqdefault.jpg",
  HfUTAtIy0MA: "https://img.youtube.com/vi/HfUTAtIy0MA/hqdefault.jpg",
  "90nd1uhdrM4": "https://img.youtube.com/vi/90nd1uhdrM4/hqdefault.jpg",
  eTmvtdsHb8w: "https://img.youtube.com/vi/eTmvtdsHb8w/hqdefault.jpg",
  "KgPq-v7TjYI": "https://img.youtube.com/vi/KgPq-v7TjYI/hqdefault.jpg",
  "KGqmHB-7fFc": "https://img.youtube.com/vi/KGqmHB-7fFc/hqdefault.jpg",
  FBmjQ6fNpas: "https://img.youtube.com/vi/FBmjQ6fNpas/hqdefault.jpg",
  _VMyiirPCtU: "https://img.youtube.com/vi/_VMyiirPCtU/hqdefault.jpg",
  PjDgNbg1RtM: "https://img.youtube.com/vi/PjDgNbg1RtM/hqdefault.jpg",
  G62QsMn1sG8: "https://img.youtube.com/vi/G62QsMn1sG8/hqdefault.jpg",
  "0xE_PmWqqu0": "https://img.youtube.com/vi/0xE_PmWqqu0/hqdefault.jpg",
  "-W3dWXB3H_U": "https://img.youtube.com/vi/-W3dWXB3H_U/hqdefault.jpg",
  RyOZv_eVLw4: "https://img.youtube.com/vi/RyOZv_eVLw4/hqdefault.jpg",
  wvEVQB6r5Tg: "https://img.youtube.com/vi/wvEVQB6r5Tg/hqdefault.jpg",
  "-vEtFnyz4wU": "https://img.youtube.com/vi/-vEtFnyz4wU/hqdefault.jpg",
  ZxKPSctpi0E: "https://img.youtube.com/vi/ZxKPSctpi0E/hqdefault.jpg",
  lveGVl5S06k: "https://img.youtube.com/vi/lveGVl5S06k/hqdefault.jpg",
  kU0ZwzQlSFk: "https://img.youtube.com/vi/kU0ZwzQlSFk/hqdefault.jpg",
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface VideoProject {
  id: string;
  title: string;
  category: string;
  year?: string;
  isShort?: boolean;
  thumbnailUrl?: string;
  statistics?: {
    viewCount: number;
    likeCount: number;
  };
}

// Preload a subset of videos initially
const INITIAL_VISIBLE_VIDEOS = 6;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export function VideoShowcase() {
  const isMobile = useMobile();
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [totalStats, setTotalStats] = useState({
    views: 0,
    likes: 0,
  });
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [apiDataLoaded, setApiDataLoaded] = useState(false);

  // Initialize with static thumbnails immediately
  useEffect(() => {
    const shuffledProjects = shuffleArray(PORTFOLIO_PROJECTS);

    // Create initial projects with static thumbnails
    const initialProjects = shuffledProjects.map((project) => ({
      ...project,
      thumbnailUrl:
        THUMBNAIL_URLS[project.id as keyof typeof THUMBNAIL_URLS] ||
        `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
      statistics: { viewCount: 0, likeCount: 0 },
    }));

    setProjects(initialProjects);
    setVisibleProjects(initialProjects.slice(0, INITIAL_VISIBLE_VIDEOS));
    setLoading(false);

    // Then fetch API data in the background
    fetchApiData(initialProjects);
  }, []);

  // Fetch API data in the background
  const fetchApiData = async (initialProjects: VideoProject[]) => {
    try {
      // Only fetch first 8 videos' details to improve performance
      const projectsToFetch = initialProjects.slice(0, 8);

      const updatedProjects = await Promise.all(
        projectsToFetch.map(async (project) => {
          try {
            const details = await fetchVideoDetails(project.id);
            return {
              ...project,
              title: details.title || project.title,
              thumbnailUrl:
                details.thumbnails?.maxres?.url ||
                details.thumbnails?.high?.url ||
                project.thumbnailUrl,
              statistics: details.statistics,
            };
          } catch (error) {
            console.error(`Error fetching details for ${project.id}:`, error);
            return project;
          }
        })
      );

      // Merge updated projects with the rest
      const mergedProjects = [...initialProjects];
      updatedProjects.forEach((updatedProject, index) => {
        const projectIndex = initialProjects.findIndex(
          (p) => p.id === updatedProject.id
        );
        if (projectIndex !== -1) {
          mergedProjects[projectIndex] = updatedProject;
        }
      });

      // Calculate total views and likes
      const totalViews = mergedProjects.reduce(
        (sum, project) => sum + (project.statistics?.viewCount || 0),
        0
      );
      const totalLikes = mergedProjects.reduce(
        (sum, project) => sum + (project.statistics?.likeCount || 0),
        0
      );

      setTotalStats({
        views: totalViews,
        likes: totalLikes,
      });

      setProjects(mergedProjects);
      setVisibleProjects(mergedProjects.slice(0, INITIAL_VISIBLE_VIDEOS));
      setApiDataLoaded(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Load more videos as user scrolls
  const loadMoreVideos = useCallback(() => {
    if (visibleProjects.length < projects.length) {
      const nextBatch = projects.slice(
        visibleProjects.length,
        visibleProjects.length + 3
      );
      setVisibleProjects((prev) => [...prev, ...nextBatch]);
    }
  }, [visibleProjects.length, projects]);

  // Auto-scroll functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (autoScroll && !isDragging && !loading) {
      interval = setInterval(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft += 2;

          // Load more videos when approaching the end
          if (
            carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >
            carouselRef.current.scrollWidth - 500
          ) {
            loadMoreVideos();
          }

          // Reset to beginning when reaching end
          if (
            carouselRef.current.scrollLeft >=
            carouselRef.current.scrollWidth -
              carouselRef.current.offsetWidth -
              10
          ) {
            carouselRef.current.scrollLeft = 0;
          }
        }
      }, 15);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoScroll, isDragging, loading, loadMoreVideos]);

  // Mouse event handlers for drag scrolling
  function handleMouseDown(event: any) {
    setIsDragging(true);
    setAutoScroll(false);

    if (carouselRef.current) {
      setStartX(event.pageX - carouselRef.current.offsetLeft);
      setScrollLeftPos(carouselRef.current.scrollLeft);
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
    setAutoScroll(true);
  }

  function handleMouseLeave() {
    if (isDragging) {
      setIsDragging(false);
      setAutoScroll(true);
    }
  }

  function handleMouseMove(event: any) {
    if (!isDragging) return;

    event.preventDefault();

    if (carouselRef.current) {
      const x = event.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      carouselRef.current.scrollLeft = scrollLeftPos - walk;

      // Load more videos when dragging near the end
      if (
        carouselRef.current.scrollLeft + carouselRef.current.offsetWidth >
        carouselRef.current.scrollWidth - 500
      ) {
        loadMoreVideos();
      }
    }
  }

  // Arrow navigation functions
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = 600; // Adjust this value to control scroll distance
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = 600; // Adjust this value to control scroll distance
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Load more videos when scrolling right
      if (
        carouselRef.current.scrollLeft +
          carouselRef.current.offsetWidth +
          scrollAmount >
        carouselRef.current.scrollWidth - 500
      ) {
        loadMoreVideos();
      }
    }
  };

  // Keyboard navigation for the carousel
  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentFocusIndex((index + 1) % visibleProjects.length);
      e.preventDefault();
      setCurrentFocusIndex((index + 1) % visibleProjects.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCurrentFocusIndex(
        (index - 1 + visibleProjects.length) % visibleProjects.length
      );
    }
  };

  const handleVideoInteraction = (projectId: string) => {
    if (!isMobile) {
      // On desktop, toggle hover state
      setHoveredVideo(hoveredVideo === projectId ? null : projectId);
    }
    // On mobile, do nothing here as the Link will handle the click directly
  };

  return (
    <>
      <motion.section
        id="work"
        className="py-16 bg-black overflow-hidden"
        aria-labelledby="work-heading"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div className="mb-10" variants={itemVariants}>
            <div>
              <h2
                id="work-heading"
                className="text-2xl font-normal mb-2 text-white"
              >
                Selected Work
              </h2>
              <div
                className="h-px w-16 bg-neutral-700"
                aria-hidden="true"
              ></div>
            </div>
          </motion.div>

          {loading ? (
            <div
              className="flex gap-3 overflow-hidden"
              aria-label="Loading videos..."
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="min-w-[500px] h-[350px] bg-neutral-800 animate-pulse"
                  aria-hidden="true"
                  variants={itemVariants}
                ></motion.div>
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
              <motion.button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full md:p-4 p-1 backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 shadow-lg"
                aria-label="Previous videos"
                variants={itemVariants}
              >
                <ChevronLeft size={36} aria-hidden="true" />
              </motion.button>

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
                {visibleProjects.map((project, index) => (
                  <motion.div
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
                    variants={itemVariants}
                  >
                    <Link
                      href={`https://www.youtube.com/watch?v=${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full group"
                      aria-label={`Watch ${project.title}`}
                      onClick={(e) => {
                        if (!isMobile && hoveredVideo === project.id) {
                          // If on desktop and video is already playing, allow the link to work
                          return true;
                        } else if (!isMobile) {
                          // If on desktop and video is not playing, prevent navigation and show preview
                          e.preventDefault();
                          setHoveredVideo(project.id);
                        }
                        // On mobile, let the link work normally (direct to YouTube)
                      }}
                    >
                      <div className="relative h-full overflow-hidden bg-neutral-900">
                        {!isMobile && hoveredVideo === project.id ? ( // Custom video player when hovered
                          <div className="h-full w-full relative">
                            {/* Custom video player with CSS overlay to hide YouTube UI */}
                            <div className="absolute inset-0 w-full h-full youtube-embed-container">
                              <div className="relative w-full h-full overflow-hidden">
                                <iframe
                                  src={`https://www.youtube.com/embed/${
                                    project.id
                                  }?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${
                                    project.id
                                  }&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&origin=${
                                    typeof window !== "undefined"
                                      ? window.location.origin
                                      : ""
                                  }`}
                                  title={project.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  className="absolute inset-0 w-[300%] h-[300%] left-[-100%] top-[-100%]"
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  frameBorder="0"
                                  aria-hidden="true" // Hide from screen readers since it's just visual
                                  loading="lazy"
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
                                `/placeholder.svg?height=720&width=${
                                  project.isShort ? "405" : "1280"
                                }&query=minimal video ${
                                  project.isShort ? "short" : "editing"
                                }`
                              }
                              alt={`Thumbnail for ${project.title}`}
                              fill
                              className="object-cover transition-all duration-700 ease-out"
                              priority={index < 3} // Prioritize loading only the first few images
                              sizes={
                                project.isShort
                                  ? "(max-width: 768px) 197px, 197px"
                                  : "(max-width: 768px) 100vw, 500px"
                              }
                              loading={index < 3 ? "eager" : "lazy"}
                            />
                          </div>
                        )}

                        {/* Background overlay with gradient for title readability */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                          aria-hidden="true"
                        ></div>

                        {/* Play button (only show when not playing) */}
                        {!isMobile && hoveredVideo !== project.id && (
                          <div
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform scale-75 group-hover:scale-100">
                              <Play className="h-7 w-7 text-black ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Mobile-specific play button (always visible) */}
                        {isMobile && (
                          <div
                            className="absolute inset-0 bg-black/10 flex items-center justify-center"
                            aria-hidden="true"
                          >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="h-7 w-7 text-black ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Video title */}
                        <div
                          className={`absolute bottom-0 left-0 p-4 w-full ${
                            isMobile
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          } transform ${
                            isMobile
                              ? "translate-y-0"
                              : "translate-y-2 group-hover:translate-y-0"
                          } transition-all duration-500 ease-out`}
                        >
                          <h3 className="text-white text-sm font-medium line-clamp-2">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Right Arrow - Increased size */}
              <motion.button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full md:p-4 p-1 backdrop-blur-sm transition-all duration-200 opacity-70 hover:opacity-100 shadow-lg"
                aria-label="Next videos"
                variants={itemVariants}
              >
                <ChevronRight size={36} aria-hidden="true" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>

      {/* Video Stats Section - Always show with skeleton loader until data is loaded */}
      <VideoStats
        totalViews={totalStats.views}
        totalLikes={totalStats.likes}
        totalVideos={PORTFOLIO_PROJECTS.length}
        loading={!apiDataLoaded}
      />
    </>
  );
}

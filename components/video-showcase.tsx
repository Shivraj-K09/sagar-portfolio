"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBatchVideoDetails } from "@/app/actions";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoStats } from "@/components/video-stats";
import { WorkTabs } from "@/components/work-tabs";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";
import {
  PORTFOLIO_PROJECTS,
  VideoProject,
  shuffleArray,
  SHORTS_PRIORITY_IDS,
  LONG_VIDEOS_PRIORITY_IDS,
} from "@/data/videos";
import { THUMBNAIL_URLS } from "@/data/thumbnails";

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
      type: "spring" as const,
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
  const [isFetching, setIsFetching] = useState(false);
  const TABS = ["Shorts", "Long Videos", "Podcast"] as const;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = TABS[activeTabIndex];

  // Persist scroll position per tab
  const tabStateRef = useRef<Record<string, { scrollLeft: number }>>({});

  // Store shuffled order per tab - only shuffle once per page load, then keep same order
  const tabOrderRef = useRef<Record<string, string[]>>({});

  const sortByStoredOrder = (items: VideoProject[], order: string[]) => {
    const orderMap = new Map(order.map((id, i) => [id, i]));
    return [...items].sort((a, b) => {
      const aIdx = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
      const bIdx = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
      return aIdx - bIdx;
    });
  };

  // Filter and shuffle projects by active tab - shuffle only on first load, priority always first
  const filteredProjects = useMemo(() => {
    switch (activeTab) {
      case "Shorts": {
        const shorts = projects.filter((p) => p.isShort === true);
        const priority = SHORTS_PRIORITY_IDS.map((id) =>
          shorts.find((p) => p.id === id),
        ).filter(Boolean) as VideoProject[];
        const rest = shorts.filter(
          (p) =>
            !SHORTS_PRIORITY_IDS.includes(
              p.id as (typeof SHORTS_PRIORITY_IDS)[number],
            ),
        );
        if (rest.length === 0) return priority;
        if (!tabOrderRef.current["Shorts"]?.length) {
          const shuffled = shuffleArray(rest);
          tabOrderRef.current["Shorts"] = shuffled.map((p) => p.id);
          return [...priority, ...shuffled];
        }
        return [
          ...priority,
          ...sortByStoredOrder(rest, tabOrderRef.current["Shorts"]),
        ];
      }
      case "Long Videos": {
        const longVideos = projects.filter(
          (p) => p.isShort === false && !p.isPodcast,
        );
        const priority = LONG_VIDEOS_PRIORITY_IDS.map((id) =>
          longVideos.find((p) => p.id === id),
        ).filter(Boolean) as VideoProject[];
        const rest = longVideos.filter(
          (p) =>
            !LONG_VIDEOS_PRIORITY_IDS.includes(
              p.id as (typeof LONG_VIDEOS_PRIORITY_IDS)[number],
            ),
        );
        if (rest.length === 0) return priority;
        if (!tabOrderRef.current["Long Videos"]?.length) {
          const shuffled = shuffleArray(rest);
          tabOrderRef.current["Long Videos"] = shuffled.map((p) => p.id);
          return [...priority, ...shuffled];
        }
        return [
          ...priority,
          ...sortByStoredOrder(rest, tabOrderRef.current["Long Videos"]),
        ];
      }
      case "Podcast": {
        const podcasts = projects.filter((p) => p.isPodcast === true);
        if (podcasts.length === 0) return [];
        if (!tabOrderRef.current["Podcast"]?.length) {
          const shuffled = shuffleArray(podcasts);
          tabOrderRef.current["Podcast"] = shuffled.map((p) => p.id);
          return shuffled;
        }
        return sortByStoredOrder(podcasts, tabOrderRef.current["Podcast"]);
      }
      default:
        return projects;
    }
  }, [projects, activeTab]);

  // Save current tab state before switching, restore when switching to a tab
  const handleTabChange = useCallback(
    (newIndex: number) => {
      const currentTab = TABS[activeTabIndex];
      tabStateRef.current[currentTab] = {
        scrollLeft: carouselRef.current?.scrollLeft ?? 0,
      };
      setActiveTabIndex(newIndex);
    },
    [activeTabIndex],
  );

  // Show all filtered projects for current tab (no lazy batching - needed for seamless loop)
  useEffect(() => {
    const savedState = tabStateRef.current[activeTab];
    setVisibleProjects(filteredProjects);
    if (savedState) {
      requestAnimationFrame(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft = savedState.scrollLeft;
        }
      });
    } else if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [activeTab, filteredProjects]);

  // Initialize with static thumbnails immediately
  useEffect(() => {
    // Reverse the array to show latest videos first (from end to beginning)
    // Filter out projects with invalid/missing video IDs
    const reversedProjects = [...PORTFOLIO_PROJECTS]
      .filter((p) => p.id)
      .reverse();

    // Create initial projects with static thumbnails
    const initialProjects = reversedProjects.map((project) => ({
      ...project,
      thumbnailUrl:
        THUMBNAIL_URLS[project.id as keyof typeof THUMBNAIL_URLS] ||
        `https://img.youtube.com/vi/${project.id}/hqdefault.jpg`,
      statistics: { viewCount: 0, likeCount: 0 },
    })) as VideoProject[];

    setProjects(initialProjects);
    setLoading(false);

    // Load cached stats immediately if available
    const cachedStats = localStorage.getItem("videoStats");
    if (cachedStats) {
      try {
        const { stats, timestamp } = JSON.parse(cachedStats);
        // Only use cache if it's less than 5 minutes old
        if (Date.now() - timestamp < 300000) {
          setTotalStats(stats);
        }
      } catch (error) {
        console.error("Error parsing cached stats:", error);
      }
    }

    // Then fetch API data in the background
    fetchApiData(initialProjects);
  }, []);

  // Fetch API data in the background using batch requests
  const fetchApiData = async (initialProjects: VideoProject[]) => {
    // Prevent multiple simultaneous requests
    if (isFetching) return;
    setIsFetching(true);

    try {
      // Check if we have recent cached data (less than 1 hour old)
      const cachedData = localStorage.getItem("videoApiData");
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          // Use cache if it's less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            const updatedProjects: VideoProject[] = initialProjects.map(
              (project) => {
                const cachedProject = data.find(
                  (d: { id: string }) => d.id === project.id,
                );
                return {
                  ...project,
                  title: cachedProject?.title || project.title,
                  thumbnailUrl:
                    cachedProject?.thumbnails?.maxres?.url ||
                    cachedProject?.thumbnails?.high?.url ||
                    project.thumbnailUrl,
                  statistics: cachedProject?.statistics || {
                    viewCount: 0,
                    likeCount: 0,
                  },
                } as VideoProject;
              },
            );

            // Calculate and update stats
            const totalViews = updatedProjects.reduce(
              (sum, project) => sum + (project.statistics?.viewCount || 0),
              0,
            );
            const totalLikes = updatedProjects.reduce(
              (sum, project) => sum + (project.statistics?.likeCount || 0),
              0,
            );

            setTotalStats({ views: totalViews, likes: totalLikes });
            setProjects(updatedProjects);
            setVisibleProjects(
              updatedProjects.slice(0, INITIAL_VISIBLE_VIDEOS),
            );
            setApiDataLoaded(true);
            setIsFetching(false);
            return;
          }
        } catch (error) {
          console.error("Error parsing cached API data:", error);
        }
      }

      // Extract all video IDs for batch request
      const videoIds = initialProjects
        .map((project) => project.id)
        .filter(Boolean);

      // Fetch all video details in a single batch request
      const batchDetails = await fetchBatchVideoDetails(videoIds);

      // Create a map for quick lookup
      const detailsMap = new Map(
        batchDetails.map((detail) => [detail.id, detail]),
      );

      // Update projects with fetched data
      const updatedProjects: VideoProject[] = initialProjects.map((project) => {
        const details = detailsMap.get(project.id);
        return {
          ...project,
          title: details?.title || project.title,
          thumbnailUrl:
            details?.thumbnails?.maxres?.url ||
            details?.thumbnails?.high?.url ||
            project.thumbnailUrl,
          statistics: details?.statistics || { viewCount: 0, likeCount: 0 },
        } as VideoProject;
      });

      // Calculate total views and likes
      const totalViews = updatedProjects.reduce(
        (sum, project) => sum + (project.statistics?.viewCount || 0),
        0,
      );
      const totalLikes = updatedProjects.reduce(
        (sum, project) => sum + (project.statistics?.likeCount || 0),
        0,
      );

      // Update stats
      const newStats = { views: totalViews, likes: totalLikes };
      setTotalStats(newStats);

      // Cache the API data for 1 hour
      localStorage.setItem(
        "videoApiData",
        JSON.stringify({
          data: batchDetails,
          timestamp: Date.now(),
        }),
      );

      // Cache the stats separately
      localStorage.setItem(
        "videoStats",
        JSON.stringify({
          stats: newStats,
          timestamp: Date.now(),
        }),
      );

      setProjects(updatedProjects);
      setVisibleProjects(updatedProjects.slice(0, INITIAL_VISIBLE_VIDEOS));
      setApiDataLoaded(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Measure the first set of items for seamless loop reset
  const firstSetRef = useRef<HTMLDivElement>(null);
  const singleSetWidthRef = useRef(0);

  useEffect(() => {
    const el = firstSetRef.current;
    if (!el) return;
    const measure = () => {
      singleSetWidthRef.current = el.offsetWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visibleProjects]);

  // Seamless loop: reset scroll using measured first-set width
  const checkAndResetScroll = useCallback(() => {
    const el = carouselRef.current;
    const setWidth = singleSetWidthRef.current;
    if (!el || setWidth <= 0) return;

    // gap-3 = 12px between the two sets
    const resetPoint = setWidth + 12;
    if (el.scrollLeft >= resetPoint) {
      el.scrollLeft -= resetPoint;
    }
  }, []);

  // Auto-scroll with requestAnimationFrame for smoothness
  useEffect(() => {
    let animId: number;
    let lastTime = 0;
    const speed = 2; // px per frame at 60fps — increase for faster, decrease for slower

    const step = (time: number) => {
      if (!autoScroll || isDragging || loading) {
        animId = requestAnimationFrame(step);
        lastTime = time;
        return;
      }

      if (lastTime) {
        const delta = time - lastTime;
        const px = speed * (delta / 16.67); // Normalize to ~60fps
        if (carouselRef.current) {
          carouselRef.current.scrollLeft += px;
          checkAndResetScroll();
        }
      }

      lastTime = time;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [autoScroll, isDragging, loading, checkAndResetScroll]);

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
        (index - 1 + visibleProjects.length) % visibleProjects.length,
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
        initial={false}
        animate="visible"
        variants={containerVariants}
      >
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <motion.div className="mb-10" variants={itemVariants}>
            {/* <div>
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
            </div> */}
            <WorkTabs
              tabs={[...TABS]}
              activeIndex={activeTabIndex}
              onTabChange={handleTabChange}
              className="mt-6"
            />
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
                className="flex overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onScroll={checkAndResetScroll}
                role="region"
                aria-live="polite"
              >
                {/* Two identical sets for seamless infinite loop */}
                {[0, 1].map((setIdx) => (
                  <div
                    key={setIdx}
                    ref={setIdx === 0 ? firstSetRef : undefined}
                    className={`flex gap-3 shrink-0 ${setIdx === 0 ? "pl-16" : "ml-3 pr-16"}`}
                  >
                    {visibleProjects.map((project, index) => (
                      <motion.div
                        key={`${project.id}-s${setIdx}-${index}`}
                        initial={false}
                        className={`relative shrink-0 overflow-hidden ${
                          project.isShort
                            ? "min-w-[197px] h-[350px]" // Vertical aspect ratio (9:16)
                            : "min-w-[500px] h-[350px]" // Horizontal aspect ratio (16:9)
                        } border border-neutral-700 rounded-sm transition-all duration-300 group-hover:border-neutral-500`}
                        onMouseEnter={() => setHoveredVideo(project.id)}
                        onMouseLeave={() => setHoveredVideo(null)}
                        tabIndex={0}
                        onFocus={() =>
                          setCurrentFocusIndex(index % visibleProjects.length)
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, index % visibleProjects.length)
                        }
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
        loading={false} // Always show stats, even if API data is still loading
      />
    </>
  );
}

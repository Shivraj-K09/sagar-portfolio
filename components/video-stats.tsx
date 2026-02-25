"use client";

import { useState, useEffect } from "react";
import { Eye, ThumbsUp, Play } from "lucide-react";
import { motion } from "framer-motion";

interface VideoStatsProps {
  totalViews: number;
  totalLikes: number;
  totalVideos: number;
  loading?: boolean;
}

export function VideoStats({
  totalViews,
  totalLikes,
  totalVideos,
  loading = false,
}: VideoStatsProps) {
  const [animatedViews, setAnimatedViews] = useState(0);
  const [animatedLikes, setAnimatedLikes] = useState(0);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format large numbers with K, M, B suffixes
  const formatCompactNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  };

  // Start animation when component is visible in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animationStarted) {
          setAnimationStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    const statsSection = document.getElementById("stats-section");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, [animationStarted]);

  // Animate the counters only when visible
  useEffect(() => {
    if (!animationStarted || loading) return;

    const viewsDuration = 2000; // 2 seconds for the animation
    const likesDuration = 2000;
    const viewsInterval = 20; // Update every 20ms
    const likesInterval = 20;

    const viewsStep = totalViews / (viewsDuration / viewsInterval);
    const likesStep = totalLikes / (likesDuration / likesInterval);

    let viewsTimer: NodeJS.Timeout;
    let likesTimer: NodeJS.Timeout;

    const animateViews = () => {
      setAnimatedViews((prev) => {
        const next = prev + viewsStep;
        if (next >= totalViews) {
          clearInterval(viewsTimer);
          return totalViews;
        }
        return Math.floor(next);
      });
    };

    const animateLikes = () => {
      setAnimatedLikes((prev) => {
        const next = prev + likesStep;
        if (next >= totalLikes) {
          clearInterval(likesTimer);
          return totalLikes;
        }
        return Math.floor(next);
      });
    };

    viewsTimer = setInterval(animateViews, viewsInterval);
    likesTimer = setInterval(animateLikes, likesInterval);

    return () => {
      clearInterval(viewsTimer);
      clearInterval(likesTimer);
    };
  }, [totalViews, totalLikes, animationStarted, loading]);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <motion.section
      id="stats-section"
      className="relative py-24 bg-white dark:bg-black text-black dark:text-white"
      aria-labelledby="stats-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 dark:opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-black dark:bg-white blur-[120px]"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-black dark:bg-white blur-[100px]"></div>
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-5xl relative z-10">
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 id="stats-heading" className="text-3xl font-light mb-4">
            Cut to the Numbers
          </h2>
          <div
            className="h-px w-24 bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-600 to-transparent mx-auto"
            aria-hidden="true"
          ></div>
          <p className="mt-6 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            From rough cuts to real results — numbers from behind the timeline
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {/* Views Card */}
          <motion.div
            className="relative group"
            role="listitem"
            variants={itemVariants}
          >
            <div
              className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-2xl blur-sm transform group-hover:scale-105 transition-all duration-300"
              aria-hidden="true"
            ></div>
            <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl h-full transform transition-all duration-500 group-hover:translate-y-[-5px] group-hover:shadow-lg">
              <div
                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-full"
                aria-hidden="true"
              ></div>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full">
                  <Eye
                    size={32}
                    className="text-neutral-700 dark:text-neutral-300"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-3"></div>
                ) : (
                  <p className="text-4xl font-semibold mb-3" aria-live="polite">
                    <span aria-hidden="true">
                      {formatCompactNumber(animatedViews)}
                    </span>
                    <span className="sr-only">
                      {formatNumber(animatedViews)} total views
                    </span>
                  </p>
                )}
                <h3 className="text-xl font-light text-neutral-700 dark:text-neutral-300 text-center">
                  Total Views
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Likes Card */}
          <motion.div
            className="relative group"
            role="listitem"
            variants={itemVariants}
          >
            <div
              className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-2xl blur-sm transform group-hover:scale-105 transition-all duration-300"
              aria-hidden="true"
            ></div>
            <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl h-full transform transition-all duration-500 group-hover:translate-y-[-5px] group-hover:shadow-lg">
              <div
                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-full"
                aria-hidden="true"
              ></div>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full">
                  <ThumbsUp
                    size={32}
                    className="text-neutral-700 dark:text-neutral-300"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-3"></div>
                ) : (
                  <p className="text-4xl font-semibold mb-3" aria-live="polite">
                    <span aria-hidden="true">
                      {formatCompactNumber(animatedLikes)}
                    </span>
                    <span className="sr-only">
                      {formatNumber(animatedLikes)} total likes
                    </span>
                  </p>
                )}
                <h3 className="text-xl font-light text-neutral-700 dark:text-neutral-300 text-center">
                  Total Likes
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Videos Card */}
          <motion.div
            className="relative group"
            role="listitem"
            variants={itemVariants}
          >
            <div
              className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-2xl blur-sm transform group-hover:scale-105 transition-all duration-300"
              aria-hidden="true"
            ></div>
            <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl h-full transform transition-all duration-500 group-hover:translate-y-[-5px] group-hover:shadow-lg">
              <div
                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-full"
                aria-hidden="true"
              ></div>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full">
                  <Play
                    size={32}
                    className="text-neutral-700 dark:text-neutral-300"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="h-10 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse mb-3"></div>
                ) : (
                  <p className="text-4xl font-semibold mb-3">
                    <span aria-hidden="true">{totalVideos}+</span>
                    <span className="sr-only">{totalVideos} total videos</span>
                  </p>
                )}
                <h3 className="text-xl font-light text-neutral-700 dark:text-neutral-300 text-center">
                  Videos
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ClapIcon } from "./icons/clap-icon";
import { useState, useRef, useEffect } from "react";
import type { ClapIconHandle } from "./icons/clap-icon";
import { SocialIcons } from "./hero-section-social";
import { motion } from "framer-motion";

export function HeroSection() {
  const scrollToWork = () => {
    const workSection = document.getElementById("work");
    if (workSection) {
      workSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clapIconRef = useRef<ClapIconHandle>(null);
  const [isBlinking, setIsBlinking] = useState(true);

  // Blinking effect for the REC indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleVideoEditorHover = () => {
    clapIconRef.current?.startAnimation();
  };

  const handleVideoEditorLeave = () => {
    clapIconRef.current?.stopAnimation();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  return (
    <motion.section
      className="w-full min-h-[90vh] flex items-center justify-center py-20 md:py-0"
      aria-labelledby="hero-heading"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        <div className="relative flex flex-col items-center text-center gap-8 p-8 md:p-12">
          {/* REC indicator in top right corner */}
          <motion.div
            className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center z-10"
            aria-hidden="true"
            variants={itemVariants}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isBlinking ? "bg-red-600" : "bg-red-900"
              } mr-1.5`}
            ></div>
            <span className="text-xs font-medium text-red-600">REC</span>
          </motion.div>

          {/* Corner Borders - Top Left */}
          <motion.div
            className="absolute top-0 left-0 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
            aria-hidden="true"
            variants={itemVariants}
          >
            <div className="absolute top-0 left-0 w-[2px] h-[20px] md:h-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="absolute top-0 left-0 h-[2px] w-[20px] md:w-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
          </motion.div>

          {/* Corner Borders - Top Right */}
          <motion.div
            className="absolute top-0 right-0 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
            aria-hidden="true"
            variants={itemVariants}
          >
            <div className="absolute top-0 right-0 w-[2px] h-[20px] md:h-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="absolute top-0 right-0 h-[2px] w-[20px] md:w-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
          </motion.div>

          {/* Corner Borders - Bottom Left */}
          <motion.div
            className="absolute bottom-0 left-0 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
            aria-hidden="true"
            variants={itemVariants}
          >
            <div className="absolute bottom-0 left-0 w-[2px] h-[20px] md:h-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="absolute bottom-0 left-0 h-[2px] w-[20px] md:w-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
          </motion.div>

          {/* Corner Borders - Bottom Right */}
          <motion.div
            className="absolute bottom-0 right-0 w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
            aria-hidden="true"
            variants={itemVariants}
          >
            <div className="absolute bottom-0 right-0 w-[2px] h-[20px] md:h-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="absolute bottom-0 right-0 h-[2px] w-[20px] md:w-[30px] bg-neutral-300 dark:bg-neutral-700"></div>
          </motion.div>

          {/* Very subtle connecting lines with low opacity */}
          <div
            className="absolute top-0 left-[20px] md:left-[30px] right-[20px] md:right-[30px] h-[1px] bg-neutral-300/15 dark:bg-neutral-700/15"
            aria-hidden="true"
          ></div>
          <div
            className="absolute bottom-0 left-[20px] md:left-[30px] right-[20px] md:right-[30px] h-[1px] bg-neutral-300/15 dark:bg-neutral-700/15"
            aria-hidden="true"
          ></div>
          <div
            className="absolute left-0 top-[20px] md:top-[30px] bottom-[20px] md:bottom-[30px] w-[1px] bg-neutral-300/15 dark:bg-neutral-700/15"
            aria-hidden="true"
          ></div>
          <div
            className="absolute right-0 top-[20px] md:top-[30px] bottom-[20px] md:bottom-[30px] w-[1px] bg-neutral-300/15 dark:bg-neutral-700/15"
            aria-hidden="true"
          ></div>

          <motion.div
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wider text-neutral-500 dark:text-neutral-400 select-text cursor-pointer"
            onMouseEnter={handleVideoEditorHover}
            onMouseLeave={handleVideoEditorLeave}
            aria-hidden="true"
            variants={itemVariants}
          >
            <ClapIcon ref={clapIconRef} size={20} />
            VIDEO EDITOR
          </motion.div>

          <motion.h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight"
            variants={itemVariants}
          >
            Hi, I'm <span className="font-medium">Sagar Kadgond</span>
            <br className="hidden xs:block" />I craft compelling{" "}
            <span className="relative inline-block">
              <span className="relative z-10">visual</span>
              <div
                className="absolute bottom-1 left-0 w-full h-[10px] rounded-sm animate-underline"
                style={{
                  background:
                    "linear-gradient(135deg, #7928CA, #4361EE, #3F8EFC, #61DAFB, #FF9966, #FF0080)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                aria-hidden="true"
              ></div>
            </span>
            <br className="hidden xs:block" />
            stories through editing.
          </motion.h1>

          <motion.p
            className="max-w-[600px] text-neutral-600 dark:text-neutral-300 text-base sm:text-lg font-light px-4 sm:px-0"
            variants={itemVariants}
          >
            Based in India, I transform raw footage into captivating visual
            narratives that evoke emotion and leave a lasting impression. My
            approach balances technical precision with artistic intuition.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-6"
            variants={itemVariants}
          >
            <div className="flex gap-4">
              <Button
                className="rounded-full px-6 font-normal cursor-pointer"
                variant="outline"
                onClick={scrollToWork}
                aria-label="View my work - scroll to video showcase"
              >
                View My Work
              </Button>
              <Button
                className="rounded-full px-6 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black font-normal"
                asChild
              >
                <a
                  href="mailto:kadgonds@gmail.com"
                  aria-label="Get in touch via email"
                >
                  Get in Touch
                </a>
              </Button>
            </div>

            {/* Social Media Links */}
            <SocialIcons />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

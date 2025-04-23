"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { InstagramIcon } from "./icons/instagram-icon";
import { TwitterIcon } from "./icons/twitter-icon";
import { LinkedinIcon } from "./icons/linkedin-icon";
import { cn } from "@/lib/utils";

interface SocialIconProps {
  name: string;
  url: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export function SocialIcons() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/samundar.mai/",
      Icon: InstagramIcon,
      ariaLabel: "Visit Sagar's Instagram profile",
    },
    {
      name: "Twitter",
      url: "https://x.com/samundarmai",
      Icon: TwitterIcon,
      ariaLabel: "Visit Sagar's Twitter profile",
    },
    {
      name: "LinkedIn",
      url: "http://www.linkedin.com/in/sagarkadgond",
      Icon: LinkedinIcon,
      ariaLabel: "Visit Sagar's LinkedIn profile",
    },
  ];

  return (
    <div className="flex items-center">
      <div className="inline-flex items-center" style={{ gap: 0, margin: 0 }}>
        {socialLinks.map((platform) => (
          <SocialIcon
            key={platform.name}
            name={platform.name}
            url={platform.url}
            icon={<platform.Icon size={20} />}
            ariaLabel={platform.ariaLabel}
          />
        ))}
      </div>
    </div>
  );
}

const SocialIcon = ({ name, url, icon, ariaLabel }: SocialIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative px-1.5 py-1 rounded-md transition-colors duration-300",
        isHovered ? "bg-accent" : "bg-transparent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center"
        aria-label={ariaLabel}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-in-out",
              isHovered
                ? "max-w-[120px] opacity-100 ml-2"
                : "max-w-0 opacity-0 ml-0"
            )}
          >
            <span className="whitespace-nowrap text-sm font-medium">
              {name}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

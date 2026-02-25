"use client";

import { useState, useRef, useEffect } from "react";

const defaultTabs = ["Portfolio", "Shorts", "Long Videos"];

interface WorkTabsProps {
  tabs?: string[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
}

export function WorkTabs({
  tabs = defaultTabs,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className = "",
}: WorkTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);

  const activeIndex =
    controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const handleTabClick = (index: number) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
  };

  const [hoverStyle, setHoverStyle] = useState({ left: "0px", width: "0px" });
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstElement = tabRefs.current[0];
      if (firstElement) {
        const { offsetLeft, offsetWidth } = firstElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Hover Highlight */}
      <div
        className="absolute h-[44px] transition-all duration-300 ease-out bg-white/10 rounded-[8px] flex items-center pointer-events-none"
        style={{
          ...hoverStyle,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      />

      {/* Active Indicator */}
      <div
        className="absolute bottom-[-8px] h-[2px] bg-white transition-all duration-300 ease-out"
        style={activeStyle}
      />

      {/* Tabs */}
      <div className="relative flex gap-2 items-center">
        {tabs.map((tab, index) => (
          <div
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            className={`px-5 py-3 cursor-pointer transition-colors duration-300 h-[44px] rounded-[8px] ${
              index === activeIndex ? "text-white" : "text-white/60 hover:text-white/80"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleTabClick(index)}
          >
            <span className="text-base leading-6 whitespace-nowrap flex items-center justify-center h-full">
              {tab}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

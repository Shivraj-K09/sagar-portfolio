"use client"

import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ResumeIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
}

export function ResumeIcon({ className, size = 28, ...props }: ResumeIconProps) {
  return (
    <div
      className={cn(
        "cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path
            fill="currentColor"
            d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
          />
          <path fill="currentColor" d="M14 2v5a1 1 0 0 0 1 1h5m-4 14a4 4 0 0 0-8 0" />
          <circle fill="currentColor" cx="12" cy="15" r="3" />
        </g>
      </svg>
    </div>
  )
}

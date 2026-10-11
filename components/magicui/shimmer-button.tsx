"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
}

/** Gradient-edge shimmer button (Magic UI style). */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#a78bfa",
      shimmerSize = "0.06em",
      borderRadius = "100px",
      shimmerDuration = "2.6s",
      background = "#13131a",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div className={cn("-z-30 blur-[2px]", "absolute inset-0 overflow-visible [container-type:size]")}>
          {/* spark */}
          <div className="absolute inset-0 aspect-auto h-full animate-shimmer-slide [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="absolute -inset-full w-auto animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}
        {/* highlight sheen */}
        <div
          className={cn(
            "absolute inset-0 size-full rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff1f]",
            "transition-all duration-300 ease-in-out",
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />
        {/* backdrop covering center, leaving only the animated ring — sits BELOW the text */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
            "transition-all duration-300 group-hover:[inset:calc(var(--cut)+1px)]"
          )}
        />
      </button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"

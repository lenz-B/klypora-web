"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT"

export function Button({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
    duration?: number
    clockwise?: boolean
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false)
  const [direction, setDirection] = useState<Direction>("TOP")

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"]
    const currentIndex = directions.indexOf(currentDirection)
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length
    return directions[nextIndex]
  }

  // Only gradients need to stay as CSS since Tailwind doesn't support complex radial gradients with CSS variables
  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, var(--highlight) 0%, transparent 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, var(--highlight) 0%, transparent 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, var(--highlight) 0%, transparent 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, var(--highlight) 0%, transparent 100%)",
  }

  const highlight = "radial-gradient(75% 181.2% at 50% 50%, var(--highlight) 0%, transparent 100%)"

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState))
      }, duration * 1000)
      return () => clearInterval(interval)
    }
  }, [hovered, duration, clockwise])

  return (
    <Tag
      onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        // Layout & positioning - all Tailwind
        "relative flex flex-col flex-nowrap items-center justify-center",
        "h-min w-fit gap-10 content-center overflow-visible",
        
        // Shape & borders - using your design tokens
        "rounded-full border border-border-muted p-px",
        
        // Background & interactions - using your color system
        // "bg-bg-dark/20 hover:bg-bg-dark/10",
        // "bg-bg-light/20 dark:hover:bg-bg-light/10",
        
        // Transitions - Tailwind classes
        "transition-all duration-500 ease-in-out",
        
        // Decoration
        "decoration-clone",
        
        containerClassName,
      )}
      {...props}
    >
      {/* Button content with full Tailwind styling */}
      <div 
        className={cn(
          // Layout
          "w-auto z-10",
          
          // Spacing - using your design system
          "px-4 py-2",
          
          // Shape - inheriting from parent
          "rounded-[inherit]",
          
          className,
          // Colors - using your design tokens
          "shadow-input from-bg-light to-bg-light relative",
          
        )}
      >
        {children}
      </div>
      
      {/* Animated gradient overlay */}
      <motion.div
        className={cn(
          // Layout & positioning - all Tailwind
          "absolute inset-0 z-0",
          "flex-none overflow-hidden",
          "rounded-[inherit]",
          // Blur effect needs to stay inline since Tailwind doesn't have blur-[2px]
        )}
        style={{
          filter: "blur(2px)",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      
      {/* Inner overlay - full Tailwind */}
      <div className={cn(
        // Background color
        "bg-bg-dark",
        
        // Layout & positioning
        "absolute z-[1] flex-none",
        
        // Sizing & shape
        "inset-[2px] rounded-[100px]"
      )} />
    </Tag>
  )
}
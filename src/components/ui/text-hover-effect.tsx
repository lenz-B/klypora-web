"use client"
import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

export const TextHoverEffect = ({
  text,
  duration,
  size = 'text-5xl'
}: {
  text: string
  duration?: number
  size?: string
}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" })

  // Optional: size map for tighter bounding box
  const sizeToViewBoxHeight = {
    "text-4xl": 40,
    "text-5xl": 50,
    "text-6xl": 60,
    "text-7xl": 75,
    "text-8xl": 90,
  }

  const viewBoxHeight = sizeToViewBoxHeight[size as keyof typeof sizeToViewBoxHeight] || 50

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect()
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      })
    }
  }, [cursor])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 300 ${viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="inline-block select-none"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="oklch(0.99 0.415 44.186)" /> {/* highlight */}
              <stop offset="25%" stopColor="oklch(0.99 0.415 44.186)" /> {/* highlight darker */}
              <stop offset="50%" stopColor="oklch(0.99 0.415 44.186)" /> {/* highlight even darker */}
              <stop offset="75%" stopColor="oklch(0.99 0.415 44.186)" /> {/* highlight much darker */}
              <stop offset="100%" stopColor="oklch(0.99 0.415 44.186)" /> {/* highlight darkest */}
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Base text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`font-logo font-bold ${size}`}
        style={{ opacity: hovered ? 0 : 0 }}
      >
        {text}
      </text>

      {/* Stroke outline */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={`font-logo font-bold fill-transparent ${size} stroke-border`}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* Gradient fill */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="url(#textGradient)"
        mask="url(#textMask)"
        className={`font-logo font-bold ${size}`}
      >
        {text}
      </text>
    </svg>
  )
}


import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-lg border border-border-muted/30 bg-bg-light/20 backdrop-blur-xl text-card-foreground shadow-2xl shadow-black/20 overflow-hidden",
      className,
    )}
    {...props}
  >
    {/* Main light beam effects matching the image */}
    <div className="absolute inset-0 pointer-events-none">

      {/* Edge highlight effects */}
      <div
        className="absolute top-0 right-0 w-3/4 h-px opacity-60"
        style={{
          background: `linear-gradient(to left, 
            rgba(255, 255, 255, 0.8) 0%, 
            oklch(0.99 0.415 44.186 / 0.4) 50%, 
            transparent 100%
          )`,
          filter: "blur(1px)",
          animation: "pulse 4s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      />

      <div
        className="absolute top-0 right-0 w-px h-3/4 opacity-60"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(255, 255, 255, 0.8) 0%, 
            oklch(0.99 0.415 44.186 / 0.4) 50%, 
            transparent 100%
          )`,
          filter: "blur(1px)",
          animation: "pulse 4s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      />

      {/* Subtle border enhancement */}
      <div
        className="absolute inset-0 rounded-lg opacity-40"
        style={{
          // border: "1px solid transparent",
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.2) 0%, 
            oklch(0.99 0.415 44.186 / 0.1) 50%, 
            transparent 100%
          ) border-box`,
          WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "subtract",
          animation: "pulse 5s ease-in-out infinite",
        }}
      />
    </div>

    

    {/* Content wrapper */}
    <div className="relative z-10">{props.children}</div>
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-sans text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
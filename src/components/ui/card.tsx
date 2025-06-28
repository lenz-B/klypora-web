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
          border: "1px solid transparent",
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

    {/* Top-left corner beam */}
    <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-radial from-accent/40 via-accent/20 to-transparent rounded-full blur-2xl animate-pulse opacity-80" />

    {/* Top-right corner beam */}
    <div
      className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-radial from-accent/35 via-accent/15 to-transparent rounded-full blur-xl animate-pulse opacity-70"
      style={{ animationDelay: "1s", animationDuration: "3s" }}
    />

    {/* Bottom-left corner beam */}
    <div
      className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-radial from-accent/30 via-accent/12 to-transparent rounded-full blur-lg animate-pulse opacity-60"
      style={{ animationDelay: "2s", animationDuration: "4s" }}
    />

    {/* Bottom-right corner beam */}
    <div
      className="absolute -bottom-8 -right-8 w-36 h-36 bg-gradient-radial from-accent/45 via-accent/25 to-transparent rounded-full blur-3xl animate-pulse opacity-85"
      style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
    />

    {/* Edge glow effects */}
    <div
      className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
      style={{ animationDelay: "1.5s" }}
    />
    <div
      className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/25 to-transparent animate-pulse"
      style={{ animationDelay: "2.5s" }}
    />
    <div
      className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse"
      style={{ animationDelay: "3s" }}
    />
    <div
      className="absolute right-0 bottom-0 w-px h-full bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse"
      style={{ animationDelay: "3.5s" }}
    />

    {/* Subtle border glow */}
    <div
      className="absolute inset-0 rounded-lg border border-accent/15 animate-pulse"
      style={{ animationDelay: "0.25s", animationDuration: "4s" }}
    />

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
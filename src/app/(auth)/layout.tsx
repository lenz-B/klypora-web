'use client'

import { SplashCursor } from "@/components/ui/splash-cursor"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-dark">
      <SplashCursor
        BACK_COLOR={{ r: 0.1, g: 0.015, b: 0.264 }}
        COLOR_UPDATE_SPEED={5}
        DENSITY_DISSIPATION={2.8}
        VELOCITY_DISSIPATION={1.8}
        SPLAT_FORCE={4000}
        SPLAT_RADIUS={0.15}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}

import { SplashCursor } from "@/components/ui/splash-cursor"

export function SplashDemo() {
  return (
    <div className="relative w-full h-screen bg-bg-dark overflow-hidden">
      <SplashCursor
        BACK_COLOR={{ r: 0.1, g: 0.015, b: 0.264 }}
        COLOR_UPDATE_SPEED={8}
        DENSITY_DISSIPATION={3.2}
        VELOCITY_DISSIPATION={2.2}
        SPLAT_FORCE={5500}
        SPLAT_RADIUS={0.18}
        SHADING={true}
      />

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-4 p-8 bg-bg-light/80 backdrop-blur-sm rounded-lg border border-border-muted">
          <h1 className="text-4xl font-bold text-text">Interactive Fluid Simulation</h1>
          <p className="text-text-muted max-w-md">
            Move your mouse or touch the screen to create beautiful fluid effects with your brand colors.
          </p>
        </div>
      </div>
    </div>
  )
}
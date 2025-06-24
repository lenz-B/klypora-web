"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SplashCursor } from "@/components/ui/splash-cursor"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      alert("Please enter all 6 digits")
      return
    }
    console.log("OTP verification:", otpCode)
    setIsSubmitted(true)
  }

  const handleResendOTP = () => {
    console.log("Resending OTP...")
    setOtp(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-text">
              {isSubmitted ? "Verification Complete" : "Enter Verification Code"}
            </CardTitle>
            <CardDescription className="text-text-muted">
              {isSubmitted
                ? "Your account has been successfully verified"
                : "We've sent a 6-digit code to your email address"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold bg-bg-light/20 backdrop-blur-sm border border-border-muted/30 rounded-lg text-text focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                    />
                  ))}
                </div>

                <div className="flex-center">
                  <Button
                    type="submit"
                    
                    className="py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Verify Code
                  </Button>
                </div>


                <div className="text-center flex-center">
                  <p className="text-sm text-gray-700 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors font-medium"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-6 bg-success/10 border border-success/20 rounded-lg">
                  <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
                  <p className="text-success text-sm">Your account has been successfully verified!</p>
                </div>

                <Link href="/login">
                  <Button className="w-full bg-gradient-to-br from-primary to-primary-dark hover:from-primary-light hover:to-primary py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]">
                    Continue to Login
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex-center">
              <Link
                href="/login"
                className="flex items-center text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

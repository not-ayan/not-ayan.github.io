"use client"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type React from "react" // Added import for React

interface FrameComponentProps {
  src: string
  width: number | string
  height: number | string
  className?: string
  isHovered: boolean
  onClick?: () => void
}

export function FrameComponent({ src, width, height, className = "", isHovered, onClick }: FrameComponentProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null)
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm")

  useEffect(() => {
    const mediaElement = mediaRef.current
    if (!mediaElement || !isVideo) return

    if (isHovered) {
      ;(mediaElement as HTMLVideoElement).play().catch(() => {
        // Handle any autoplay restrictions
      })
    } else {
      ;(mediaElement as HTMLVideoElement).pause()
      ;(mediaElement as HTMLVideoElement).currentTime = 0
    }
  }, [isHovered, isVideo])

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden cursor-pointer ${className}`}
      style={{
        width,
        height,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            src={src}
            loop
            muted
            playsInline
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
          />
        ) : (
          <img
            className="w-full h-full object-cover"
            src={src || "/placeholder.svg"}
            alt=""
            ref={mediaRef as React.RefObject<HTMLImageElement>}
          />
        )}
      </div>
    </motion.div>
  )
}


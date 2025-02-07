"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCloudinaryImages } from "../utils/cloudinary"

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  display_name: string;
  width: number;
  height: number;
}

export default function DynamicFrameLayout() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null)
  const [expandedImageLoading, setExpandedImageLoading] = useState(true)
  const [expandedImages, setExpandedImages] = useState<CloudinaryImage[] | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true)
        const fetchedImages = await getCloudinaryImages()
        if (Array.isArray(fetchedImages)) {
          setImages(fetchedImages)
        } else {
          console.error("Unexpected response format:", fetchedImages)
          setError("Failed to load images. Please try again later.")
        }
        setError(null)
      } catch (err: any) {
        console.error("Error fetching images:", err)
        setError(err.message || "Failed to load images. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [])

  const handleImageClick = async (index: number) => {
    setExpandedImageIndex(index)
    setExpandedImageLoading(true)
    const subfolder = images[index].folder
    if (!subfolder) {
      // Missing folder => show only this image
      setExpandedImages([images[index]])
      return
    }
    try {
      const res = await fetch(`/api/cloudinary-images?subfolder=${encodeURIComponent(subfolder)}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setExpandedImages(data)
        if (index >= data.length) {
          // Reset expanded index if out of range
          setExpandedImageIndex(0)
        }
      } else {
        // Fallback to a single image if the subfolder is empty
        setExpandedImages([images[index]])
      }
    } catch (err) {
      console.error(err)
      setExpandedImages([images[index]])
    }
  }

  const handleClose = () => {
    setExpandedImageIndex(null)
  }

  const handleNext = () => {
    if (!expandedImages || expandedImageIndex === null) return
    setExpandedImageIndex((expandedImageIndex + 1) % expandedImages.length)
    setExpandedImageLoading(true)
  }

  const handlePrevious = () => {
    if (!expandedImages || expandedImageIndex === null) return
    setExpandedImageIndex((expandedImageIndex - 1 + expandedImages.length) % expandedImages.length)
    setExpandedImageLoading(true)
  }

  const handleImageLoad = () => {
    setExpandedImageLoading(false)
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
        {loading && Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-[#040404] animate-pulse"></div>
        ))}
        {images.map((image, index) => (
          <motion.div
            key={`${image.public_id}-${index}`}
            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleImageClick(index)}
          >
            <motion.img
              src={image.secure_url.replace('q_auto', 'q_50')}
              alt={image.display_name}
              className="absolute inset-0 w-full h-full object-cover blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              onLoad={(e) => e.currentTarget.classList.remove('blur-lg')}
            />
          </motion.div>
        ))}
      </div>

      {expandedImageIndex !== null && expandedImages && expandedImageIndex < expandedImages.length && expandedImages[expandedImageIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={handleClose}>×</button>
          <button className="absolute left-4 text-white text-2xl" onClick={handlePrevious}>‹</button>
          {expandedImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-4 border-white/20 border-t-white animate-spin rounded-full w-10 h-10"></div>
            </div>
          )}
          <img
            src={expandedImages[expandedImageIndex].secure_url.replace('q_50', 'q_auto')}
            alt={expandedImages[expandedImageIndex].display_name}
            className={`max-w-full max-h-full ${expandedImageLoading ? 'hidden' : 'block'}`}
            onLoad={handleImageLoad}
          />
          <button className="absolute right-4 text-white text-2xl" onClick={handleNext}>›</button>
        </div>
      )}
    </div>
  )
}

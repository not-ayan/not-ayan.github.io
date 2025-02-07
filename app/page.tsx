"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import DynamicFrameLayout from "../components/DynamicFrameLayout"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import Image from "next/image"
import Link from "next/link"
import ContactForm from "../components/ContactForm"

export default function Home() {
  const [headerSize] = useState(1.2)
  const [textSize] = useState(0.8)
  const [showContactForm, setShowContactForm] = useState(false)
  const rightPaneRef = useRef<HTMLDivElement>(null)

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div
      className={`min-h-screen bg-[#141414] flex flex-col md:flex-row ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      {/* Left Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full md:w-[300px] flex-shrink-0 flex flex-col justify-between h-screen md:fixed left-0 top-0 p-8"
      >
        <div className="flex flex-col gap-16">
          <motion.h1
            className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter leading-[130%]`}
            style={{ fontSize: `${2.5 * headerSize}rem` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Aleem

          </motion.h1>
          <motion.div
            className={`${inter.className} flex flex-col gap-12 text-white/50 text-sm font-light max-w-[300px]`}
            style={{ fontSize: `${0.875 * textSize}rem` }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <div className="space-y-6">
              <div className="h-px bg-white/10 w-full" />
              <p>
                Aleem is an interior designer based in Dubai. With years of experience in designing
                residential and commercial spaces, Aleem blends creativity with functional solutions
                to bring clients’ visions to life. His design philosophy balances aesthetics with
                comfort, making every project both visually striking and practical.
              </p>
              <p>Here are some of our favorite works so far.</p>
              <div className="h-px bg-white/10 w-full" />
            </div>
          </motion.div>
          <Link
            href="https://lumalabs.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LumaLogo%201-MA3upjPymxFHKoHJgpdAUfZMeKGq3i.png"
              alt="Luma Logo"
              fill
              className="object-contain"
            />
          </Link>
          <button
            onClick={() => setShowContactForm(true)}
            className="hidden md:inline-block px-6 py-3 text-white/70 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-colors text-center w-full max-w-[260px] text-sm mt-16"
          >
            Contact Me
          </button>
        </div>
      </motion.div>

      {/* Right Content */}
      <motion.div
        className="w-full md:ml-[300px] h-screen overflow-y-auto md:overflow-y-scroll scrollbar-hide"
        ref={rightPaneRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        <div className="h-[60vh] md:h-[200vh] p-2 md:p-8">
          <DynamicFrameLayout />
        </div>
      </motion.div>

      {/* Mobile Contact Button */}
      <button
        onClick={() => setShowContactForm(true)}
        className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
    </div>
  )
}


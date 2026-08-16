'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const phrases = [
  'Store images',
  'Collaborate effortlessly',
  'Share securely',
  'Organize smartly',
  'Access anywhere',
  'Upload instantly',
  'Manage seamlessly',
  'Store images in collaborative ways'
]

export default function Preloader({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Cycle through phrases
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= phrases.length - 1) {
          clearInterval(interval)
          // Start exit animation after last phrase
          setTimeout(() => setIsExiting(true), 800)
          return prev
        }
        return prev + 1
      })
    }, 400) // Speed of phrase change

    return () => clearInterval(interval)
  }, [])

  const handleExitComplete = () => {
    onComplete?.()
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative w-full max-w-6xl h-40 md:h-48 flex items-center justify-center px-8">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ opacity: 0, filter: 'blur(12px)', y: 30 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(12px)', y: -30 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-x-0 text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center leading-tight"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {phrases[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

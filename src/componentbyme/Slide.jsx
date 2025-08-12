"use client"

import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Check, Loader2, SendHorizontal, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const DRAG_CONSTRAINTS = { left: 0, right: 155 }
const DRAG_THRESHOLD = 0.9

const BUTTON_STATES = {
  initial: { width: "12rem" },
  completed: { width: "8rem" },
}

const ANIMATION_CONFIG = {
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 0.8,
  },
}

const StatusIcon = ({ status }) => {
  const iconMap = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={20} />,
      success: <Check size={20} />,
      error: <X size={20} />,
    }),
    []
  )

  if (!iconMap[status]) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  )
}

const useButtonStatus = (resolveTo) => {
  const [status, setStatus] = useState("idle")

  const handleSubmit = useCallback(() => {
    setStatus("loading")
    setTimeout(() => {
      setStatus(resolveTo)
    }, 2000)
  }, [resolveTo])

  return { status, handleSubmit }
}

const SlideButton = forwardRef(({ className, ...props }, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [completed, setCompleted] = useState(false)
  const dragHandleRef = useRef(null)
  const { status, handleSubmit } = useButtonStatus("success")

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, ANIMATION_CONFIG.spring)
  const dragProgress = useTransform(springX, [0, DRAG_CONSTRAINTS.right], [0, 1])

  const handleDragStart = useCallback(() => {
    if (completed) return
    setIsDragging(true)
  }, [completed])

  const handleDragEnd = () => {
    if (completed) return
    setIsDragging(false)

    const progress = dragProgress.get()
    if (progress >= DRAG_THRESHOLD) {
      setCompleted(true)
      handleSubmit()
    } else {
      dragX.set(0)
    }
  }

  const handleDrag = (_event, info) => {
    if (completed) return
    const newX = Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right))
    dragX.set(newX)
  }

  const adjustedWidth = useTransform(springX, (x) => x + 10)

  return (
    <motion.div
      animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
      transition={ANIMATION_CONFIG.spring}
      className={cn(
        "shadow-button-inset dark:shadow-button-inset-dark relative flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
        className
      )}
      style={{ overflow: "hidden" }} // optionally clip overflowing content
    >
      {!completed && (
        <motion.div
          style={{
            width: adjustedWidth,
          }}
          className="absolute inset-y-0 left-0 z-0 rounded-full bg-accent"
        />
      )}

      <AnimatePresence mode="wait">
        {!completed && (
          <motion.div
            ref={dragHandleRef}
            drag="x"
            dragConstraints={DRAG_CONSTRAINTS}
            dragElastic={0.05}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            style={{ x: springX }}
            className="absolute -left-4 z-10 flex cursor-grab items-center justify-start active:cursor-grabbing"
          >
            <Button
              ref={ref}
              disabled={status === "loading"}
              {...props}
              size="icon"
              aria-label="Slide to submit"
              className={cn(
                "shadow-button rounded-full drop-shadow-xl",
                isDragging && "scale-105 transition-transform"
              )}
            >
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {completed && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              ref={ref}
              disabled={status === "loading"}
              {...props}
              className="w-full rounded-full transition-all duration-300"
              aria-label="Submission status"
            >
              <AnimatePresence mode="wait">
                <StatusIcon status={status} />
              </AnimatePresence>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

SlideButton.displayName = "SlideButton"

export { SlideButton }

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { chapters } from "@/lib/book-data"
import { useReality } from "./reality-provider"
import { useAudio } from "./audio-provider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChapterNavigationProps {
  currentChapterId: string
}

export function ChapterNavigation({ currentChapterId }: ChapterNavigationProps) {
  const { realityState, recordMemory, recordChoice } = useReality()
  const { playSound, audioEnabled } = useAudio()
  const [glitchNav, setGlitchNav] = useState(false)

  const currentIndex = chapters.findIndex((c) => c.id === currentChapterId)

  // Get visible chapters based on player choices
  const visibleChapters = chapters.filter((chapter) => {
    if (!chapter.visibilityCondition) return true
    return realityState.choices[chapter.visibilityCondition.choiceId] === chapter.visibilityCondition.value
  })

  const visibleIndex = visibleChapters.findIndex((c) => c.id === currentChapterId)
  const prevChapter = visibleIndex > 0 ? visibleChapters[visibleIndex - 1] : null
  const nextChapter = visibleIndex < visibleChapters.length - 1 ? visibleChapters[visibleIndex + 1] : null

  const handleNextChapter = () => {
    recordMemory(`completed-${currentChapterId}`, true)

    // Record a default choice if this chapter has choices but none were made
    const currentChapter = chapters.find((c) => c.id === currentChapterId)
    if (currentChapter?.defaultChoice && !realityState.choices[currentChapter.defaultChoice.id]) {
      recordChoice(currentChapter.defaultChoice.id, currentChapter.defaultChoice.value)
    }

    // Play sound effect if audio is enabled
    if (audioEnabled) {
      playSound("door", { volume: 0.3 })
    }

    // Random glitch effect based on reality distortion
    if (Math.random() < realityState.realityDistortion / 100) {
      setGlitchNav(true)
      setTimeout(() => setGlitchNav(false), 200)
    }
  }

  return (
    <div className={cn("flex justify-between mt-12 max-w-4xl mx-auto", glitchNav && "glitch-effect")}>
      {prevChapter ? (
        <Link href={`/chapter/${prevChapter.id}`} onClick={handleNextChapter}>
          <Button variant="outline" className="border-primary/30 hover:border-primary/60">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous: {prevChapter.title}
          </Button>
        </Link>
      ) : (
        <Link href="/">
          <Button variant="outline" className="border-primary/30 hover:border-primary/60">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Cover
          </Button>
        </Link>
      )}

      {nextChapter && (
        <Link href={`/chapter/${nextChapter.id}`} onClick={handleNextChapter}>
          <Button className="bg-primary hover:bg-primary/90">
            Next: {nextChapter.title}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}

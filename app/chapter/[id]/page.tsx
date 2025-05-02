"use client"
import { useState, useEffect } from "react"
import { ChapterContent } from "@/components/chapter-content"
import { ChapterNavigation } from "@/components/chapter-navigation"
import { chapters } from "@/lib/book-data"
import { useReality } from "@/components/reality-provider"
import { useAudio } from "@/components/audio-provider"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export default function ChapterPage({ params }: { params: { id: string } }) {
  const chapter = chapters.find((c) => c.id === params.id)
  const { realityState, setRealityState } = useReality()
  const { playSound, audioEnabled, setAudioEnabled } = useAudio()
  const [textDistortion, setTextDistortion] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  if (!chapter) {
    notFound()
  }

  // Apply reality distortion effects
  useEffect(() => {
    // Set text distortion based on reality state
    setTextDistortion(realityState.realityDistortion / 100)

    // Play chapter-specific ambient sound if audio is enabled
    if (audioEnabled && chapter.ambientSound) {
      playSound(chapter.ambientSound, { loop: true, volume: 0.2 })
    }

    // Random glitch effects based on reality distortion level
    const glitchInterval = setInterval(() => {
      if (Math.random() > 1 - realityState.realityDistortion / 200) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 8000)

    return () => clearInterval(glitchInterval)
  }, [realityState, chapter, playSound, audioEnabled])

  // Update mental state based on chapter
  useEffect(() => {
    if (chapter.mentalStateEffect) {
      setRealityState((prev) => ({
        ...prev,
        mentalState: chapter.mentalStateEffect || prev.mentalState,
        realityDistortion: Math.min(100, prev.realityDistortion + (chapter.distortionEffect || 0)),
      }))
    }
  }, [chapter, setRealityState])

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (!audioEnabled && chapter.ambientSound) {
      playSound(chapter.ambientSound, { loop: true, volume: 0.2 })
    }
  }

  return (
    <div
      className={cn(
        "container mx-auto py-8 transition-all duration-500",
        glitchActive && "glitch-effect",
        realityState.mentalState === "paranoid" && "paranoid-filter",
        realityState.mentalState === "delusional" && "delusional-filter",
      )}
    >
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          title={audioEnabled ? "Disable audio" : "Enable audio"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>
      <ChapterContent chapter={chapter} textDistortion={textDistortion} />
      <ChapterNavigation currentChapterId={params.id} />
    </div>
  )
}

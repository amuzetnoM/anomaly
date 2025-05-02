"use client"
import { useState, useEffect } from "react"
import { BookCover } from "@/components/book-cover"
import { useReality } from "@/components/reality-provider"
import { useAudio } from "@/components/audio-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export default function Home() {
  const { setRealityState } = useReality()
  const { playSound, audioEnabled, setAudioEnabled } = useAudio()
  const [glitchActive, setGlitchActive] = useState(false)

  // Reset reality state when landing on the cover page
  useEffect(() => {
    setRealityState({
      mentalState: "neutral",
      trustLevel: 100,
      realityDistortion: 0,
      memories: {},
      choices: {},
    })

    // Play ambient sound when the page loads if audio is enabled
    if (audioEnabled) {
      playSound("ambient", { loop: true, volume: 0.3 })
    }

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [setRealityState, playSound, audioEnabled])

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (!audioEnabled) {
      playSound("ambient", { loop: true, volume: 0.3 })
    }
  }

  return (
    <div className={cn("container mx-auto py-8 transition-all duration-300", glitchActive && "glitch-effect")}>
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
      <BookCover title="The Fractured Mind" subtitle="Where reality bends to perception" author="A.I. Narrator" />
    </div>
  )
}

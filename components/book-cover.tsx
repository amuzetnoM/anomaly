"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { chapters } from "@/lib/book-data"
import { useReality } from "./reality-provider"
import { useAudio } from "./audio-provider"
import { BookOpen, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookCoverProps {
  title: string
  subtitle: string
  author: string
}

export function BookCover({ title, subtitle, author }: BookCoverProps) {
  const { realityState, resetReality } = useReality()
  const { playSound, audioEnabled } = useAudio()
  const [glitchTitle, setGlitchTitle] = useState(false)
  const [metaMessage, setMetaMessage] = useState<string | null>(null)

  // Reset reality when starting a new game
  const handleStartReading = () => {
    resetReality()
    if (audioEnabled) {
      playSound("door", { volume: 0.4 })
    }
  }

  // Random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchTitle(true)
        setTimeout(() => setGlitchTitle(false), 150)
      }
    }, 5000)

    // Meta-narrative: show a message if the player has completed the book before
    if (Object.keys(realityState.memories).length > 5) {
      setTimeout(() => {
        setMetaMessage("Haven't we been here before? The pages remember you...")
      }, 3000)
    }

    return () => clearInterval(glitchInterval)
  }, [realityState.memories])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="mb-8 p-12 border border-primary/20 rounded-lg shadow-lg max-w-2xl mx-auto bg-black/60 backdrop-blur-sm">
        <BookOpen className="h-24 w-24 mx-auto mb-6 text-primary" />
        <h1 className={cn("text-4xl font-bold mb-4 transition-all duration-300", glitchTitle && "glitch-effect")}>
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">{subtitle}</p>
        <p className="text-lg mb-8">By {author}</p>

        <div className="flex justify-center">
          <Link href={`/chapter/${chapters[0]?.id}`}>
            <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90" onClick={handleStartReading}>
              <Eye className="mr-2 h-4 w-4" />
              Begin Reading
            </Button>
          </Link>
        </div>

        {metaMessage && <p className="mt-6 text-sm text-primary/80 italic">{metaMessage}</p>}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { TemporalPuzzle } from "@/components/puzzles/temporal-puzzle"
import { Button } from "@/components/ui/button"
import { useReality } from "@/components/reality-provider"
import { useAudio } from "@/components/audio-provider"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"

export default function PuzzlePage() {
  const params = useParams()
  const { realityState } = useReality()
  const { playSound, audioEnabled, setAudioEnabled } = useAudio()
  const [puzzle, setPuzzle] = useState<any>(null)
  const [solved, setSolved] = useState(false)

  // Load puzzle data
  useEffect(() => {
    // In a real app, this would come from an API or database
    // For now, we'll simulate loading from localStorage
    const bookData = localStorage.getItem("book-structure")
    if (bookData) {
      try {
        const parsedData = JSON.parse(bookData)
        const foundPuzzle = parsedData.puzzles?.find((p: any) => p.id === params.id)

        if (foundPuzzle) {
          setPuzzle(foundPuzzle)

          // Check if already solved
          const isSolved = Object.keys(realityState.memories).some((key) => key === `puzzle-${foundPuzzle.id}-solved`)

          setSolved(isSolved)
        }
      } catch (error) {
        console.error("Failed to parse book data", error)
      }
    }
  }, [params.id, realityState.memories])

  const handleSolved = () => {
    setSolved(true)
    if (audioEnabled) {
      playSound("static", { volume: 0.4 })
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  if (!puzzle) {
    // Loading state or not found
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <Button variant="outline" className="border-primary/30 hover:border-primary/60">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            title={audioEnabled ? "Disable audio" : "Enable audio"}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" className="border-primary/30 hover:border-primary/60">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          title={audioEnabled ? "Disable audio" : "Enable audio"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <TemporalPuzzle puzzle={puzzle} onSolved={handleSolved} />
      </div>
    </div>
  )
}

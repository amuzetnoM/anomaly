"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type MemoryFragment = {
  id: string
  content: string
  correctPosition: number
  isReliable: boolean
}

type MemoryPuzzleProps = {
  data: {
    title: string
    description?: string
    fragments: MemoryFragment[]
    realityEffect?: {
      distortion: number
      mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
    }
    revealTruth?: boolean
  }
  id: string
}

export function MemoryPuzzle({ data, id }: MemoryPuzzleProps) {
  const { realityState, distortReality, changeMentalState, recordMemory, getMemory } = useReality()
  const { playSound } = useAudio()
  const [fragments, setFragments] = useState<MemoryFragment[]>([])
  const [draggedFragment, setDraggedFragment] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showTruth, setShowTruth] = useState(false)

  // Initialize fragments in random order
  useEffect(() => {
    // Check if this puzzle has been completed before
    const savedState = getMemory(id)
    if (savedState?.isComplete) {
      setFragments(savedState.fragments)
      setIsComplete(true)
      if (data.revealTruth) {
        setShowTruth(true)
      }
      return
    }

    // Shuffle fragments
    const shuffled = [...data.fragments].sort(() => Math.random() - 0.5)
    setFragments(shuffled)
  }, [data, id, getMemory])

  const handleDragStart = (fragmentId: string) => {
    setDraggedFragment(fragmentId)
    playSound("memory", { volume: 0.2 })
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()

    if (!draggedFragment) return

    // Find the dragged fragment
    const draggedIndex = fragments.findIndex((f) => f.id === draggedFragment)
    if (draggedIndex === -1) return

    // Reorder fragments
    const newFragments = [...fragments]
    const [removed] = newFragments.splice(draggedIndex, 1)
    newFragments.splice(targetIndex, 0, removed)

    setFragments(newFragments)
    setDraggedFragment(null)

    // Check if puzzle is complete
    const isCorrect = newFragments.every((fragment, index) => fragment.correctPosition === index)

    if (isCorrect) {
      setIsComplete(true)
      playSound("static", { volume: 0.3 })

      // Apply reality effects
      if (data.realityEffect) {
        distortReality(data.realityEffect.distortion)
        if (data.realityEffect.mentalState) {
          changeMentalState(data.realityEffect.mentalState)
        }
      }

      // Save completion state
      recordMemory(id, {
        isComplete: true,
        fragments: newFragments,
        completedAt: new Date().toISOString(),
      })

      // Show truth if applicable
      if (data.revealTruth) {
        setTimeout(() => {
          setShowTruth(true)
        }, 2000)
      }
    }
  }

  const revealTruth = () => {
    setShowTruth(true)
    playSound("whisper", { volume: 0.3 })
  }

  return (
    <Card className="my-6 border-primary/30 bg-black/70 shadow-md">
      <CardHeader>
        <CardTitle className={cn("text-primary/90", isComplete && "glitch-effect")}>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isComplete ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Arrange these memory fragments in the correct order to reconstruct what happened.
              </p>

              <div className="space-y-2">
                {fragments.map((fragment, index) => (
                  <div
                    key={fragment.id}
                    className={cn("memory-fragment cursor-move", draggedFragment === fragment.id && "dragging")}
                    draggable
                    onDragStart={() => handleDragStart(fragment.id)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <p>{fragment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-primary/90 font-medium mb-2">Memory reconstructed:</p>

              <div className="space-y-2">
                {fragments.map((fragment) => (
                  <div
                    key={fragment.id}
                    className={cn(
                      "memory-fragment",
                      !fragment.isReliable && !showTruth && "border-red-500/40",
                      showTruth && !fragment.isReliable && "border-yellow-500/40 line-through",
                    )}
                  >
                    <p>{fragment.content}</p>
                    {showTruth && !fragment.isReliable && (
                      <p className="text-yellow-500/90 text-sm mt-2 italic">This memory is false.</p>
                    )}
                  </div>
                ))}
              </div>

              {data.revealTruth && !showTruth && (
                <Button
                  variant="outline"
                  className="mt-4 border-primary/40 hover:border-primary/70"
                  onClick={revealTruth}
                >
                  Question These Memories
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type MetaNarrativeProps = {
  data: {
    title: string
    description?: string
    type: "fourth-wall" | "self-aware" | "reader-aware"
    content: any
    realityEffect?: {
      distortion: number
      mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
    }
  }
  id: string
}

export function MetaNarrative({ data, id }: MetaNarrativeProps) {
  const { realityState, distortReality, changeMentalState, recordMemory, getMemory } = useReality()
  const { playSound } = useAudio()
  const [revealed, setRevealed] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)
  const [glitchActive, setGlitchActive] = useState(false)

  // Check if this meta-narrative was interacted with before
  useEffect(() => {
    const savedState = getMemory(id)
    if (savedState?.revealed) {
      setRevealed(true)
      setInteractionCount(savedState.interactionCount || 1)
    }
  }, [id, getMemory])

  // Random glitch effects
  useEffect(() => {
    if (!revealed) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 4000)

    return () => clearInterval(glitchInterval)
  }, [revealed])

  const handleReveal = () => {
    setRevealed(true)
    setInteractionCount((prev) => prev + 1)
    playSound("whisper", { volume: 0.3 })

    // Apply glitch effect
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 300)

    // Apply reality effects
    if (data.realityEffect) {
      distortReality(data.realityEffect.distortion)
      if (data.realityEffect.mentalState) {
        changeMentalState(data.realityEffect.mentalState)
      }
    }

    // Record the interaction
    recordMemory(id, {
      revealed: true,
      interactionCount: interactionCount + 1,
      timestamp: new Date().toISOString(),
    })
  }

  const renderContent = () => {
    if (!revealed) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">{data.content.hiddenPrompt}</p>

          <Button variant="outline" className="border-primary/30 hover:border-primary/60" onClick={handleReveal}>
            {data.content.revealButtonText || "Reveal"}
          </Button>
        </div>
      )
    }

    switch (data.type) {
      case "fourth-wall":
        return (
          <div className="space-y-4">
            <div className={cn("p-4 border border-primary/40 rounded-md bg-black/70", glitchActive && "glitch-effect")}>
              <p className="text-primary/90 italic">{data.content.message}</p>

              {data.content.readerName && (
                <p className="mt-4 text-red-400/90 font-medium">
                  Hello, {data.content.readerName}. Yes, I'm talking to you.
                </p>
              )}
            </div>

            {data.content.choices && (
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground">How do you respond?</p>

                <div className="flex flex-wrap gap-2">
                  {data.content.choices.map((choice: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="border-primary/30 hover:border-primary/60"
                      onClick={() => {
                        setInteractionCount((prev) => prev + 1)
                        playSound("static", { volume: 0.2 })

                        // Record the choice
                        recordMemory(`${id}-choice`, {
                          choice: choice.text,
                          timestamp: new Date().toISOString(),
                        })
                      }}
                    >
                      {choice.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "self-aware":
        return (
          <div className="space-y-4">
            <div className={cn("p-4 border border-primary/40 rounded-md bg-black/70", glitchActive && "glitch-effect")}>
              <p className="text-primary/90 italic">{data.content.message}</p>

              {interactionCount > 1 && data.content.followUpMessage && (
                <p className="mt-4 text-red-400/90">{data.content.followUpMessage}</p>
              )}
            </div>

            {data.content.action && (
              <Button
                variant="outline"
                className="border-primary/30 hover:border-primary/60 mt-2"
                onClick={() => {
                  setInteractionCount((prev) => prev + 1)
                  playSound("static", { volume: 0.3 })

                  // Record the interaction
                  recordMemory(`${id}-action`, {
                    action: data.content.action,
                    interactionCount: interactionCount + 1,
                    timestamp: new Date().toISOString(),
                  })
                }}
              >
                {data.content.action}
              </Button>
            )}
          </div>
        )

      case "reader-aware":
        return (
          <div className="space-y-4">
            <div className={cn("p-4 border border-primary/40 rounded-md bg-black/70", glitchActive && "glitch-effect")}>
              <p className="text-primary/90 italic">{data.content.message}</p>

              {data.content.personalizedMessage && (
                <p className="mt-4 text-red-400/90">
                  {data.content.personalizedMessage.replace("{time}", new Date().toLocaleTimeString())}
                </p>
              )}
            </div>

            {data.content.acknowledgment && (
              <Button
                variant="outline"
                className="border-primary/30 hover:border-primary/60 mt-2"
                onClick={() => {
                  setInteractionCount((prev) => prev + 1)
                  playSound("static", { volume: 0.3 })

                  // Record the acknowledgment
                  recordMemory(`${id}-acknowledgment`, {
                    acknowledged: true,
                    timestamp: new Date().toISOString(),
                  })
                }}
              >
                {data.content.acknowledgment}
              </Button>
            )}
          </div>
        )

      default:
        return <p>Unknown meta-narrative type</p>
    }
  }

  return (
    <Card className={cn("my-6 border-primary/30 bg-black/70 shadow-md", revealed && "border-red-500/30")}>
      <CardHeader>
        <CardTitle className={cn(revealed ? "text-red-400/90" : "text-primary/90", glitchActive && "glitch-effect")}>
          {revealed ? data.content.revealedTitle || data.title : data.title}
        </CardTitle>
        {data.description && !revealed && <CardDescription>{data.description}</CardDescription>}
        {revealed && data.content.revealedDescription && (
          <CardDescription className="text-red-400/70">{data.content.revealedDescription}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

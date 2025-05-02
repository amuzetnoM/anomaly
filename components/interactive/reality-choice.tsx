"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type Choice = {
  id: string
  text: string
  consequence: string
  realityEffect?: {
    distortion: number
    mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
  }
}

type RealityChoiceProps = {
  data: {
    title: string
    description?: string
    prompt: string
    choices: Choice[]
    timeLimit?: number // in seconds
  }
  id: string
}

export function RealityChoice({ data, id }: RealityChoiceProps) {
  const { realityState, distortReality, changeMentalState, recordChoice, getChoice } = useReality()
  const { playSound } = useAudio()
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(data.timeLimit || null)
  const [glitchActive, setGlitchActive] = useState(false)

  // Check if choice was made before
  useEffect(() => {
    const savedChoice = getChoice(id)
    if (savedChoice) {
      const choice = data.choices.find((c) => c.id === savedChoice)
      if (choice) {
        setSelectedChoice(choice)
      }
    }
  }, [id, data.choices, getChoice])

  // Handle time limit
  useEffect(() => {
    if (!timeRemaining || selectedChoice) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          // Auto-select first choice if time runs out
          if (!selectedChoice) {
            handleChoice(data.choices[0])
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, selectedChoice, data.choices])

  // Random glitch effects
  useEffect(() => {
    if (realityState.realityDistortion < 20) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [realityState.realityDistortion])

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice)
    playSound("static", { volume: 0.3 })

    // Record the choice
    recordChoice(id, choice.id)

    // Apply reality effects
    if (choice.realityEffect) {
      distortReality(choice.realityEffect.distortion)
      if (choice.realityEffect.mentalState) {
        changeMentalState(choice.realityEffect.mentalState)
      }
    }

    // Random glitch effect
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 300)
  }

  return (
    <Card
      className={cn(
        "my-6 border-primary/30 bg-black/70 shadow-md transition-all duration-300",
        glitchActive && "glitch-effect",
      )}
    >
      <CardHeader>
        <CardTitle className="text-primary/90">{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg mb-4">{data.prompt}</p>

          {timeRemaining !== null && timeRemaining > 0 && !selectedChoice && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Time remaining: {timeRemaining}s</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${(timeRemaining / (data.timeLimit || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!selectedChoice ? (
            <div className="space-y-3">
              {data.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full justify-start text-left border-primary/30 hover:border-primary/60 p-4 h-auto"
                  onClick={() => handleChoice(choice)}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-primary/40 rounded-md">
                <p className="text-sm text-primary/90 font-medium mb-2">Your choice:</p>
                <p>{selectedChoice.text}</p>
              </div>

              <div className="p-4 border border-primary/20 rounded-md bg-black/50">
                <p className="text-sm text-muted-foreground mb-2">Consequence:</p>
                <p>{selectedChoice.consequence}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { Clock, ArrowRight, CheckCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type TemporalPuzzleProps = {
  puzzle: any
  onSolved: () => void
}

export function TemporalPuzzle({ puzzle, onSolved }: TemporalPuzzleProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})
  const [solved, setSolved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { realityState, recordMemory } = useReality()
  const { playSound, audioEnabled } = useAudio()
  const [glitchActive, setGlitchActive] = useState(false)

  // Apply random glitch effects based on reality distortion
  useEffect(() => {
    if (realityState.realityDistortion < 20) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchActive(true)
        if (audioEnabled) {
          playSound("glitch", { volume: 0.2 })
        }
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [realityState.realityDistortion, playSound, audioEnabled])

  const handleInputChange = (step: number, value: string) => {
    setUserInputs({
      ...userInputs,
      [step]: value,
    })
    setError(null)
  }

  const checkStep = (step: number) => {
    const input = userInputs[step]
    const currentStep = puzzle.steps[step]

    if (!input || !input.trim()) {
      setError("Please enter an answer")
      return false
    }

    const isCorrect = input.toLowerCase().trim() === currentStep.answer.toLowerCase().trim()

    if (isCorrect) {
      if (audioEnabled) {
        playSound("memory", { volume: 0.3 })
      }

      // Record progress
      recordMemory(`puzzle-${puzzle.id}-step-${step}`, {
        completed: true,
        timestamp: new Date().toISOString(),
      })

      return true
    } else {
      if (audioEnabled) {
        playSound("glitch", { volume: 0.2 })
      }

      setError("Incorrect answer. Try again.")
      return false
    }
  }

  const handleNextStep = () => {
    if (checkStep(activeStep)) {
      if (activeStep < puzzle.steps.length - 1) {
        setActiveStep(activeStep + 1)
        setError(null)
      } else {
        // Puzzle completed
        setSolved(true)
        if (audioEnabled) {
          playSound("static", { volume: 0.4 })
        }

        // Record completion
        recordMemory(`puzzle-${puzzle.id}-solved`, {
          solved: true,
          timestamp: new Date().toISOString(),
        })

        // Call the onSolved callback
        onSolved()
      }
    }
  }

  const resetPuzzle = () => {
    setActiveStep(0)
    setUserInputs({})
    setError(null)
    setSolved(false)
    if (audioEnabled) {
      playSound("door", { volume: 0.2 })
    }
  }

  return (
    <Card className={cn("border-primary/30 bg-black/70", glitchActive && "glitch-effect")}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-primary/90">{puzzle.name}</CardTitle>
            <CardDescription>
              {puzzle.description || "A temporal puzzle that spans across the narrative"}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 bg-primary/20 px-2 py-1 rounded-md">
            <Clock className="h-4 w-4 text-primary/80" />
            <span className="text-sm font-medium">
              Step {activeStep + 1} of {puzzle.steps?.length || 1}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!solved ? (
          <>
            <div className="p-4 border border-primary/40 rounded-md bg-black/50">
              <h3 className="text-lg font-medium mb-2">
                {puzzle.steps?.[activeStep]?.title || `Step ${activeStep + 1}`}
              </h3>
              <p className="mb-4">{puzzle.steps?.[activeStep]?.content || "No content available for this step."}</p>

              {puzzle.steps?.[activeStep]?.hint && (
                <div className="mt-2 p-2 border border-primary/20 rounded-md bg-primary/5">
                  <p className="text-sm text-primary/80 italic">Hint: {puzzle.steps[activeStep].hint}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Input
                value={userInputs[activeStep] || ""}
                onChange={(e) => handleInputChange(activeStep, e.target.value)}
                placeholder="Enter your answer..."
                className="bg-black/50 border-primary/30"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex justify-between">
              <Button onClick={handleNextStep} className="bg-primary hover:bg-primary/90">
                {activeStep < (puzzle.steps?.length || 1) - 1 ? (
                  <>
                    Next Step <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  "Complete Puzzle"
                )}
              </Button>

              <Button variant="outline" onClick={resetPuzzle} className="border-primary/30 hover:border-primary/60">
                <RefreshCw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Puzzle solved successfully!</span>
            </div>

            <div className="p-4 border border-green-500/30 rounded-md bg-green-950/10">
              <h3 className="text-lg font-medium text-green-500/90 mb-2">Reward</h3>
              <p>{puzzle.reward || "You have successfully solved the puzzle."}</p>
            </div>
          </div>
        )}
      </CardContent>

      {!solved && (
        <CardFooter>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Progress:</h4>
              <span className="text-sm text-muted-foreground">
                {
                  Object.keys(userInputs).filter(
                    (key) => userInputs[Number.parseInt(key)] && checkStep(Number.parseInt(key)),
                  ).length
                }{" "}
                / {puzzle.steps?.length || 1} steps completed
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${
                    (Object.keys(userInputs).filter(
                      (key) => userInputs[Number.parseInt(key)] && checkStep(Number.parseInt(key)),
                    ).length /
                      (puzzle.steps?.length || 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type UnreliableUIProps = {
  data: {
    title: string
    description?: string
    type: "button" | "input" | "form"
    content: any
    realityEffect?: {
      distortion: number
      mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
    }
  }
  id: string
}

export function UnreliableUI({ data, id }: UnreliableUIProps) {
  const { realityState, distortReality, changeMentalState, recordMemory } = useReality()
  const { playSound } = useAudio()
  const [interactionCount, setInteractionCount] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [buttonText, setButtonText] = useState(data.content.buttonText || "Submit")

  // Random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)

        // Randomly change button text
        if (data.type === "button" && Math.random() > 0.7) {
          const alternateTexts = data.content.alternateTexts || ["Submit", "Continue", "Proceed", "I understand"]
          setButtonText(alternateTexts[Math.floor(Math.random() * alternateTexts.length)])
        }
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [data.type, data.content])

  const handleInteraction = () => {
    setInteractionCount((prev) => prev + 1)
    playSound("glitch", { volume: 0.2 })

    // Apply glitch effect
    setGlitchActive(true)
    setTimeout(() => setGlitchActive(false), 300)

    // Different behavior based on interaction count
    if (interactionCount === 0) {
      // First interaction - normal behavior
      if (data.type === "input" || data.type === "form") {
        setResponse(data.content.initialResponse)
      }
    } else if (interactionCount === 1) {
      // Second interaction - slight unreliability
      if (data.type === "input" || data.type === "form") {
        setResponse(data.content.secondaryResponse || "Something doesn't feel right...")
      }

      // Apply minor reality effect
      distortReality(10)
    } else {
      // Third+ interaction - full unreliability
      if (data.type === "input" || data.type === "form") {
        setResponse(data.content.finalResponse || "You can't trust what you're seeing.")
      }

      // Apply major reality effect
      if (data.realityEffect) {
        distortReality(data.realityEffect.distortion)
        if (data.realityEffect.mentalState) {
          changeMentalState(data.realityEffect.mentalState)
        }
      }

      // Record the interaction
      recordMemory(`${id}-unreliable`, {
        interactionCount,
        inputValue,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const renderUI = () => {
    switch (data.type) {
      case "button":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{data.content.prompt}</p>

            <Button
              variant={interactionCount > 1 ? "default" : "outline"}
              className={cn(
                interactionCount > 1 ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:border-primary/60",
                glitchActive && "glitch-effect",
              )}
              onClick={handleInteraction}
            >
              {buttonText}
            </Button>

            {interactionCount > 0 && data.content.responses && (
              <p className={cn("mt-4 text-sm", interactionCount > 1 && "text-red-400/90 italic")}>
                {data.content.responses[Math.min(interactionCount - 1, data.content.responses.length - 1)]}
              </p>
            )}
          </div>
        )

      case "input":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{data.content.prompt}</p>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={data.content.placeholder || "Enter your response..."}
                className={cn("bg-black/50 border-primary/30 focus:border-primary/60", glitchActive && "glitch-effect")}
              />

              <Button
                variant="outline"
                className="border-primary/30 hover:border-primary/60"
                onClick={handleInteraction}
              >
                Submit
              </Button>
            </div>

            {response && (
              <div
                className={cn(
                  "p-3 border rounded-md mt-4",
                  interactionCount > 1 ? "border-red-500/30 bg-red-950/20" : "border-primary/30",
                )}
              >
                <p className={interactionCount > 1 ? "text-red-400/90" : ""}>{response}</p>
              </div>
            )}
          </div>
        )

      case "form":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{data.content.prompt}</p>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                handleInteraction()
              }}
            >
              {data.content.fields.map((field: any, index: number) => (
                <div key={index} className="space-y-1">
                  <label className="text-sm font-medium">{field.label}</label>
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder || ""}
                    className={cn(
                      "bg-black/50 border-primary/30 focus:border-primary/60",
                      glitchActive && index === 0 && "glitch-effect",
                    )}
                    onChange={(e) => {
                      if (index === 0) {
                        setInputValue(e.target.value)
                      }
                    }}
                  />
                </div>
              ))}

              <Button type="submit" variant="outline" className="border-primary/30 hover:border-primary/60 mt-2">
                Submit
              </Button>
            </form>

            {response && (
              <div
                className={cn(
                  "p-3 border rounded-md mt-4",
                  interactionCount > 1 ? "border-red-500/30 bg-red-950/20" : "border-primary/30",
                )}
              >
                <p className={interactionCount > 1 ? "text-red-400/90" : ""}>{response}</p>
              </div>
            )}
          </div>
        )

      default:
        return <p>Unknown UI type</p>
    }
  }

  return (
    <Card className="my-6 border-primary/30 bg-black/70 shadow-md">
      <CardHeader>
        <CardTitle className={cn("text-primary/90", glitchActive && "glitch-effect")}>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>{renderUI()}</CardContent>
    </Card>
  )
}

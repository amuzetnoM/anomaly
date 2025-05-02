"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type PerceptionTestProps = {
  data: {
    title: string
    description?: string
    type: "visual" | "auditory" | "pattern"
    content: any
    realityEffect?: {
      distortion: number
      mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
    }
    revealTruth?: boolean
  }
  id: string
}

export function PerceptionTest({ data, id }: PerceptionTestProps) {
  const { realityState, distortReality, changeMentalState, recordMemory, getMemory } = useReality()
  const { playSound } = useAudio()
  const [isComplete, setIsComplete] = useState(false)
  const [userResponse, setUserResponse] = useState<any>(null)
  const [showTruth, setShowTruth] = useState(false)
  const [distortionLevel, setDistortionLevel] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check if test was completed before
  useEffect(() => {
    const savedState = getMemory(id)
    if (savedState?.isComplete) {
      setIsComplete(true)
      setUserResponse(savedState.response)
      if (data.revealTruth) {
        setShowTruth(true)
      }
    }
  }, [id, data, getMemory])

  // Initialize test
  useEffect(() => {
    if (data.type === "visual" && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the visual test
      if (data.content.type === "hidden-image") {
        // Load and draw the image
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = data.content.imageUrl || "/placeholder.svg?height=300&width=400"

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          // Apply distortion
          applyDistortion(ctx, canvas.width, canvas.height, distortionLevel)
        }
      } else if (data.content.type === "pattern") {
        // Draw a pattern with a hidden message or symbol
        drawPattern(ctx, canvas.width, canvas.height, data.content.pattern, distortionLevel)
      }
    }

    // Play audio for auditory tests
    if (data.type === "auditory" && data.content.audioUrl) {
      playSound(data.content.audioId || "whisper", { volume: 0.3 })
    }
  }, [data, distortionLevel, playSound])

  // Apply visual distortion to canvas
  const applyDistortion = (ctx: CanvasRenderingContext2D, width: number, height: number, level: number) => {
    if (level < 0.1) return

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // Apply noise
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < level * 0.3) {
        data[i] = Math.random() * 255 // R
        data[i + 1] = Math.random() * 255 // G
        data[i + 2] = Math.random() * 255 // B
      }
    }

    // Put the modified data back
    ctx.putImageData(imageData, 0, 0)

    // Add glitch lines
    const lineCount = Math.floor(level * 10)
    ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
    ctx.lineWidth = 1

    for (let i = 0; i < lineCount; i++) {
      const y = Math.random() * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  // Draw pattern with hidden message
  const drawPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pattern: string,
    level: number,
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background pattern
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, width, height)

    // Draw grid pattern
    ctx.strokeStyle = "rgba(100, 100, 100, 0.3)"
    ctx.lineWidth = 1

    const gridSize = 20
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw hidden message
    ctx.font = "48px serif"
    ctx.fillStyle = `rgba(200, 50, 50, ${0.1 + (1 - level) * 0.4})`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(pattern, width / 2, height / 2)

    // Apply noise
    applyDistortion(ctx, width, height, level * 0.5)
  }

  const handleDistortionChange = (value: number[]) => {
    setDistortionLevel(value[0] / 100)
  }

  const handleSubmit = (response: any) => {
    setUserResponse(response)
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
      response,
      completedAt: new Date().toISOString(),
    })

    // Show truth if applicable
    if (data.revealTruth) {
      setTimeout(() => {
        setShowTruth(true)
      }, 2000)
    }
  }

  const renderTest = () => {
    switch (data.type) {
      case "visual":
        return (
          <div className="space-y-4">
            <canvas ref={canvasRef} width={400} height={300} className="w-full border border-primary/30 rounded-md" />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Adjust clarity:</p>
              <Slider defaultValue={[50]} max={100} step={1} onValueChange={handleDistortionChange} />
            </div>

            <div className="space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">What do you see in the image?</p>
              <div className="flex gap-2">
                {data.content.options.map((option: string) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="border-primary/30 hover:border-primary/60"
                    onClick={() => handleSubmit(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case "auditory":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Listen carefully to the audio. What do you hear?</p>

            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary/60"
              onClick={() => playSound(data.content.audioId || "whisper", { volume: 0.3 })}
            >
              Play Audio Again
            </Button>

            <div className="space-y-2 mt-4">
              <div className="flex flex-wrap gap-2">
                {data.content.options.map((option: string) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="border-primary/30 hover:border-primary/60"
                    onClick={() => handleSubmit(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case "pattern":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Study the pattern. What is the next element in the sequence?
            </p>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {data.content.sequence.map((item: string, index: number) => (
                <div
                  key={index}
                  className="h-12 w-12 flex items-center justify-center border border-primary/40 rounded-md"
                >
                  {item}
                </div>
              ))}
              <div className="h-12 w-12 flex items-center justify-center border border-primary/40 rounded-md border-dashed">
                ?
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.content.options.map((option: string) => (
                <Button
                  key={option}
                  variant="outline"
                  className="border-primary/30 hover:border-primary/60"
                  onClick={() => handleSubmit(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return <p>Unknown test type</p>
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
        {!isComplete ? (
          renderTest()
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-primary/90 font-medium mb-2">Your perception:</p>

            <div className="p-4 border border-primary/40 rounded-md">
              <p>{userResponse}</p>

              {showTruth && data.content.truth && data.content.truth !== userResponse && (
                <div className="mt-4 p-3 bg-red-950/30 border border-red-500/30 rounded-md">
                  <p className="text-red-400/90 text-sm italic">The truth: {data.content.truth}</p>
                </div>
              )}
            </div>

            {data.revealTruth && !showTruth && (
              <Button
                variant="outline"
                className="mt-4 border-primary/40 hover:border-primary/70"
                onClick={revealTruth}
              >
                Question Your Perception
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

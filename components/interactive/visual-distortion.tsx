"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { cn } from "@/lib/utils"

type VisualDistortionProps = {
  data: {
    title: string
    description?: string
    type: "image" | "text" | "environment"
    content: any
    realityEffect?: {
      distortion: number
      mentalState?: "anxious" | "paranoid" | "delusional" | "dissociative"
    }
  }
  id: string
}

export function VisualDistortion({ data, id }: VisualDistortionProps) {
  const { realityState, distortReality, changeMentalState } = useReality()
  const { playSound } = useAudio()
  const [distortionLevel, setDistortionLevel] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  // Initialize canvas for image distortion
  useEffect(() => {
    if (data.type === "image" && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Load and draw the image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = data.content.imageUrl || "/placeholder.svg?height=400&width=600"

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [data.type, data.content])

  // Animation loop for active distortions
  useEffect(() => {
    if (!isActive) return

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time
      }

      const deltaTime = time - previousTimeRef.current

      // Update distortion based on time
      if (deltaTime > 50) {
        // Update every 50ms
        previousTimeRef.current = time

        if (data.type === "image" && canvasRef.current) {
          applyImageDistortion()
        }
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isActive, data.type, distortionLevel])

  // Apply distortion to image
  const applyImageDistortion = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Apply different distortion effects based on level
    if (distortionLevel > 0.7) {
      // Heavy distortion - RGB shift and noise
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.05) {
          data[i] = Math.random() * 255 // R
          data[i + 1] = Math.random() * 255 // G
          data[i + 2] = Math.random() * 255 // B
        }

        // RGB shift
        if (i + 12 < data.length) {
          data[i] = data[i + 4] // R
          data[i + 1] = data[i + 8] // G
          data[i + 2] = data[i + 12] // B
        }
      }
    } else if (distortionLevel > 0.4) {
      // Medium distortion - wave effect
      const originalData = new Uint8ClampedArray(data)
      const amplitude = 10 * distortionLevel
      const frequency = 0.1
      const time = Date.now() * 0.001

      for (let y = 0; y < canvas.height; y++) {
        const displacement = Math.sin(y * frequency + time) * amplitude

        for (let x = 0; x < canvas.width; x++) {
          const sourceX = Math.floor(x + displacement)

          if (sourceX >= 0 && sourceX < canvas.width) {
            const targetIndex = (y * canvas.width + x) * 4
            const sourceIndex = (y * canvas.width + sourceX) * 4

            data[targetIndex] = originalData[sourceIndex] // R
            data[targetIndex + 1] = originalData[sourceIndex + 1] // G
            data[targetIndex + 2] = originalData[sourceIndex + 2] // B
            data[targetIndex + 3] = originalData[sourceIndex + 3] // A
          }
        }
      }
    } else if (distortionLevel > 0.1) {
      // Light distortion - color shift
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * (1 + distortionLevel * 0.2) // R
        data[i + 1] = data[i + 1] * (1 - distortionLevel * 0.1) // G
        data[i + 2] = data[i + 2] * (1 + distortionLevel * 0.1) // B
      }
    }

    // Put the modified data back
    ctx.putImageData(imageData, 0, 0)

    // Add glitch lines
    if (Math.random() > 0.7) {
      const lineCount = Math.floor(distortionLevel * 5)
      ctx.strokeStyle = "rgba(255, 0, 0, 0.5)"
      ctx.lineWidth = 1

      for (let i = 0; i < lineCount; i++) {
        const y = Math.random() * canvas.height
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }
  }

  const handleDistortionChange = (value: number[]) => {
    setDistortionLevel(value[0] / 100)

    // Apply reality effects based on distortion level
    if (value[0] > 70 && data.realityEffect) {
      distortReality(data.realityEffect.distortion * (value[0] / 100))
      if (data.realityEffect.mentalState) {
        changeMentalState(data.realityEffect.mentalState)
      }
    }
  }

  const toggleDistortion = () => {
    setIsActive(!isActive)

    if (!isActive) {
      playSound("static", { volume: 0.2 })
    }
  }

  const renderDistortion = () => {
    switch (data.type) {
      case "image":
        return (
          <div className="space-y-4">
            <div
              className={cn(
                "relative border border-primary/30 rounded-md overflow-hidden",
                isActive && distortionLevel > 0.5 && "glitch-effect",
              )}
            >
              <canvas ref={canvasRef} className="w-full h-auto" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Distortion Level:</p>
                <span className="text-sm">{Math.round(distortionLevel * 100)}%</span>
              </div>

              <Slider
                value={[distortionLevel * 100]}
                max={100}
                step={1}
                onValueChange={handleDistortionChange}
                disabled={!isActive}
              />
            </div>

            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:border-primary/60"}
              onClick={toggleDistortion}
            >
              {isActive ? "Stop Distortion" : "Start Distortion"}
            </Button>
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <div className={cn("p-4 border border-primary/30 rounded-md", isActive && "glitch-effect")}>
              <p
                className={cn(
                  "transition-all duration-300",
                  isActive && distortionLevel > 0.3 && "text-distortion",
                  isActive && distortionLevel > 0.7 && "text-red-400/90",
                )}
                data-text={data.content.text}
              >
                {data.content.text}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Distortion Level:</p>
                <span className="text-sm">{Math.round(distortionLevel * 100)}%</span>
              </div>

              <Slider
                value={[distortionLevel * 100]}
                max={100}
                step={1}
                onValueChange={handleDistortionChange}
                disabled={!isActive}
              />
            </div>

            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:border-primary/60"}
              onClick={toggleDistortion}
            >
              {isActive ? "Stop Distortion" : "Start Distortion"}
            </Button>
          </div>
        )

      case "environment":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-2">
              {isActive
                ? "The environment around you is shifting. Reality feels unstable."
                : "The environment appears normal. For now."}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Distortion Level:</p>
                <span className="text-sm">{Math.round(distortionLevel * 100)}%</span>
              </div>

              <Slider
                value={[distortionLevel * 100]}
                max={100}
                step={1}
                onValueChange={handleDistortionChange}
                disabled={!isActive}
              />
            </div>

            <Button
              variant={isActive ? "default" : "outline"}
              className={isActive ? "bg-primary hover:bg-primary/90" : "border-primary/30 hover:border-primary/60"}
              onClick={toggleDistortion}
            >
              {isActive ? "Stop Distortion" : "Start Distortion"}
            </Button>

            {isActive && distortionLevel > 0.5 && (
              <div className="mt-4 p-3 border border-red-500/30 rounded-md bg-red-950/20">
                <p className="text-red-400/90 text-sm italic">
                  {data.content.warningMessage || "Warning: Reality perception compromised."}
                </p>
              </div>
            )}
          </div>
        )

      default:
        return <p>Unknown distortion type</p>
    }
  }

  return (
    <Card className="my-6 border-primary/30 bg-black/70 shadow-md">
      <CardHeader>
        <CardTitle className={cn("text-primary/90", isActive && distortionLevel > 0.7 && "glitch-effect")}>
          {data.title}
        </CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>{renderDistortion()}</CardContent>
    </Card>
  )
}

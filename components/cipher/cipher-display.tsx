"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { Eye, EyeOff, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

type CipherDisplayProps = {
  cipher: any
  showSolution?: boolean
  onSolved?: () => void
}

export function CipherDisplay({ cipher, showSolution = false, onSolved }: CipherDisplayProps) {
  const { realityState, recordMemory } = useReality()
  const { playSound, audioEnabled } = useAudio()
  const [revealedClues, setRevealedClues] = useState<number[]>([])
  const [showAllClues, setShowAllClues] = useState(false)
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

  const revealClue = (index: number) => {
    if (!revealedClues.includes(index)) {
      setRevealedClues([...revealedClues, index])
      if (audioEnabled) {
        playSound("memory", { volume: 0.3 })
      }

      // Record that this clue was found
      recordMemory(`cipher-${cipher.id}-clue-${index}`, {
        found: true,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const toggleAllClues = () => {
    setShowAllClues(!showAllClues)
    if (!showAllClues && audioEnabled) {
      playSound("static", { volume: 0.2 })
    }
  }

  // Apply cipher-specific distortion to text
  const applyCipherEffect = (text: string): string => {
    if (!cipher || !text) return text

    switch (cipher.type) {
      case "caesar":
        // Simple Caesar shift for display purposes
        const shift = Number.parseInt(cipher.key) || 3
        return text
          .split("")
          .map((char) => {
            if (char.match(/[a-z]/i)) {
              const code = char.charCodeAt(0)
              const isUpperCase = code >= 65 && code <= 90
              const base = isUpperCase ? 65 : 97
              return String.fromCharCode(((code - base + shift) % 26) + base)
            }
            return char
          })
          .join("")

      case "substitution":
        // Simple character substitution
        if (!cipher.key) return text
        const substitutions = JSON.parse(cipher.key || "{}")
        return text
          .split("")
          .map((char) => {
            return substitutions[char.toLowerCase()] || char
          })
          .join("")

      case "binary":
        // Convert to binary
        return text
          .split("")
          .map((char) => {
            return char.charCodeAt(0).toString(2).padStart(8, "0")
          })
          .join(" ")

      case "morse":
        // Convert to Morse code
        const morseCode: Record<string, string> = {
          a: ".-",
          b: "-...",
          c: "-.-.",
          d: "-..",
          e: ".",
          f: "..-.",
          g: "--.",
          h: "....",
          i: "..",
          j: ".---",
          k: "-.-",
          l: ".-..",
          m: "--",
          n: "-.",
          o: "---",
          p: ".--.",
          q: "--.-",
          r: ".-.",
          s: "...",
          t: "-",
          u: "..-",
          v: "...-",
          w: ".--",
          x: "-..-",
          y: "-.--",
          z: "--..",
          "0": "-----",
          "1": ".----",
          "2": "..---",
          "3": "...--",
          "4": "....-",
          "5": ".....",
          "6": "-....",
          "7": "--...",
          "8": "---..",
          "9": "----.",
          " ": "/",
        }
        return text
          .toLowerCase()
          .split("")
          .map((char) => {
            return morseCode[char] || char
          })
          .join(" ")

      default:
        return text
    }
  }

  return (
    <Card className={cn("border-primary/30 bg-black/70", glitchActive && "glitch-effect")}>
      <CardHeader>
        <CardTitle className="text-primary/90">{cipher.name}</CardTitle>
        <CardDescription>{cipher.description || `A ${cipher.type} cipher that needs to be solved`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border border-primary/40 rounded-md bg-black/50">
          <p className="font-mono text-lg">
            {applyCipherEffect(cipher.content || "This is encrypted content that needs to be decoded.")}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Clues</h3>
            <Button variant="ghost" size="sm" onClick={toggleAllClues} className="text-primary/80">
              {showAllClues ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" /> Hide All
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" /> Show All
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            {cipher.clues?.map((clue: any, index: number) => (
              <div
                key={index}
                className={cn(
                  "p-3 border rounded-md transition-all duration-300",
                  revealedClues.includes(index) || showAllClues || !clue.isHidden
                    ? "border-primary/40"
                    : "border-primary/20 bg-black/30",
                )}
              >
                {revealedClues.includes(index) || showAllClues || !clue.isHidden ? (
                  <>
                    <p>{clue.text}</p>
                    {clue.location && <p className="text-xs text-muted-foreground mt-1">Found in: {clue.location}</p>}
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Hidden clue</p>
                    <Button variant="ghost" size="sm" onClick={() => revealClue(index)} className="text-primary/80">
                      <Lightbulb className="h-4 w-4 mr-1" /> Reveal
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {(!cipher.clues || cipher.clues.length === 0) && (
              <div className="p-3 border border-primary/20 rounded-md">
                <p className="text-muted-foreground">No clues available for this cipher.</p>
              </div>
            )}
          </div>
        </div>

        {showSolution && cipher.solution && (
          <div className="p-4 border border-green-500/30 rounded-md bg-green-950/10">
            <h3 className="text-lg font-medium text-green-500/90 mb-2">Solution</h3>
            <p>{cipher.solution}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

type CipherInputProps = {
  cipherId: string
  solution: string
  onSolved: () => void
  maxAttempts?: number
}

export function CipherInput({ cipherId, solution, onSolved, maxAttempts = 3 }: CipherInputProps) {
  const [attempt, setAttempt] = useState("")
  const [attempts, setAttempts] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { realityState, recordMemory } = useReality()
  const { playSound, audioEnabled } = useAudio()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!attempt.trim()) {
      setError("Please enter a solution")
      return
    }

    // Check if already attempted
    if (attempts.includes(attempt)) {
      setError("You've already tried this solution")
      return
    }

    // Add to attempts
    const newAttempts = [...attempts, attempt]
    setAttempts(newAttempts)

    // Check solution
    const isCorrect = attempt.toLowerCase().trim() === solution.toLowerCase().trim()

    if (isCorrect) {
      setSolved(true)
      setError(null)
      if (audioEnabled) {
        playSound("static", { volume: 0.3 })
      }

      // Record the solution in memory
      recordMemory(`cipher-${cipherId}-solved`, {
        solved: true,
        attempts: newAttempts.length,
        timestamp: new Date().toISOString(),
      })

      // Call the onSolved callback
      onSolved()
    } else {
      if (audioEnabled) {
        playSound("glitch", { volume: 0.2 })
      }

      setError(`Incorrect solution. ${maxAttempts - newAttempts.length} attempts remaining.`)

      // Apply reality distortion based on failed attempts
      if (newAttempts.length >= maxAttempts) {
        setError("No more attempts remaining. The solution will be revealed.")

        // Record the failure in memory
        recordMemory(`cipher-${cipherId}-failed`, {
          solved: false,
          attempts: newAttempts.length,
          timestamp: new Date().toISOString(),
        })

        // After a delay, reveal the solution
        setTimeout(() => {
          setSolved(true)
          onSolved()
        }, 3000)
      }
    }

    // Clear the input
    setAttempt("")
  }

  const resetAttempts = () => {
    setAttempts([])
    setError(null)
    if (audioEnabled) {
      playSound("door", { volume: 0.2 })
    }
  }

  return (
    <Card className="border-primary/30 bg-black/70">
      <CardHeader>
        <CardTitle className="text-primary/90">Solve the Cipher</CardTitle>
        <CardDescription>Enter your solution below. You have {maxAttempts} attempts.</CardDescription>
      </CardHeader>
      <CardContent>
        {!solved ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                value={attempt}
                onChange={(e) => {
                  setAttempt(e.target.value)
                  setError(null)
                }}
                placeholder="Enter your solution..."
                className="bg-black/50 border-primary/30"
                disabled={attempts.length >= maxAttempts}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-between">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={attempts.length >= maxAttempts}
              >
                Submit Solution
              </Button>

              {attempts.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAttempts}
                  className="border-primary/30 hover:border-primary/60"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Reset Attempts
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Cipher solved successfully!</span>
            </div>

            <div className="p-3 border border-green-500/30 rounded-md bg-green-950/10">
              <p className="font-medium">Solution: {solution}</p>
            </div>
          </div>
        )}
      </CardContent>

      {attempts.length > 0 && !solved && (
        <CardFooter>
          <div className="w-full">
            <h4 className="text-sm font-medium mb-2">Previous Attempts:</h4>
            <div className="space-y-1">
              {attempts.map((a, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border border-primary/20 rounded-md">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

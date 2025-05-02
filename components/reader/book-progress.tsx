"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useReality } from "../reality-provider"
import { BookOpen, CheckCircle, Lock, Award } from "lucide-react"

type BookProgressProps = {
  bookData: any
}

export function BookProgress({ bookData }: BookProgressProps) {
  const { realityState } = useReality()
  const [progress, setProgress] = useState({
    chaptersRead: 0,
    totalChapters: 0,
    ciphersSolved: 0,
    totalCiphers: 0,
    puzzlesSolved: 0,
    totalPuzzles: 0,
  })

  // Calculate progress whenever reality state changes
  useEffect(() => {
    if (!bookData) return

    // Count total chapters
    let totalChapters = 0
    bookData.booklets?.forEach((booklet: any) => {
      totalChapters += booklet.chapters?.length || 0
    })

    // Count completed chapters
    const chaptersRead = Object.keys(realityState.memories).filter((key) => key.startsWith("completed-")).length

    // Count ciphers
    const totalCiphers = bookData.ciphers?.length || 0
    const ciphersSolved = Object.keys(realityState.memories).filter(
      (key) => key.includes("-cipher-") && key.includes("-solved"),
    ).length

    // Count puzzles
    const totalPuzzles = bookData.puzzles?.length || 0
    const puzzlesSolved = Object.keys(realityState.memories).filter(
      (key) => key.includes("-puzzle-") && key.includes("-solved"),
    ).length

    setProgress({
      chaptersRead,
      totalChapters,
      ciphersSolved,
      totalCiphers,
      puzzlesSolved,
      totalPuzzles,
    })
  }, [realityState, bookData])

  // Calculate overall progress percentage
  const overallProgress = Math.round(
    ((progress.chaptersRead / Math.max(1, progress.totalChapters)) * 0.6 +
      (progress.ciphersSolved / Math.max(1, progress.totalCiphers)) * 0.2 +
      (progress.puzzlesSolved / Math.max(1, progress.totalPuzzles)) * 0.2) *
      100,
  )

  return (
    <Card className="border-primary/30 bg-black/70">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-primary/80" />
          Reading Progress
        </CardTitle>
        <CardDescription>Your journey through the book</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-sm font-medium">Chapters Read</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>{progress.chaptersRead}</span>
              <span>of</span>
              <span>{progress.totalChapters}</span>
            </div>
            <Progress value={(progress.chaptersRead / Math.max(1, progress.totalChapters)) * 100} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm font-medium">Ciphers Solved</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>{progress.ciphersSolved}</span>
              <span>of</span>
              <span>{progress.totalCiphers}</span>
            </div>
            <Progress value={(progress.ciphersSolved / Math.max(1, progress.totalCiphers)) * 100} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm font-medium">Puzzles Solved</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>{progress.puzzlesSolved}</span>
              <span>of</span>
              <span>{progress.totalPuzzles}</span>
            </div>
            <Progress value={(progress.puzzlesSolved / Math.max(1, progress.totalPuzzles)) * 100} className="h-1.5" />
          </div>
        </div>

        {/* Achievements section could be added here */}
      </CardContent>
    </Card>
  )
}

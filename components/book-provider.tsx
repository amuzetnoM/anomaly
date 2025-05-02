"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { chapters } from "@/lib/book-data"
import { RealityProvider } from "./reality-provider"
import { AudioProvider } from "./audio-provider"

type BookProgress = {
  currentChapter: string
  completedChapters: string[]
  quizScores: Record<string, number>
  lastPosition: string
}

type BookContextType = {
  progress: BookProgress
  updateCurrentChapter: (chapterId: string) => void
  markChapterComplete: (chapterId: string) => void
  saveQuizScore: (quizId: string, score: number) => void
  savePosition: (position: string) => void
}

const defaultProgress: BookProgress = {
  currentChapter: chapters[0]?.id || "",
  completedChapters: [],
  quizScores: {},
  lastPosition: "",
}

const BookContext = createContext<BookContextType | undefined>(undefined)

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<BookProgress>(defaultProgress)

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("book-progress")
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (e) {
        console.error("Failed to parse saved progress", e)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("book-progress", JSON.stringify(progress))
  }, [progress])

  const updateCurrentChapter = (chapterId: string) => {
    setProgress((prev) => ({
      ...prev,
      currentChapter: chapterId,
    }))
  }

  const markChapterComplete = (chapterId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedChapters: [...new Set([...prev.completedChapters, chapterId])],
    }))
  }

  const saveQuizScore = (quizId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: Math.max(prev.quizScores[quizId] || 0, score),
      },
    }))
  }

  const savePosition = (position: string) => {
    setProgress((prev) => ({
      ...prev,
      lastPosition: position,
    }))
  }

  return (
    <BookContext.Provider
      value={{
        progress,
        updateCurrentChapter,
        markChapterComplete,
        saveQuizScore,
        savePosition,
      }}
    >
      <RealityProvider>
        <AudioProvider>{children}</AudioProvider>
      </RealityProvider>
    </BookContext.Provider>
  )
}

export function useBook() {
  const context = useContext(BookContext)
  if (context === undefined) {
    throw new Error("useBook must be used within a BookProvider")
  }
  return context
}

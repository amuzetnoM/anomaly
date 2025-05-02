"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the mental states a character can be in
type MentalState = "neutral" | "anxious" | "paranoid" | "delusional" | "dissociative"

// Define the reality state structure
type RealityState = {
  mentalState: MentalState
  trustLevel: number // 0-100, how much the reader should trust the narrator
  realityDistortion: number // 0-100, how distorted reality appears
  memories: Record<string, any> // Stores memory fragments and their states
  choices: Record<string, any> // Stores player choices that affect reality
}

type RealityContextType = {
  realityState: RealityState
  setRealityState: React.Dispatch<React.SetStateAction<RealityState>>
  distortReality: (amount: number) => void
  changeMentalState: (newState: MentalState) => void
  recordMemory: (id: string, data: any) => void
  recordChoice: (id: string, choice: any) => void
  getMemory: (id: string) => any
  getChoice: (id: string) => any
  resetReality: () => void
}

const defaultRealityState: RealityState = {
  mentalState: "neutral",
  trustLevel: 100,
  realityDistortion: 0,
  memories: {},
  choices: {},
}

const RealityContext = createContext<RealityContextType | undefined>(undefined)

export function RealityProvider({ children }: { children: React.ReactNode }) {
  const [realityState, setRealityState] = useState<RealityState>(defaultRealityState)

  // Load reality state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("reality-state")
    if (savedState) {
      try {
        setRealityState(JSON.parse(savedState))
      } catch (e) {
        console.error("Failed to parse saved reality state", e)
      }
    }
  }, [])

  // Save reality state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("reality-state", JSON.stringify(realityState))
  }, [realityState])

  // Increase or decrease reality distortion
  const distortReality = (amount: number) => {
    setRealityState((prev) => ({
      ...prev,
      realityDistortion: Math.max(0, Math.min(100, prev.realityDistortion + amount)),
    }))
  }

  // Change the mental state
  const changeMentalState = (newState: MentalState) => {
    setRealityState((prev) => ({
      ...prev,
      mentalState: newState,
    }))
  }

  // Record a memory fragment
  const recordMemory = (id: string, data: any) => {
    setRealityState((prev) => ({
      ...prev,
      memories: {
        ...prev.memories,
        [id]: data,
      },
    }))
  }

  // Record a player choice
  const recordChoice = (id: string, choice: any) => {
    setRealityState((prev) => ({
      ...prev,
      choices: {
        ...prev.choices,
        [id]: choice,
      },
    }))
  }

  // Get a memory fragment
  const getMemory = (id: string) => {
    return realityState.memories[id]
  }

  // Get a player choice
  const getChoice = (id: string) => {
    return realityState.choices[id]
  }

  // Reset reality to default state
  const resetReality = () => {
    setRealityState(defaultRealityState)
  }

  return (
    <RealityContext.Provider
      value={{
        realityState,
        setRealityState,
        distortReality,
        changeMentalState,
        recordMemory,
        recordChoice,
        getMemory,
        getChoice,
        resetReality,
      }}
    >
      {children}
    </RealityContext.Provider>
  )
}

export function useReality() {
  const context = useContext(RealityContext)
  if (context === undefined) {
    throw new Error("useReality must be used within a RealityProvider")
  }
  return context
}

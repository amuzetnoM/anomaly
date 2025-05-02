"use client"

import type React from "react"
import { createContext, useContext, useRef, useEffect, useState } from "react"

type AudioOptions = {
  volume?: number
  loop?: boolean
  fadeIn?: boolean
  fadeOut?: boolean
  fadeTime?: number
}

type AudioContextType = {
  playSound: (id: string, options?: AudioOptions) => void
  stopSound: (id: string, options?: AudioOptions) => void
  setVolume: (id: string, volume: number) => void
  isPlaying: (id: string) => boolean
  audioEnabled: boolean
  setAudioEnabled: (enabled: boolean) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

// Map of sound IDs to their URLs
const SOUND_MAP: Record<string, string> = {
  ambient: "/sounds/ambient.mp3",
  glitch: "/sounds/glitch.mp3",
  heartbeat: "/sounds/heartbeat.mp3",
  whisper: "/sounds/whisper.mp3",
  door: "/sounds/door.mp3",
  static: "/sounds/static.mp3",
  memory: "/sounds/memory.mp3",
  chapter1: "/sounds/chapter1.mp3",
  chapter2: "/sounds/chapter2.mp3",
  chapter3: "/sounds/chapter3.mp3",
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioElements = useRef<Record<string, HTMLAudioElement>>({})
  const [audioInitialized, setAudioInitialized] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioLoadErrors, setAudioLoadErrors] = useState<Record<string, boolean>>({})

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements for each sound
    Object.entries(SOUND_MAP).forEach(([id, url]) => {
      try {
        const audio = new Audio()

        // Handle loading errors
        audio.addEventListener("error", (e) => {
          console.warn(`Failed to load audio: ${id}`, e)
          setAudioLoadErrors((prev) => ({ ...prev, [id]: true }))
        })

        audio.src = url
        audio.preload = "none"
        audioElements.current[id] = audio
      } catch (error) {
        console.warn(`Error creating audio element for ${id}:`, error)
        setAudioLoadErrors((prev) => ({ ...prev, [id]: true }))
      }
    })

    setAudioInitialized(true)

    // Cleanup function
    return () => {
      Object.values(audioElements.current).forEach((audio) => {
        try {
          audio.pause()
          audio.src = ""
        } catch (error) {
          console.warn("Error cleaning up audio:", error)
        }
      })
    }
  }, [])

  const playSound = (id: string, options: AudioOptions = {}) => {
    if (!audioInitialized || !audioEnabled || audioLoadErrors[id]) return

    const audio = audioElements.current[id]
    if (!audio) {
      console.warn(`Sound with ID "${id}" not found`)
      return
    }

    try {
      // Set options
      audio.loop = options.loop || false
      audio.volume = options.volume !== undefined ? options.volume : 1

      // Handle fade in
      if (options.fadeIn) {
        const fadeTime = options.fadeTime || 1000
        audio.volume = 0
        const fadeStep = (options.volume || 1) / (fadeTime / 50)

        const playPromise = audio.play()

        // Handle play promise to avoid uncaught promise rejection
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Error playing sound ${id}:`, error)
            setAudioLoadErrors((prev) => ({ ...prev, [id]: true }))
          })
        }

        let currentVolume = 0
        const fadeInterval = setInterval(() => {
          currentVolume += fadeStep
          if (currentVolume >= (options.volume || 1)) {
            audio.volume = options.volume || 1
            clearInterval(fadeInterval)
          } else {
            audio.volume = currentVolume
          }
        }, 50)
      } else {
        const playPromise = audio.play()

        // Handle play promise to avoid uncaught promise rejection
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Error playing sound ${id}:`, error)
            setAudioLoadErrors((prev) => ({ ...prev, [id]: true }))
          })
        }
      }
    } catch (error) {
      console.warn(`Error playing sound ${id}:`, error)
      setAudioLoadErrors((prev) => ({ ...prev, [id]: true }))
    }
  }

  const stopSound = (id: string, options: AudioOptions = {}) => {
    if (!audioInitialized || !audioEnabled || audioLoadErrors[id]) return

    const audio = audioElements.current[id]
    if (!audio) {
      console.warn(`Sound with ID "${id}" not found`)
      return
    }

    try {
      // Handle fade out
      if (options.fadeOut) {
        const fadeTime = options.fadeTime || 1000
        const initialVolume = audio.volume
        const fadeStep = initialVolume / (fadeTime / 50)

        let currentVolume = initialVolume
        const fadeInterval = setInterval(() => {
          currentVolume -= fadeStep
          if (currentVolume <= 0) {
            audio.pause()
            audio.currentTime = 0
            audio.volume = initialVolume // Reset volume for next play
            clearInterval(fadeInterval)
          } else {
            audio.volume = currentVolume
          }
        }, 50)
      } else {
        audio.pause()
        audio.currentTime = 0
      }
    } catch (error) {
      console.warn(`Error stopping sound ${id}:`, error)
    }
  }

  const setVolume = (id: string, volume: number) => {
    if (!audioInitialized || !audioEnabled || audioLoadErrors[id]) return

    const audio = audioElements.current[id]
    if (!audio) {
      console.warn(`Sound with ID "${id}" not found`)
      return
    }

    try {
      audio.volume = Math.max(0, Math.min(1, volume))
    } catch (error) {
      console.warn(`Error setting volume for sound ${id}:`, error)
    }
  }

  const isPlaying = (id: string) => {
    if (!audioInitialized || !audioEnabled || audioLoadErrors[id]) return false

    const audio = audioElements.current[id]
    if (!audio) {
      console.warn(`Sound with ID "${id}" not found`)
      return false
    }

    try {
      return !audio.paused
    } catch (error) {
      console.warn(`Error checking if sound ${id} is playing:`, error)
      return false
    }
  }

  return (
    <AudioContext.Provider
      value={{
        playSound,
        stopSound,
        setVolume,
        isPlaying,
        audioEnabled,
        setAudioEnabled,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

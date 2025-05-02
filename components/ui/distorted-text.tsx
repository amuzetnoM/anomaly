"use client"

import { useState, useEffect } from "react"
import { useReality } from "../reality-provider"
import { cn } from "@/lib/utils"

interface DistortedTextProps {
  html: string
  distortionLevel: number
  unreliable?: boolean
}

export function DistortedText({ html, distortionLevel, unreliable = false }: DistortedTextProps) {
  const { realityState } = useReality()
  const [glitchActive, setGlitchActive] = useState(false)

  // Apply random glitch effects
  useEffect(() => {
    if (distortionLevel < 0.1) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 1 - distortionLevel) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 5000)

    return () => clearInterval(glitchInterval)
  }, [distortionLevel])

  // Apply distortion to text
  const distortText = (text: string): string => {
    if (distortionLevel < 0.1) return text

    // No distortion for low levels
    if (distortionLevel < 0.2) return text

    // Light distortion - replace some vowels
    if (distortionLevel < 0.4) {
      return text.replace(/[aeiou]/g, (char) => {
        return Math.random() > 0.7 ? char.toUpperCase() : char
      })
    }

    // Medium distortion - replace some letters with symbols
    if (distortionLevel < 0.6) {
      return text.replace(/[aeiou]/g, (char) => {
        const replacements: Record<string, string> = {
          a: "@",
          e: "3",
          i: "1",
          o: "0",
          u: "v",
        }
        return Math.random() > 0.6 ? replacements[char] || char : char
      })
    }

    // Heavy distortion - add random characters
    return text
      .split("")
      .map((char) => {
        if (Math.random() > 0.8) {
          const glitchChars = "@#$%&*!?<>[]{}"
          return char + glitchChars[Math.floor(Math.random() * glitchChars.length)]
        }
        return char
      })
      .join("")
  }

  // Process HTML to add distortion
  const processHtml = (html: string): string => {
    if (distortionLevel < 0.1) return html

    // Replace text nodes with distorted versions
    return html.replace(/>([^<]+)</g, (match, text) => {
      return `>${distortText(text)}<`
    })
  }

  const processedHtml = processHtml(html)

  return (
    <div
      className={cn(
        "transition-all duration-300",
        glitchActive && "glitch-effect",
        unreliable && "text-red-400/90 italic",
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}

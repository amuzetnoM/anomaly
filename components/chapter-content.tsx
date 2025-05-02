"use client"

import { useState, useEffect } from "react"
import { useReality } from "./reality-provider"
import { useAudio } from "./audio-provider"
import type { Chapter } from "@/lib/book-data"
import { InteractiveElement } from "./interactive-element"
import { DistortedText } from "./ui/distorted-text"
import { cn } from "@/lib/utils"

interface ChapterContentProps {
  chapter: Chapter
  textDistortion: number
}

export function ChapterContent({ chapter, textDistortion }: ChapterContentProps) {
  const { realityState, recordMemory } = useReality()
  const { playSound } = useAudio()
  const [revealedContent, setRevealedContent] = useState<string[]>([])
  const [metaNarrative, setMetaNarrative] = useState<string | null>(null)

  // Mark chapter as viewed
  useEffect(() => {
    recordMemory(`completed-${chapter.id}`, true)

    // Gradually reveal content for dramatic effect
    const contentParts = chapter.sections.map((section) => section.content)

    const revealInterval = setInterval(() => {
      setRevealedContent((prev) => {
        if (prev.length < contentParts.length) {
          return [...prev, contentParts[prev.length]]
        }
        clearInterval(revealInterval)
        return prev
      })
    }, 800)

    // Play sound effects
    if (chapter.soundEffects) {
      chapter.soundEffects.forEach((effect) => {
        setTimeout(() => {
          playSound(effect.sound, { volume: effect.volume || 0.3 })
        }, effect.delay || 0)
      })
    }

    // Meta-narrative moments
    if (chapter.metaNarrativeMoments && Math.random() > 0.7) {
      const randomMoment = chapter.metaNarrativeMoments[Math.floor(Math.random() * chapter.metaNarrativeMoments.length)]

      setTimeout(
        () => {
          setMetaNarrative(randomMoment)
          playSound("whisper", { volume: 0.2 })

          setTimeout(() => {
            setMetaNarrative(null)
          }, 5000)
        },
        10000 + Math.random() * 20000,
      ) // Random time between 10-30 seconds
    }

    return () => clearInterval(revealInterval)
  }, [chapter, recordMemory, playSound])

  return (
    <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
      <h1 className={cn("transition-all duration-300", realityState.realityDistortion > 50 && "glitch-effect")}>
        {chapter.title}
      </h1>

      {chapter.sections.map((section, index) => {
        // Only render sections that have been revealed
        if (!revealedContent[index]) return null

        return (
          <div key={index} className="mb-8 reality-shift">
            {section.title && (
              <h2
                className={cn(realityState.realityDistortion > 30 && index % 2 === 0 && "text-distortion")}
                data-text={section.title}
              >
                {section.title}
              </h2>
            )}

            <DistortedText
              html={section.content}
              distortionLevel={textDistortion}
              unreliable={section.unreliable || false}
            />

            {section.interactiveElements?.map((element, elemIndex) => (
              <InteractiveElement
                key={elemIndex}
                type={element.type}
                data={element.data}
                id={`${chapter.id}-${index}-${elemIndex}`}
              />
            ))}
          </div>
        )
      })}

      {/* Meta-narrative message */}
      {metaNarrative && (
        <div className="fixed bottom-10 right-10 max-w-xs p-4 bg-black/80 border border-primary/40 rounded-md text-primary/90 text-sm italic animate-pulse">
          {metaNarrative}
        </div>
      )}
    </div>
  )
}

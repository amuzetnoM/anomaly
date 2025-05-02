"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useReality } from "./reality-provider"
import { useAudio } from "./audio-provider"
import { chapters } from "@/lib/book-data"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BookOpen, CheckCircle2, Home, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function BookSidebar() {
  const pathname = usePathname()
  const { realityState } = useReality()
  const { playSound } = useAudio()
  const [glitchText, setGlitchText] = useState(false)

  // Apply glitch effects based on reality distortion
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 1 - realityState.realityDistortion / 200) {
        setGlitchText(true)
        playSound("glitch", { volume: 0.2 })
        setTimeout(() => setGlitchText(false), 150)
      }
    }, 10000)

    return () => clearInterval(glitchInterval)
  }, [realityState.realityDistortion, playSound])

  // Distort chapter titles based on reality state
  const getDistortedTitle = (title: string, index: number) => {
    if (realityState.realityDistortion < 20 || !glitchText) return title

    // Only distort some titles
    if ((index + 1) % 3 !== 0) return title

    // Create a distorted version of the title
    const distortionLevel = realityState.realityDistortion / 100

    if (distortionLevel > 0.7) {
      // Heavy distortion - replace with symbols or reversed text
      return title.split("").reverse().join("")
    } else if (distortionLevel > 0.4) {
      // Medium distortion - replace some letters
      return title.replace(/[aeiou]/g, (char) => {
        const replacements = ["@", "3", "1", "0", "v"]
        return replacements[Math.floor(Math.random() * replacements.length)]
      })
    } else {
      // Light distortion - add glitch class but keep text
      return title
    }
  }

  return (
    <SidebarProvider>
      <Sidebar
        className={cn(
          "transition-all duration-500",
          realityState.mentalState === "paranoid" && "paranoid-filter",
          realityState.mentalState === "delusional" && "delusional-filter",
        )}
      >
        <SidebarHeader className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-semibold">The Fractured Mind</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Cover</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {chapters.map((chapter, index) => {
              const isCompleted = realityState.memories[`completed-${chapter.id}`]
              const isActive = pathname === `/chapter/${chapter.id}`
              const isVisible = chapter.visibilityCondition
                ? realityState.choices[chapter.visibilityCondition.choiceId] === chapter.visibilityCondition.value
                : true

              if (!isVisible) return null

              return (
                <SidebarMenuItem key={chapter.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      glitchText && realityState.realityDistortion > 20 && "glitch-effect",
                      chapter.unreliable && "text-red-400/80",
                    )}
                  >
                    <Link href={`/chapter/${chapter.id}`} className="flex items-center justify-between">
                      <span>{getDistortedTitle(chapter.title, index)}</span>
                      <div className="flex items-center gap-1">
                        {chapter.unreliable && <EyeOff className="h-3 w-3 text-red-400/80" />}
                        {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>

          {/* Reality status indicator */}
          <div className="mt-auto p-4 border-t border-border/30">
            <div className="text-xs text-muted-foreground mb-1">Mental State</div>
            <div className="text-sm font-medium capitalize">{realityState.mentalState}</div>

            <div className="text-xs text-muted-foreground mt-3 mb-1">Reality Perception</div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${100 - realityState.realityDistortion}%` }}
              />
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

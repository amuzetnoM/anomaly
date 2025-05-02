"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useReality } from "../reality-provider"
import { useAudio } from "../audio-provider"
import { Book, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type BookletNavigationProps = {
  booklets: any[]
  currentBookletIndex: number
}

export function BookletNavigation({ booklets, currentBookletIndex }: BookletNavigationProps) {
  const { realityState } = useReality()
  const { playSound, audioEnabled } = useAudio()
  const [glitchActive, setGlitchActive] = useState(false)
  const pathname = usePathname()

  const prevBooklet = currentBookletIndex > 0 ? booklets[currentBookletIndex - 1] : null
  const nextBooklet = currentBookletIndex < booklets.length - 1 ? booklets[currentBookletIndex + 1] : null

  const handleNavigation = () => {
    if (audioEnabled) {
      playSound("door", { volume: 0.3 })
    }

    // Random glitch effect based on reality distortion
    if (Math.random() < realityState.realityDistortion / 100) {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }
  }

  return (
    <Card className={cn("border-primary/30 bg-black/70 my-6", glitchActive && "glitch-effect")}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          {prevBooklet ? (
            <Link href={`/booklet/${prevBooklet.id}`} onClick={handleNavigation}>
              <Button variant="outline" className="border-primary/30 hover:border-primary/60">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous: {prevBooklet.title}
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="outline" className="border-primary/30 hover:border-primary/60">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Cover
              </Button>
            </Link>
          )}

          <div className="flex items-center">
            <Book className="h-5 w-5 text-primary/80 mr-2" />
            <span className="font-medium">
              Booklet {currentBookletIndex + 1} of {booklets.length}
            </span>
          </div>

          {nextBooklet && (
            <Link href={`/booklet/${nextBooklet.id}`} onClick={handleNavigation}>
              <Button className="bg-primary hover:bg-primary/90">
                Next: {nextBooklet.title}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

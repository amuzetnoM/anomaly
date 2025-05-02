"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookProgress } from "@/components/reader/book-progress"
import { ReaderNotes } from "@/components/reader/reader-notes"
import { useReality } from "@/components/reality-provider"
import { useAudio } from "@/components/audio-provider"
import { ArrowLeft, Volume2, VolumeX, BookOpen, PencilLine, Bookmark, Search } from "lucide-react"
import Link from "next/link"

export default function ReaderDashboard() {
  const { realityState } = useReality()
  const { audioEnabled, setAudioEnabled } = useAudio()
  const [bookData, setBookData] = useState<any>(null)

  // Load book data
  useEffect(() => {
    // In a real app, this would come from an API or database
    // For now, we'll simulate loading from localStorage
    const savedBookData = localStorage.getItem("book-structure")
    if (savedBookData) {
      try {
        const parsedData = JSON.parse(savedBookData)
        setBookData(parsedData)
      } catch (error) {
        console.error("Failed to parse book data", error)
      }
    }
  }, [])

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="outline" className="border-primary/30 hover:border-primary/60 mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Book
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Reader Dashboard</h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAudio}
          title={audioEnabled ? "Disable audio" : "Enable audio"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      <Tabs defaultValue="progress">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="progress" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" /> Progress
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <PencilLine className="h-4 w-4 mr-2" /> Notes
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" /> Bookmarks
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center">
            <Search className="h-4 w-4 mr-2" /> Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookProgress bookData={bookData} />

            <Card className="border-primary/30 bg-black/70">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent reading activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be populated with actual activity data */}
                  <p className="text-muted-foreground">No recent activity to display.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <ReaderNotes />
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card className="border-primary/30 bg-black/70">
            <CardHeader>
              <CardTitle>Bookmarks</CardTitle>
              <CardDescription>Pages you've bookmarked for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with actual bookmark data */}
                <p className="text-muted-foreground">No bookmarks yet. Add bookmarks while reading to see them here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card className="border-primary/30 bg-black/70">
            <CardHeader>
              <CardTitle>Search</CardTitle>
              <CardDescription>Search through the book content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be a search interface */}
                <p className="text-muted-foreground">Search functionality coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

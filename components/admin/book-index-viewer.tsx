"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BookIndexViewerProps = {
  bookData: any
}

export function BookIndexViewer({ bookData }: BookIndexViewerProps) {
  const [index1, setIndex1] = useState<any>(null)
  const [index2, setIndex2] = useState<any>(null)
  const [indexFull, setIndexFull] = useState<any>(null)
  const [missingComponents, setMissingComponents] = useState<string[]>([])
  const { toast } = useToast()

  // Generate indexes when component mounts or bookData changes
  useEffect(() => {
    if (bookData) {
      generateIndexes()
    }
  }, [bookData])

  const generateIndexes = () => {
    // Generate index1 - app components and functions
    const appComponents = [
      { type: "component", name: "RealityProvider", description: "Manages the reality state of the application" },
      { type: "component", name: "AudioProvider", description: "Manages audio playback" },
      { type: "component", name: "BookCover", description: "Displays the book cover" },
      { type: "component", name: "ChapterContent", description: "Renders chapter content" },
      { type: "component", name: "ChapterNavigation", description: "Navigation between chapters" },
      { type: "component", name: "DistortedText", description: "Renders text with distortion effects" },
      { type: "component", name: "MemoryPuzzle", description: "Interactive memory puzzle component" },
      { type: "component", name: "PerceptionTest", description: "Interactive perception test component" },
      { type: "component", name: "RealityChoice", description: "Interactive choice component" },
      { type: "component", name: "UnreliableUI", description: "UI elements that behave unreliably" },
      { type: "component", name: "MetaNarrative", description: "Meta-narrative interactive elements" },
      { type: "component", name: "VisualDistortion", description: "Visual distortion effects" },
      { type: "component", name: "BookSidebar", description: "Sidebar navigation for the book" },
      { type: "component", name: "FileUpload", description: "File upload component for book content" },
      { type: "component", name: "BookStructureEditor", description: "Editor for book structure" },
      { type: "component", name: "CipherManager", description: "Manager for book ciphers" },
      { type: "component", name: "PuzzleEditor", description: "Editor for book puzzles" },
      { type: "component", name: "BookIndexViewer", description: "Viewer for book indexes" },
      { type: "function", name: "useReality", description: "Hook for accessing reality state" },
      { type: "function", name: "useAudio", description: "Hook for audio playback" },
      { type: "function", name: "distortText", description: "Function to apply text distortion" },
      { type: "function", name: "applyDistortion", description: "Function to apply visual distortion" },
      { type: "page", name: "Home", description: "Home page with book cover" },
      { type: "page", name: "ChapterPage", description: "Page for displaying chapters" },
      { type: "page", name: "AdminPage", description: "Admin page for book management" },
    ]

    // Generate index2 - book structure
    const bookStructure: any[] = []

    // Add booklets
    if (bookData.booklets) {
      bookData.booklets.forEach((booklet: any, bookletIndex: number) => {
        bookStructure.push({
          type: "booklet",
          name: booklet.title,
          id: `booklet-${bookletIndex + 1}`,
          description: `Booklet ${bookletIndex + 1} of the book`,
        })

        // Add chapters
        if (booklet.chapters) {
          booklet.chapters.forEach((chapter: any, chapterIndex: number) => {
            bookStructure.push({
              type: "chapter",
              name: chapter.title,
              id: chapter.id || `booklet-${bookletIndex + 1}-chapter-${chapterIndex + 1}`,
              parent: `booklet-${bookletIndex + 1}`,
              description: `Chapter ${chapterIndex + 1} of booklet ${bookletIndex + 1}`,
            })

            // Add sections
            if (chapter.sections) {
              chapter.sections.forEach((section: any, sectionIndex: number) => {
                bookStructure.push({
                  type: "section",
                  name: section.title || `Section ${sectionIndex + 1}`,
                  id: `${chapter.id}-section-${sectionIndex + 1}`,
                  parent: chapter.id || `booklet-${bookletIndex + 1}-chapter-${chapterIndex + 1}`,
                  description: `Section ${sectionIndex + 1} of chapter ${chapterIndex + 1}`,
                })
              })
            }
          })
        }
      })
    }

    // Add ciphers
    if (bookData.ciphers) {
      bookData.ciphers.forEach((cipher: any) => {
        bookStructure.push({
          type: "cipher",
          name: cipher.name,
          id: cipher.id,
          description: `${cipher.type} cipher: ${cipher.description || "No description"}`,
        })
      })
    }

    // Add puzzles
    if (bookData.puzzles) {
      bookData.puzzles.forEach((puzzle: any) => {
        bookStructure.push({
          type: "puzzle",
          name: puzzle.name,
          id: puzzle.id,
          description: `${puzzle.type} puzzle: ${puzzle.description || "No description"}`,
        })
      })
    }

    // Set the indexes
    setIndex1(appComponents)
    setIndex2(bookStructure)

    // Identify missing components
    const requiredComponents = [
      { type: "component", name: "CipherDisplay", description: "Displays cipher content and clues" },
      { type: "component", name: "CipherInput", description: "Input for solving ciphers" },
      { type: "component", name: "TemporalPuzzle", description: "Component for temporal puzzles" },
      { type: "component", name: "BookletNavigation", description: "Navigation between booklets" },
      { type: "component", name: "BookProgress", description: "Displays reader's progress" },
      { type: "component", name: "ReaderNotes", description: "Notes system for readers" },
      { type: "component", name: "BookSearch", description: "Search functionality for the book" },
      { type: "component", name: "BookmarkSystem", description: "System for bookmarking pages" },
      { type: "page", name: "CipherPage", description: "Page for solving ciphers" },
      { type: "page", name: "PuzzlePage", description: "Page for solving puzzles" },
      { type: "page", name: "ReaderDashboard", description: "Dashboard for reader progress" },
    ]

    const missingComponentsList = requiredComponents
      .filter((comp) => !appComponents.some((appComp) => appComp.name === comp.name))
      .map((comp) => `${comp.name} (${comp.type}): ${comp.description}`)

    setMissingComponents(missingComponentsList)

    // Generate indexFull - combined and enhanced index
    const combinedIndex = [
      ...appComponents,
      ...requiredComponents.filter((comp) => !appComponents.some((appComp) => appComp.name === comp.name)),
      ...bookStructure,
    ]

    // Add relationships and connections
    const enhancedIndex = combinedIndex.map((item) => {
      // Add connections based on type
      let connections: string[] = []

      if (item.type === "chapter") {
        // Connect chapters to their booklet and adjacent chapters
        const bookletChapters = bookStructure
          .filter((i) => i.type === "chapter" && i.parent === item.parent)
          .map((i) => i.id)

        const currentIndex = bookletChapters.indexOf(item.id)
        if (currentIndex > 0) {
          connections.push(bookletChapters[currentIndex - 1]) // Previous chapter
        }
        if (currentIndex < bookletChapters.length - 1) {
          connections.push(bookletChapters[currentIndex + 1]) // Next chapter
        }

        // Connect to parent booklet
        connections.push(item.parent)
      }

      if (item.type === "section") {
        // Connect sections to their chapter
        connections.push(item.parent)
      }

      if (item.type === "cipher") {
        // Connect ciphers to their locations and linked ciphers
        const cipher = bookData.ciphers?.find((c: any) => c.id === item.id)
        if (cipher?.linkedCiphers) {
          connections = [...connections, ...cipher.linkedCiphers]
        }

        if (cipher?.hiddenIn) {
          cipher.hiddenIn.forEach((location: any) => {
            const booklet = bookData.booklets?.[location.bookletIndex]
            if (booklet) {
              const chapter = booklet.chapters?.[location.chapterIndex]
              if (chapter) {
                connections.push(
                  chapter.id || `booklet-${location.bookletIndex + 1}-chapter-${location.chapterIndex + 1}`,
                )
              }
            }
          })
        }
      }

      if (item.type === "puzzle") {
        // Connect puzzles to their locations and requirements
        const puzzle = bookData.puzzles?.find((p: any) => p.id === item.id)
        if (puzzle?.requirements) {
          connections = [...connections, ...puzzle.requirements.map((r: any) => r.id).filter(Boolean)]
        }

        if (puzzle?.locations) {
          puzzle.locations.forEach((location: any) => {
            const booklet = bookData.booklets?.[location.bookletIndex]
            if (booklet) {
              const chapter = booklet.chapters?.[location.chapterIndex]
              if (chapter) {
                connections.push(
                  chapter.id || `booklet-${location.bookletIndex + 1}-chapter-${location.chapterIndex + 1}`,
                )
              }
            }
          })
        }
      }

      return {
        ...item,
        connections: [...new Set(connections)], // Remove duplicates
      }
    })

    setIndexFull(enhancedIndex)

    toast({
      title: "Indexes Generated",
      description: "Book indexes have been successfully generated",
    })
  }

  const downloadIndex = (index: any, filename: string) => {
    const blob = new Blob([JSON.stringify(index, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Index Downloaded",
      description: `The index has been downloaded as ${filename}`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Book Indexes</CardTitle>
              <CardDescription>View and analyze the structure of your book and application</CardDescription>
            </div>
            <Button variant="outline" onClick={generateIndexes} className="border-primary/30 hover:border-primary/60">
              <RefreshCw className="h-4 w-4 mr-1" /> Regenerate Indexes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="index1">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="index1">App Components</TabsTrigger>
              <TabsTrigger value="index2">Book Structure</TabsTrigger>
              <TabsTrigger value="indexFull">Full Index</TabsTrigger>
            </TabsList>

            <TabsContent value="index1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Application Components and Functions</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadIndex(index1, "app-components-index.json")}
                      className="border-primary/30 hover:border-primary/60"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Components</Label>
                        <div className="mt-2 space-y-1">
                          {index1
                            ?.filter((item: any) => item.type === "component")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Functions</Label>
                        <div className="mt-2 space-y-1">
                          {index1
                            ?.filter((item: any) => item.type === "function")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Pages</Label>
                        <div className="mt-2 space-y-1">
                          {index1
                            ?.filter((item: any) => item.type === "page")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="index2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Book Structure</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadIndex(index2, "book-structure-index.json")}
                      className="border-primary/30 hover:border-primary/60"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Booklets</Label>
                        <div className="mt-2 space-y-1">
                          {index2
                            ?.filter((item: any) => item.type === "booklet")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Chapters</Label>
                        <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto">
                          {index2
                            ?.filter((item: any) => item.type === "chapter")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Ciphers</Label>
                        <div className="mt-2 space-y-1">
                          {index2
                            ?.filter((item: any) => item.type === "cipher")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Puzzles</Label>
                        <div className="mt-2 space-y-1">
                          {index2
                            ?.filter((item: any) => item.type === "puzzle")
                            .map((item: any, index: number) => (
                              <div key={index} className="p-2 border border-primary/20 rounded-md">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="indexFull">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Full Integrated Index</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadIndex(indexFull, "full-integrated-index.json")}
                      className="border-primary/30 hover:border-primary/60"
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Card className="border-red-500/30">
                      <CardHeader>
                        <CardTitle className="text-red-500">Missing Components</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {missingComponents.map((component, index) => (
                            <div key={index} className="p-2 border border-red-500/20 rounded-md">
                              <p>{component}</p>
                            </div>
                          ))}

                          {missingComponents.length === 0 && (
                            <p className="text-muted-foreground">No missing components detected.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="Search index..." className="mb-2 bg-black/50 border-primary/30" />
                        <div className="border border-primary/20 rounded-md h-[400px] overflow-y-auto">
                          <div className="p-4 space-y-2">
                            {indexFull?.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="p-2 border border-primary/20 rounded-md hover:bg-primary/10 cursor-pointer"
                              >
                                <div className="flex justify-between">
                                  <p className="font-medium">{item.name}</p>
                                  <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">{item.type}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                {item.connections && item.connections.length > 0 && (
                                  <div className="mt-1">
                                    <p className="text-xs text-muted-foreground">
                                      Connected to: {item.connections.join(", ")}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Relationship Diagram</Label>
                        <div className="border border-primary/20 rounded-md h-[430px] flex items-center justify-center bg-black/30">
                          <p className="text-muted-foreground">
                            Interactive relationship diagram would be displayed here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BookStructureEditorProps = {
  bookData: any
  onUpdate: (updatedData: any) => void
}

export function BookStructureEditor({ bookData, onUpdate }: BookStructureEditorProps) {
  const [activeBooklet, setActiveBooklet] = useState(0)
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null)
  const { toast } = useToast()

  const handleBookletChange = (title: string, index: number) => {
    const updatedBooklets = [...bookData.booklets]
    updatedBooklets[index] = {
      ...updatedBooklets[index],
      title,
    }

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })
  }

  const handleChapterChange = (chapterData: any, bookletIndex: number, chapterIndex: number) => {
    const updatedBooklets = [...bookData.booklets]
    updatedBooklets[bookletIndex].chapters[chapterIndex] = {
      ...updatedBooklets[bookletIndex].chapters[chapterIndex],
      ...chapterData,
    }

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })
  }

  const addChapter = (bookletIndex: number) => {
    const updatedBooklets = [...bookData.booklets]
    const newChapterNumber = updatedBooklets[bookletIndex].chapters.length + 1

    updatedBooklets[bookletIndex].chapters.push({
      id: `booklet-${bookletIndex + 1}-chapter-${newChapterNumber}`,
      title: `Chapter ${newChapterNumber}`,
      content: "",
      sections: [],
    })

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })

    toast({
      title: "Chapter Added",
      description: `Added Chapter ${newChapterNumber} to ${updatedBooklets[bookletIndex].title}`,
    })
  }

  const removeChapter = (bookletIndex: number, chapterIndex: number) => {
    const updatedBooklets = [...bookData.booklets]
    updatedBooklets[bookletIndex].chapters.splice(chapterIndex, 1)

    // Renumber remaining chapters
    updatedBooklets[bookletIndex].chapters = updatedBooklets[bookletIndex].chapters.map((chapter, idx) => ({
      ...chapter,
      id: `booklet-${bookletIndex + 1}-chapter-${idx + 1}`,
      title: chapter.title.replace(/Chapter \d+/, `Chapter ${idx + 1}`),
    }))

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })

    toast({
      title: "Chapter Removed",
      description: "The chapter has been removed and remaining chapters renumbered",
    })
  }

  const moveChapter = (bookletIndex: number, chapterIndex: number, direction: "up" | "down") => {
    if (
      (direction === "up" && chapterIndex === 0) ||
      (direction === "down" && chapterIndex === bookData.booklets[bookletIndex].chapters.length - 1)
    ) {
      return
    }

    const updatedBooklets = [...bookData.booklets]
    const chapters = [...updatedBooklets[bookletIndex].chapters]
    const newIndex = direction === "up" ? chapterIndex - 1 : chapterIndex + 1

    // Swap chapters
    const temp = { ...chapters[chapterIndex] }
    chapters[chapterIndex] = { ...chapters[newIndex] }
    chapters[newIndex] = temp

    // Renumber chapters
    updatedBooklets[bookletIndex].chapters = chapters.map((chapter, idx) => ({
      ...chapter,
      id: `booklet-${bookletIndex + 1}-chapter-${idx + 1}`,
      title: chapter.title.replace(/Chapter \d+/, `Chapter ${idx + 1}`),
    }))

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })
  }

  const addSection = (bookletIndex: number, chapterIndex: number) => {
    const updatedBooklets = [...bookData.booklets]
    const chapter = updatedBooklets[bookletIndex].chapters[chapterIndex]

    if (!chapter.sections) {
      chapter.sections = []
    }

    chapter.sections.push({
      title: `Section ${chapter.sections.length + 1}`,
      content: "",
      interactiveElements: [],
    })

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })
  }

  const handleSectionChange = (sectionData: any, bookletIndex: number, chapterIndex: number, sectionIndex: number) => {
    const updatedBooklets = [...bookData.booklets]
    updatedBooklets[bookletIndex].chapters[chapterIndex].sections[sectionIndex] = {
      ...updatedBooklets[bookletIndex].chapters[chapterIndex].sections[sectionIndex],
      ...sectionData,
    }

    onUpdate({
      ...bookData,
      booklets: updatedBooklets,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book Structure</CardTitle>
          <CardDescription>Organize your book into booklets and chapters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="book-title">Book Title</Label>
                <Input
                  id="book-title"
                  value={bookData.title || ""}
                  onChange={(e) => onUpdate({ ...bookData, title: e.target.value })}
                  className="bg-black/50 border-primary/30"
                />
              </div>
              <div>
                <Label htmlFor="book-author">Author</Label>
                <Input
                  id="book-author"
                  value={bookData.author || ""}
                  onChange={(e) => onUpdate({ ...bookData, author: e.target.value })}
                  className="bg-black/50 border-primary/30"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="book-description">Description</Label>
              <Textarea
                id="book-description"
                value={bookData.description || ""}
                onChange={(e) => onUpdate({ ...bookData, description: e.target.value })}
                className="bg-black/50 border-primary/30"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={`booklet-${activeBooklet}`}
        onValueChange={(value) => setActiveBooklet(Number.parseInt(value.split("-")[1]))}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            {bookData.booklets?.map((booklet: any, index: number) => (
              <TabsTrigger key={index} value={`booklet-${index}`}>
                {booklet.title || `Booklet ${index + 1}`}
              </TabsTrigger>
            ))}
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const updatedBookData = { ...bookData }
              if (!updatedBookData.booklets) {
                updatedBookData.booklets = []
              }

              updatedBookData.booklets.push({
                title: `Booklet ${updatedBookData.booklets.length + 1}`,
                chapters: [],
              })

              onUpdate(updatedBookData)
            }}
            className="border-primary/30 hover:border-primary/60"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Booklet
          </Button>
        </div>

        {bookData.booklets?.map((booklet: any, bookletIndex: number) => (
          <TabsContent key={bookletIndex} value={`booklet-${bookletIndex}`} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Input
                    value={booklet.title || `Booklet ${bookletIndex + 1}`}
                    onChange={(e) => handleBookletChange(e.target.value, bookletIndex)}
                    className="bg-black/50 border-primary/30"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booklet.chapters?.map((chapter: any, chapterIndex: number) => (
                    <Card key={chapterIndex} className="border-primary/20">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <Input
                              value={chapter.title}
                              onChange={(e) =>
                                handleChapterChange({ title: e.target.value }, bookletIndex, chapterIndex)
                              }
                              className="bg-black/50 border-primary/30"
                            />
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveChapter(bookletIndex, chapterIndex, "up")}
                              disabled={chapterIndex === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveChapter(bookletIndex, chapterIndex, "down")}
                              disabled={chapterIndex === booklet.chapters.length - 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setExpandedChapter(expandedChapter === chapterIndex ? null : chapterIndex)}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeChapter(bookletIndex, chapterIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      {expandedChapter === chapterIndex && (
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label>Chapter Content</Label>
                              <Textarea
                                value={chapter.content || ""}
                                onChange={(e) =>
                                  handleChapterChange({ content: e.target.value }, bookletIndex, chapterIndex)
                                }
                                className="bg-black/50 border-primary/30"
                                rows={5}
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <Label>Sections</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSection(bookletIndex, chapterIndex)}
                                  className="border-primary/30 hover:border-primary/60"
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Section
                                </Button>
                              </div>

                              <div className="space-y-3">
                                {chapter.sections?.map((section: any, sectionIndex: number) => (
                                  <Card key={sectionIndex} className="border-primary/10">
                                    <CardHeader className="py-2">
                                      <Input
                                        value={section.title || `Section ${sectionIndex + 1}`}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            { title: e.target.value },
                                            bookletIndex,
                                            chapterIndex,
                                            sectionIndex,
                                          )
                                        }
                                        className="bg-black/50 border-primary/30"
                                        placeholder="Section Title"
                                      />
                                    </CardHeader>
                                    <CardContent>
                                      <Textarea
                                        value={section.content || ""}
                                        onChange={(e) =>
                                          handleSectionChange(
                                            { content: e.target.value },
                                            bookletIndex,
                                            chapterIndex,
                                            sectionIndex,
                                          )
                                        }
                                        className="bg-black/50 border-primary/30"
                                        placeholder="Section content..."
                                        rows={3}
                                      />
                                    </CardContent>
                                  </Card>
                                ))}

                                {(!chapter.sections || chapter.sections.length === 0) && (
                                  <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                                    <p className="text-muted-foreground">
                                      No sections yet. Add a section to organize your chapter content.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => addChapter(bookletIndex)}
                    className="w-full border-primary/30 hover:border-primary/60"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Chapter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

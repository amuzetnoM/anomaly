"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type PuzzleEditorProps = {
  bookData: any
  onUpdate: (updatedData: any) => void
}

export function PuzzleEditor({ bookData, onUpdate }: PuzzleEditorProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<number | null>(null)
  const { toast } = useToast()

  const puzzleTypes = [
    { value: "temporal", label: "Temporal Puzzle" },
    { value: "memory", label: "Memory Puzzle" },
    { value: "perception", label: "Perception Test" },
    { value: "choice", label: "Reality Choice" },
    { value: "meta", label: "Meta-Narrative" },
  ]

  const addPuzzle = () => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.puzzles) {
      updatedBookData.puzzles = []
    }

    updatedBookData.puzzles.push({
      id: `puzzle-${updatedBookData.puzzles.length + 1}`,
      name: `Puzzle ${updatedBookData.puzzles.length + 1}`,
      type: "temporal",
      description: "",
      difficulty: "medium",
      locations: [],
      requirements: [],
      solution: "",
      reward: "",
    })

    onUpdate(updatedBookData)
    setSelectedPuzzle(updatedBookData.puzzles.length - 1)

    toast({
      title: "Puzzle Added",
      description: "A new puzzle has been added to your book",
    })
  }

  const updatePuzzle = (puzzleIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles[puzzleIndex] = {
      ...updatedBookData.puzzles[puzzleIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removePuzzle = (puzzleIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles.splice(puzzleIndex, 1)

    // Renumber remaining puzzles
    updatedBookData.puzzles = updatedBookData.puzzles.map((puzzle: any, idx: number) => ({
      ...puzzle,
      id: `puzzle-${idx + 1}`,
      name: puzzle.name.replace(/Puzzle \d+/, `Puzzle ${idx + 1}`),
    }))

    onUpdate(updatedBookData)
    setSelectedPuzzle(null)

    toast({
      title: "Puzzle Removed",
      description: "The puzzle has been removed from your book",
    })
  }

  const addPuzzleLocation = (puzzleIndex: number) => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.puzzles[puzzleIndex].locations) {
      updatedBookData.puzzles[puzzleIndex].locations = []
    }

    updatedBookData.puzzles[puzzleIndex].locations.push({
      bookletIndex: 0,
      chapterIndex: 0,
      sectionIndex: 0,
      type: "clue",
    })

    onUpdate(updatedBookData)
  }

  const updatePuzzleLocation = (puzzleIndex: number, locationIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles[puzzleIndex].locations[locationIndex] = {
      ...updatedBookData.puzzles[puzzleIndex].locations[locationIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removePuzzleLocation = (puzzleIndex: number, locationIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles[puzzleIndex].locations.splice(locationIndex, 1)

    onUpdate(updatedBookData)
  }

  const addRequirement = (puzzleIndex: number) => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.puzzles[puzzleIndex].requirements) {
      updatedBookData.puzzles[puzzleIndex].requirements = []
    }

    updatedBookData.puzzles[puzzleIndex].requirements.push({
      type: "cipher",
      id: "",
      description: "",
    })

    onUpdate(updatedBookData)
  }

  const updateRequirement = (puzzleIndex: number, requirementIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles[puzzleIndex].requirements[requirementIndex] = {
      ...updatedBookData.puzzles[puzzleIndex].requirements[requirementIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removeRequirement = (puzzleIndex: number, requirementIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.puzzles[puzzleIndex].requirements.splice(requirementIndex, 1)

    onUpdate(updatedBookData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temporal Puzzles</CardTitle>
          <CardDescription>
            Create puzzles that span across chapters and require readers to connect information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{bookData.puzzles?.length || 0} puzzles configured</p>
            <Button onClick={addPuzzle} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" /> Add New Puzzle
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border-r border-primary/20 pr-4">
              <div className="space-y-2">
                {bookData.puzzles?.map((puzzle: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedPuzzle === index ? "default" : "ghost"}
                    className={`w-full justify-start ${selectedPuzzle === index ? "bg-primary" : ""}`}
                    onClick={() => setSelectedPuzzle(index)}
                  >
                    {puzzle.name}
                  </Button>
                ))}

                {(!bookData.puzzles || bookData.puzzles.length === 0) && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No puzzles yet. Add your first puzzle to get started.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-3">
              {selectedPuzzle !== null && bookData.puzzles?.[selectedPuzzle] ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      value={bookData.puzzles[selectedPuzzle].name}
                      onChange={(e) => updatePuzzle(selectedPuzzle, { name: e.target.value })}
                      className="text-xl font-bold bg-black/50 border-primary/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePuzzle(selectedPuzzle)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Puzzle Type</Label>
                      <Select
                        value={bookData.puzzles[selectedPuzzle].type}
                        onValueChange={(value) => updatePuzzle(selectedPuzzle, { type: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-primary/30">
                          <SelectValue placeholder="Select puzzle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {puzzleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={bookData.puzzles[selectedPuzzle].difficulty || "medium"}
                        onValueChange={(value) => updatePuzzle(selectedPuzzle, { difficulty: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-primary/30">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Puzzle Description</Label>
                    <Textarea
                      value={bookData.puzzles[selectedPuzzle].description || ""}
                      onChange={(e) => updatePuzzle(selectedPuzzle, { description: e.target.value })}
                      className="bg-black/50 border-primary/30"
                      placeholder="Describe the puzzle and its purpose..."
                      rows={3}
                    />
                  </div>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Puzzle Locations</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPuzzleLocation(selectedPuzzle)}
                          className="border-primary/30 hover:border-primary/60"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Location
                        </Button>
                      </div>
                      <CardDescription>Specify where in the book this puzzle appears</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookData.puzzles[selectedPuzzle].locations?.map((location: any, locationIndex: number) => (
                          <Card key={locationIndex} className="border-primary/10">
                            <CardContent className="p-3">
                              <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-3">
                                  <Label className="text-xs">Booklet</Label>
                                  <Select
                                    value={location.bookletIndex.toString()}
                                    onValueChange={(value) =>
                                      updatePuzzleLocation(selectedPuzzle, locationIndex, {
                                        bookletIndex: Number.parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger className="bg-black/50 border-primary/30">
                                      <SelectValue placeholder="Booklet" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bookData.booklets?.map((booklet: any, idx: number) => (
                                        <SelectItem key={idx} value={idx.toString()}>
                                          {booklet.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  <Label className="text-xs">Chapter</Label>
                                  <Select
                                    value={location.chapterIndex.toString()}
                                    onValueChange={(value) =>
                                      updatePuzzleLocation(selectedPuzzle, locationIndex, {
                                        chapterIndex: Number.parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger className="bg-black/50 border-primary/30">
                                      <SelectValue placeholder="Chapter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bookData.booklets?.[location.bookletIndex]?.chapters?.map(
                                        (chapter: any, idx: number) => (
                                          <SelectItem key={idx} value={idx.toString()}>
                                            {chapter.title}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  <Label className="text-xs">Section</Label>
                                  <Select
                                    value={location.sectionIndex.toString()}
                                    onValueChange={(value) =>
                                      updatePuzzleLocation(selectedPuzzle, locationIndex, {
                                        sectionIndex: Number.parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger className="bg-black/50 border-primary/30">
                                      <SelectValue placeholder="Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bookData.booklets?.[location.bookletIndex]?.chapters?.[
                                        location.chapterIndex
                                      ]?.sections?.map((section: any, idx: number) => (
                                        <SelectItem key={idx} value={idx.toString()}>
                                          {section.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-xs">Type</Label>
                                  <Select
                                    value={location.type || "clue"}
                                    onValueChange={(value) =>
                                      updatePuzzleLocation(selectedPuzzle, locationIndex, { type: value })
                                    }
                                  >
                                    <SelectTrigger className="bg-black/50 border-primary/30">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="clue">Clue</SelectItem>
                                      <SelectItem value="puzzle">Puzzle Part</SelectItem>
                                      <SelectItem value="solution">Solution</SelectItem>
                                      <SelectItem value="reward">Reward</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-1 flex items-end justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removePuzzleLocation(selectedPuzzle, locationIndex)}
                                    className="text-red-500 hover:text-red-700 h-8 w-8"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="col-span-12 mt-2">
                                  <Label className="text-xs">Content</Label>
                                  <Textarea
                                    value={location.content || ""}
                                    onChange={(e) =>
                                      updatePuzzleLocation(selectedPuzzle, locationIndex, { content: e.target.value })
                                    }
                                    className="bg-black/50 border-primary/30"
                                    placeholder="Content for this puzzle location"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {(!bookData.puzzles[selectedPuzzle].locations ||
                          bookData.puzzles[selectedPuzzle].locations.length === 0) && (
                          <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                            <p className="text-muted-foreground">
                              No locations specified. Add locations to place this puzzle in your book.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Requirements</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addRequirement(selectedPuzzle)}
                          className="border-primary/30 hover:border-primary/60"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Requirement
                        </Button>
                      </div>
                      <CardDescription>Specify what readers need to solve this puzzle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookData.puzzles[selectedPuzzle].requirements?.map(
                          (requirement: any, requirementIndex: number) => (
                            <Card key={requirementIndex} className="border-primary/10">
                              <CardContent className="p-3">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-3">
                                    <Label className="text-xs">Type</Label>
                                    <Select
                                      value={requirement.type || "cipher"}
                                      onValueChange={(value) =>
                                        updateRequirement(selectedPuzzle, requirementIndex, { type: value })
                                      }
                                    >
                                      <SelectTrigger className="bg-black/50 border-primary/30">
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cipher">Cipher</SelectItem>
                                        <SelectItem value="puzzle">Other Puzzle</SelectItem>
                                        <SelectItem value="choice">Choice Made</SelectItem>
                                        <SelectItem value="item">Item Found</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-8">
                                    <Label className="text-xs">Reference ID</Label>
                                    <Select
                                      value={requirement.id || ""}
                                      onValueChange={(value) =>
                                        updateRequirement(selectedPuzzle, requirementIndex, { id: value })
                                      }
                                    >
                                      <SelectTrigger className="bg-black/50 border-primary/30">
                                        <SelectValue placeholder="Select reference" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {requirement.type === "cipher" &&
                                          bookData.ciphers?.map((cipher: any) => (
                                            <SelectItem key={cipher.id} value={cipher.id}>
                                              {cipher.name}
                                            </SelectItem>
                                          ))}
                                        {requirement.type === "puzzle" &&
                                          bookData.puzzles?.map((puzzle: any) =>
                                            puzzle.id !== bookData.puzzles[selectedPuzzle].id ? (
                                              <SelectItem key={puzzle.id} value={puzzle.id}>
                                                {puzzle.name}
                                              </SelectItem>
                                            ) : null,
                                          )}
                                        {requirement.type === "choice" && (
                                          <>
                                            <SelectItem value="choice-1">Choice 1</SelectItem>
                                            <SelectItem value="choice-2">Choice 2</SelectItem>
                                          </>
                                        )}
                                        {requirement.type === "item" && (
                                          <>
                                            <SelectItem value="item-1">Item 1</SelectItem>
                                            <SelectItem value="item-2">Item 2</SelectItem>
                                          </>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="col-span-1 flex items-end justify-center">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeRequirement(selectedPuzzle, requirementIndex)}
                                      className="text-red-500 hover:text-red-700 h-8 w-8"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="col-span-12 mt-2">
                                    <Label className="text-xs">Description</Label>
                                    <Input
                                      value={requirement.description || ""}
                                      onChange={(e) =>
                                        updateRequirement(selectedPuzzle, requirementIndex, {
                                          description: e.target.value,
                                        })
                                      }
                                      className="bg-black/50 border-primary/30"
                                      placeholder="Describe this requirement"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ),
                        )}

                        {(!bookData.puzzles[selectedPuzzle].requirements ||
                          bookData.puzzles[selectedPuzzle].requirements.length === 0) && (
                          <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                            <p className="text-muted-foreground">
                              No requirements specified. Add requirements that readers need to solve this puzzle.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Solution</Label>
                      <Textarea
                        value={bookData.puzzles[selectedPuzzle].solution || ""}
                        onChange={(e) => updatePuzzle(selectedPuzzle, { solution: e.target.value })}
                        className="bg-black/50 border-primary/30"
                        placeholder="The solution to this puzzle..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Reward</Label>
                      <Textarea
                        value={bookData.puzzles[selectedPuzzle].reward || ""}
                        onChange={(e) => updatePuzzle(selectedPuzzle, { reward: e.target.value })}
                        className="bg-black/50 border-primary/30"
                        placeholder="What readers get for solving this puzzle..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={bookData.puzzles[selectedPuzzle].isRequired || false}
                      onCheckedChange={(checked) => updatePuzzle(selectedPuzzle, { isRequired: checked })}
                    />
                    <Label>Required for story progression</Label>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      Select a puzzle from the list or create a new one to get started.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

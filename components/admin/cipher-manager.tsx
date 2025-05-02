"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Link, Unlink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type CipherManagerProps = {
  bookData: any
  onUpdate: (updatedData: any) => void
}

export function CipherManager({ bookData, onUpdate }: CipherManagerProps) {
  const [selectedCipher, setSelectedCipher] = useState<number | null>(null)
  const { toast } = useToast()

  const cipherTypes = [
    { value: "substitution", label: "Substitution Cipher" },
    { value: "caesar", label: "Caesar Cipher" },
    { value: "vigenere", label: "Vigenère Cipher" },
    { value: "binary", label: "Binary Code" },
    { value: "morse", label: "Morse Code" },
    { value: "custom", label: "Custom Cipher" },
  ]

  const addCipher = () => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.ciphers) {
      updatedBookData.ciphers = []
    }

    updatedBookData.ciphers.push({
      id: `cipher-${updatedBookData.ciphers.length + 1}`,
      name: `Cipher ${updatedBookData.ciphers.length + 1}`,
      type: "substitution",
      key: "",
      clues: [],
      linkedCiphers: [],
      hiddenIn: [],
    })

    onUpdate(updatedBookData)
    setSelectedCipher(updatedBookData.ciphers.length - 1)

    toast({
      title: "Cipher Added",
      description: "A new cipher has been added to your book",
    })
  }

  const updateCipher = (cipherIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers[cipherIndex] = {
      ...updatedBookData.ciphers[cipherIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removeCipher = (cipherIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers.splice(cipherIndex, 1)

    // Renumber remaining ciphers
    updatedBookData.ciphers = updatedBookData.ciphers.map((cipher: any, idx: number) => ({
      ...cipher,
      id: `cipher-${idx + 1}`,
      name: cipher.name.replace(/Cipher \d+/, `Cipher ${idx + 1}`),
    }))

    onUpdate(updatedBookData)
    setSelectedCipher(null)

    toast({
      title: "Cipher Removed",
      description: "The cipher has been removed from your book",
    })
  }

  const addClue = (cipherIndex: number) => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.ciphers[cipherIndex].clues) {
      updatedBookData.ciphers[cipherIndex].clues = []
    }

    updatedBookData.ciphers[cipherIndex].clues.push({
      text: "",
      location: "",
      isHidden: false,
    })

    onUpdate(updatedBookData)
  }

  const updateClue = (cipherIndex: number, clueIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers[cipherIndex].clues[clueIndex] = {
      ...updatedBookData.ciphers[cipherIndex].clues[clueIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removeClue = (cipherIndex: number, clueIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers[cipherIndex].clues.splice(clueIndex, 1)

    onUpdate(updatedBookData)
  }

  const linkCipher = (sourceCipherIndex: number, targetCipherId: string) => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.ciphers[sourceCipherIndex].linkedCiphers) {
      updatedBookData.ciphers[sourceCipherIndex].linkedCiphers = []
    }

    // Check if already linked
    if (!updatedBookData.ciphers[sourceCipherIndex].linkedCiphers.includes(targetCipherId)) {
      updatedBookData.ciphers[sourceCipherIndex].linkedCiphers.push(targetCipherId)
    }

    onUpdate(updatedBookData)

    toast({
      title: "Ciphers Linked",
      description: "The ciphers have been linked successfully",
    })
  }

  const unlinkCipher = (sourceCipherIndex: number, targetCipherId: string) => {
    const updatedBookData = { ...bookData }

    updatedBookData.ciphers[sourceCipherIndex].linkedCiphers = updatedBookData.ciphers[
      sourceCipherIndex
    ].linkedCiphers.filter((id: string) => id !== targetCipherId)

    onUpdate(updatedBookData)
  }

  const addHiddenLocation = (cipherIndex: number) => {
    const updatedBookData = { ...bookData }

    if (!updatedBookData.ciphers[cipherIndex].hiddenIn) {
      updatedBookData.ciphers[cipherIndex].hiddenIn = []
    }

    updatedBookData.ciphers[cipherIndex].hiddenIn.push({
      bookletIndex: 0,
      chapterIndex: 0,
      sectionIndex: 0,
      hint: "",
    })

    onUpdate(updatedBookData)
  }

  const updateHiddenLocation = (cipherIndex: number, locationIndex: number, data: any) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers[cipherIndex].hiddenIn[locationIndex] = {
      ...updatedBookData.ciphers[cipherIndex].hiddenIn[locationIndex],
      ...data,
    }

    onUpdate(updatedBookData)
  }

  const removeHiddenLocation = (cipherIndex: number, locationIndex: number) => {
    const updatedBookData = { ...bookData }
    updatedBookData.ciphers[cipherIndex].hiddenIn.splice(locationIndex, 1)

    onUpdate(updatedBookData)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cipher Management</CardTitle>
          <CardDescription>Create and manage hidden ciphers and codes in your book</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{bookData.ciphers?.length || 0} ciphers configured</p>
            <Button onClick={addCipher} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" /> Add New Cipher
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border-r border-primary/20 pr-4">
              <div className="space-y-2">
                {bookData.ciphers?.map((cipher: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedCipher === index ? "default" : "ghost"}
                    className={`w-full justify-start ${selectedCipher === index ? "bg-primary" : ""}`}
                    onClick={() => setSelectedCipher(index)}
                  >
                    {cipher.name}
                  </Button>
                ))}

                {(!bookData.ciphers || bookData.ciphers.length === 0) && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No ciphers yet. Add your first cipher to get started.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-3">
              {selectedCipher !== null && bookData.ciphers?.[selectedCipher] ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input
                      value={bookData.ciphers[selectedCipher].name}
                      onChange={(e) => updateCipher(selectedCipher, { name: e.target.value })}
                      className="text-xl font-bold bg-black/50 border-primary/30"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCipher(selectedCipher)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Cipher Type</Label>
                      <Select
                        value={bookData.ciphers[selectedCipher].type}
                        onValueChange={(value) => updateCipher(selectedCipher, { type: value })}
                      >
                        <SelectTrigger className="bg-black/50 border-primary/30">
                          <SelectValue placeholder="Select cipher type" />
                        </SelectTrigger>
                        <SelectContent>
                          {cipherTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cipher Key</Label>
                      <Input
                        value={bookData.ciphers[selectedCipher].key || ""}
                        onChange={(e) => updateCipher(selectedCipher, { key: e.target.value })}
                        className="bg-black/50 border-primary/30"
                        placeholder="Enter cipher key or shift value"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Cipher Description</Label>
                    <Textarea
                      value={bookData.ciphers[selectedCipher].description || ""}
                      onChange={(e) => updateCipher(selectedCipher, { description: e.target.value })}
                      className="bg-black/50 border-primary/30"
                      placeholder="Describe how this cipher works..."
                      rows={3}
                    />
                  </div>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Clues</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addClue(selectedCipher)}
                          className="border-primary/30 hover:border-primary/60"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Clue
                        </Button>
                      </div>
                      <CardDescription>Add clues that help readers solve this cipher</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookData.ciphers[selectedCipher].clues?.map((clue: any, clueIndex: number) => (
                          <Card key={clueIndex} className="border-primary/10">
                            <CardContent className="p-3">
                              <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-8">
                                  <Input
                                    value={clue.text || ""}
                                    onChange={(e) => updateClue(selectedCipher, clueIndex, { text: e.target.value })}
                                    className="bg-black/50 border-primary/30"
                                    placeholder="Clue text"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <Input
                                    value={clue.location || ""}
                                    onChange={(e) =>
                                      updateClue(selectedCipher, clueIndex, { location: e.target.value })
                                    }
                                    className="bg-black/50 border-primary/30"
                                    placeholder="Location"
                                  />
                                </div>
                                <div className="col-span-1 flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeClue(selectedCipher, clueIndex)}
                                    className="text-red-500 hover:text-red-700 h-8 w-8"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="col-span-12 flex items-center space-x-2">
                                  <Switch
                                    checked={clue.isHidden || false}
                                    onCheckedChange={(checked) =>
                                      updateClue(selectedCipher, clueIndex, { isHidden: checked })
                                    }
                                  />
                                  <Label className="text-sm">Hidden clue (requires discovery)</Label>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {(!bookData.ciphers[selectedCipher].clues ||
                          bookData.ciphers[selectedCipher].clues.length === 0) && (
                          <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                            <p className="text-muted-foreground">
                              No clues yet. Add clues to help readers solve this cipher.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Linked Ciphers</CardTitle>
                        <Select
                          onValueChange={(value) => linkCipher(selectedCipher, value)}
                          disabled={!bookData.ciphers || bookData.ciphers.length <= 1}
                        >
                          <SelectTrigger className="w-[180px] border-primary/30 bg-black/50">
                            <SelectValue placeholder="Link cipher..." />
                          </SelectTrigger>
                          <SelectContent>
                            {bookData.ciphers?.map((cipher: any, index: number) => {
                              if (index === selectedCipher) return null
                              return (
                                <SelectItem key={cipher.id} value={cipher.id}>
                                  {cipher.name}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <CardDescription>Connect this cipher to others to create layered puzzles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {bookData.ciphers[selectedCipher].linkedCiphers?.map(
                          (linkedCipherId: string, linkIndex: number) => {
                            const linkedCipher = bookData.ciphers.find((c: any) => c.id === linkedCipherId)
                            if (!linkedCipher) return null

                            return (
                              <div
                                key={linkIndex}
                                className="flex justify-between items-center p-2 border border-primary/20 rounded-md"
                              >
                                <div className="flex items-center">
                                  <Link className="h-4 w-4 mr-2 text-primary/60" />
                                  <span>{linkedCipher.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => unlinkCipher(selectedCipher, linkedCipherId)}
                                  className="h-8 w-8"
                                >
                                  <Unlink className="h-4 w-4" />
                                </Button>
                              </div>
                            )
                          },
                        )}

                        {(!bookData.ciphers[selectedCipher].linkedCiphers ||
                          bookData.ciphers[selectedCipher].linkedCiphers.length === 0) && (
                          <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                            <p className="text-muted-foreground">
                              No linked ciphers. Link to other ciphers to create complex puzzles.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Hidden Locations</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addHiddenLocation(selectedCipher)}
                          className="border-primary/30 hover:border-primary/60"
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Location
                        </Button>
                      </div>
                      <CardDescription>Specify where in the book this cipher is hidden</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookData.ciphers[selectedCipher].hiddenIn?.map((location: any, locationIndex: number) => (
                          <Card key={locationIndex} className="border-primary/10">
                            <CardContent className="p-3">
                              <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-3">
                                  <Label className="text-xs">Booklet</Label>
                                  <Select
                                    value={location.bookletIndex.toString()}
                                    onValueChange={(value) =>
                                      updateHiddenLocation(selectedCipher, locationIndex, {
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
                                      updateHiddenLocation(selectedCipher, locationIndex, {
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
                                      updateHiddenLocation(selectedCipher, locationIndex, {
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
                                  <Label className="text-xs">Method</Label>
                                  <Select
                                    value={location.method || "text"}
                                    onValueChange={(value) =>
                                      updateHiddenLocation(selectedCipher, locationIndex, { method: value })
                                    }
                                  >
                                    <SelectTrigger className="bg-black/50 border-primary/30">
                                      <SelectValue placeholder="Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">In Text</SelectItem>
                                      <SelectItem value="image">In Image</SelectItem>
                                      <SelectItem value="pattern">Pattern</SelectItem>
                                      <SelectItem value="acrostic">Acrostic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-1 flex items-end justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeHiddenLocation(selectedCipher, locationIndex)}
                                    className="text-red-500 hover:text-red-700 h-8 w-8"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="col-span-12 mt-2">
                                  <Label className="text-xs">Hint for Readers</Label>
                                  <Input
                                    value={location.hint || ""}
                                    onChange={(e) =>
                                      updateHiddenLocation(selectedCipher, locationIndex, { hint: e.target.value })
                                    }
                                    className="bg-black/50 border-primary/30"
                                    placeholder="Optional hint for readers"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {(!bookData.ciphers[selectedCipher].hiddenIn ||
                          bookData.ciphers[selectedCipher].hiddenIn.length === 0) && (
                          <div className="text-center p-4 border border-dashed border-primary/20 rounded-md">
                            <p className="text-muted-foreground">
                              No hidden locations specified. Add locations to place this cipher in your book.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      Select a cipher from the list or create a new one to get started.
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

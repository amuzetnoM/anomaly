"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookStructureEditor } from "@/components/admin/book-structure-editor"
import { CipherManager } from "@/components/admin/cipher-manager"
import { PuzzleEditor } from "@/components/admin/puzzle-editor"
import { BookIndexViewer } from "@/components/admin/book-index-viewer"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [bookData, setBookData] = useState<any>(null)
  const { toast } = useToast()

  const handleUploadComplete = (data: any) => {
    setBookData(data)
    toast({
      title: "Upload Complete",
      description: "Book content has been successfully processed",
    })
  }

  const handleSaveStructure = () => {
    // In a real app, this would save to a database or API
    localStorage.setItem("book-structure", JSON.stringify(bookData))
    toast({
      title: "Book Structure Saved",
      description: "Your changes have been saved locally",
    })
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Book Administration</h1>

      {!bookData ? (
        <div className="max-w-2xl mx-auto">
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Managing: {bookData.title || "Uploaded Book"}</h2>
            <Button onClick={handleSaveStructure} className="bg-primary hover:bg-primary/90">
              Save All Changes
            </Button>
          </div>

          <Tabs defaultValue="structure">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="structure">Book Structure</TabsTrigger>
              <TabsTrigger value="ciphers">Ciphers & Codes</TabsTrigger>
              <TabsTrigger value="puzzles">Temporal Puzzles</TabsTrigger>
              <TabsTrigger value="index">Full Index</TabsTrigger>
            </TabsList>

            <TabsContent value="structure">
              <BookStructureEditor bookData={bookData} onUpdate={(updatedData) => setBookData(updatedData)} />
            </TabsContent>

            <TabsContent value="ciphers">
              <CipherManager bookData={bookData} onUpdate={(updatedData) => setBookData(updatedData)} />
            </TabsContent>

            <TabsContent value="puzzles">
              <PuzzleEditor bookData={bookData} onUpdate={(updatedData) => setBookData(updatedData)} />
            </TabsContent>

            <TabsContent value="index">
              <BookIndexViewer bookData={bookData} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

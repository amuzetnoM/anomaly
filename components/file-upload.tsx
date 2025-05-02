"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import { useReality } from "./reality-provider"

type FileUploadProps = {
  onUploadComplete: (data: any) => void
  acceptedFileTypes?: string
  maxSizeMB?: number
}

export function FileUpload({
  onUploadComplete,
  acceptedFileTypes = ".json,.txt,.md",
  maxSizeMB = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { realityState } = useReality()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)
    setSuccess(false)

    if (!selectedFile) return

    // Check file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`)
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 100)

      // Read the file
      const reader = new FileReader()

      reader.onload = async (event) => {
        clearInterval(progressInterval)
        setUploadProgress(100)

        try {
          const content = event.target?.result as string
          let parsedData

          // Try to parse as JSON, otherwise treat as text
          try {
            parsedData = JSON.parse(content)
          } catch {
            parsedData = { content }
          }

          // Apply reality distortion if needed
          if (realityState.realityDistortion > 50) {
            // Distort some of the content randomly
            if (typeof parsedData === "object") {
              // For JSON data, randomly modify some values
              Object.keys(parsedData).forEach((key) => {
                if (typeof parsedData[key] === "string" && Math.random() > 0.7) {
                  parsedData[key] = distortText(parsedData[key])
                }
              })
            } else if (typeof parsedData === "string") {
              // For text data, distort some paragraphs
              parsedData = distortText(parsedData)
            }
          }

          setTimeout(() => {
            setSuccess(true)
            setIsUploading(false)
            onUploadComplete(parsedData)
          }, 500)
        } catch (err) {
          setError("Failed to process the file")
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        clearInterval(progressInterval)
        setError("Failed to read the file")
        setIsUploading(false)
      }

      reader.readAsText(file)
    } catch (err) {
      setError("An unexpected error occurred")
      setIsUploading(false)
    }
  }

  const distortText = (text: string): string => {
    // Simple distortion: replace some characters
    return text.replace(/[aeiou]/g, (char) => {
      if (Math.random() > 0.7) {
        const replacements: Record<string, string> = {
          a: "@",
          e: "3",
          i: "1",
          o: "0",
          u: "v",
        }
        return replacements[char] || char
      }
      return char
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      // Check file type
      const fileType = droppedFile.name.split(".").pop()?.toLowerCase() || ""
      const acceptedTypes = acceptedFileTypes
        .split(",")
        .map((type) => (type.startsWith(".") ? type.substring(1) : type))

      if (!acceptedTypes.includes(fileType) && acceptedTypes.length > 0) {
        setError(`Invalid file type. Accepted types: ${acceptedFileTypes}`)
        return
      }

      // Check file size
      if (droppedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`)
        return
      }

      setFile(droppedFile)
      setError(null)
    }
  }

  return (
    <Card className="w-full border-primary/30 bg-black/70">
      <CardHeader>
        <CardTitle>Upload Book Content</CardTitle>
        <CardDescription>Upload your book content as JSON or text file</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            error ? "border-red-500" : "border-primary/40"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!file && !isUploading && !success ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Upload className="h-12 w-12 text-primary/60" />
              <div>
                <p className="text-lg font-medium">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse (max {maxSizeMB}MB)</p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-primary/30 hover:border-primary/60"
              >
                Select File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={acceptedFileTypes}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {!success && (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 overflow-hidden text-ellipsis">{file?.name}</div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isUploading}>
                    Change
                  </Button>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">Processing file... {uploadProgress}%</p>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span>File processed successfully!</span>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {file && !isUploading && !success && (
          <Button onClick={handleUpload} className="w-full bg-primary hover:bg-primary/90">
            Upload and Process
          </Button>
        )}

        {success && (
          <Button
            onClick={() => {
              setFile(null)
              setSuccess(false)
            }}
            variant="outline"
            className="w-full border-primary/30 hover:border-primary/60"
          >
            Upload Another File
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

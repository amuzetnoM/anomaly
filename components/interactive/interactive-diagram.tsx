"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type DiagramElement = {
  id: string
  label: string
  description: string
  x: number
  y: number
  width: number
  height: number
}

type DiagramProps = {
  data: {
    title: string
    description?: string
    imageUrl: string
    width: number
    height: number
    elements: DiagramElement[]
  }
  id: string
}

export function InteractiveDiagram({ data, id }: DiagramProps) {
  const [activeElement, setActiveElement] = useState<DiagramElement | null>(null)

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ width: data.width, height: data.height, maxWidth: "100%" }}>
          <img src={data.imageUrl || "/placeholder.svg"} alt={data.title} className="w-full h-auto" />

          {data.elements.map((element) => (
            <div
              key={element.id}
              className="absolute cursor-pointer border-2 border-transparent hover:border-primary rounded-md transition-colors"
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
              }}
              onClick={() => setActiveElement(element)}
            />
          ))}

          {activeElement && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-2">{activeElement.label}</h3>
              <p>{activeElement.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

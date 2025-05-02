"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

type GlossaryTerm = {
  term: string
  definition: string
  category?: string
}

type GlossaryProps = {
  data: {
    title: string
    description?: string
    terms: GlossaryTerm[]
  }
  id: string
}

export function Glossary({ data, id }: GlossaryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null)

  // Filter terms based on search query
  const filteredTerms = data.terms.filter(
    (term) =>
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search terms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
            <ul className="space-y-1">
              {filteredTerms.map((term) => (
                <li key={term.term}>
                  <button
                    className={`w-full text-left px-2 py-1.5 rounded-md hover:bg-muted ${
                      activeTerm?.term === term.term ? "bg-muted font-medium" : ""
                    }`}
                    onClick={() => setActiveTerm(term)}
                  >
                    {term.term}
                    {term.category && <span className="ml-2 text-xs text-muted-foreground">({term.category})</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-md p-4 h-[400px] overflow-y-auto">
            {activeTerm ? (
              <div>
                <h3 className="text-lg font-medium mb-2">{activeTerm.term}</h3>
                <p>{activeTerm.definition}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a term to view its definition
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

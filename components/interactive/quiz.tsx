"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useBook } from "../book-provider"
import { CheckCircle, XCircle } from "lucide-react"

type QuizQuestion = {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

type QuizProps = {
  data: {
    title: string
    description?: string
    questions: QuizQuestion[]
  }
  id: string
}

export function Quiz({ data, id }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(data.questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const { saveQuizScore } = useBook()

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
      const correctAnswers = selectedAnswers.filter(
        (answer, index) => answer === data.questions[index].correctAnswer,
      ).length
      const score = Math.round((correctAnswers / data.questions.length) * 100)
      saveQuizScore(id, score)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(Array(data.questions.length).fill(-1))
    setShowResults(false)
  }

  const question = data.questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== -1

  if (showResults) {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === data.questions[index].correctAnswer,
    ).length
    const score = Math.round((correctAnswers / data.questions.length) * 100)

    return (
      <Card className="my-6">
        <CardHeader>
          <CardTitle>{data.title} - Results</CardTitle>
          <CardDescription>
            You scored {correctAnswers} out of {data.questions.length} ({score}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.correctAnswer

            return (
              <div key={index} className="mb-4">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <p className="text-sm text-muted-foreground">Your answer: {q.options[selectedAnswers[index]]}</p>
                    {!isCorrect && (
                      <p className="text-sm text-green-600">Correct answer: {q.options[q.correctAnswer]}</p>
                    )}
                    {q.explanation && <p className="text-sm mt-1 italic">{q.explanation}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
        <CardFooter>
          <Button onClick={handleReset}>Try Again</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-lg font-medium mb-4">
            Question {currentQuestion + 1} of {data.questions.length}
          </p>
          <p className="mb-4">{question.question}</p>

          <RadioGroup
            value={selectedAnswers[currentQuestion].toString()}
            onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={!isAnswered}>
          {currentQuestion < data.questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  )
}

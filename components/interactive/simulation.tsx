"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type SimulationProps = {
  data: {
    title: string
    description?: string
    type: "physics" | "population" | "custom"
    parameters: {
      id: string
      name: string
      min: number
      max: number
      step: number
      default: number
      unit?: string
    }[]
    simulationFn?: string // Function as string to be evaluated
  }
  id: string
}

export function Simulation({ data, id }: SimulationProps) {
  // Initialize parameters with default values
  const [parameters, setParameters] = useState<Record<string, number>>(
    data.parameters.reduce(
      (acc, param) => {
        acc[param.id] = param.default
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Run the simulation when parameters change or when manually triggered
  useEffect(() => {
    if (isRunning) {
      runSimulation()
    }
  }, [isRunning, parameters])

  const handleParameterChange = (paramId: string, value: number[]) => {
    setParameters((prev) => ({
      ...prev,
      [paramId]: value[0],
    }))
  }

  const runSimulation = () => {
    let simulationResult

    // Different simulation logic based on type
    switch (data.type) {
      case "physics":
        // Simple physics simulation (e.g., projectile motion)
        const g = 9.8 // gravity
        const v0 = parameters.initialVelocity || 10
        const angle = ((parameters.angle || 45) * Math.PI) / 180
        const timeStep = 0.1
        const maxTime = parameters.time || 10

        const trajectory = []
        for (let t = 0; t <= maxTime; t += timeStep) {
          const x = v0 * Math.cos(angle) * t
          const y = v0 * Math.sin(angle) * t - 0.5 * g * t * t
          if (y < 0) break
          trajectory.push({ x, y, t })
        }

        simulationResult = {
          trajectory,
          maxHeight: Math.pow(v0 * Math.sin(angle), 2) / (2 * g),
          range: (2 * v0 * v0 * Math.sin(angle) * Math.cos(angle)) / g,
        }
        break

      case "population":
        // Simple population growth model
        const initialPop = parameters.initialPopulation || 100
        const growthRate = parameters.growthRate || 0.1
        const years = parameters.years || 10

        const populationData = []
        let currentPop = initialPop

        for (let year = 0; year <= years; year++) {
          populationData.push({ year, population: Math.round(currentPop) })
          currentPop *= 1 + growthRate
        }

        simulationResult = {
          populationData,
          finalPopulation: Math.round(initialPop * Math.pow(1 + growthRate, years)),
        }
        break

      case "custom":
        // Custom simulation using provided function
        if (data.simulationFn) {
          try {
            // Create a safe function from the string
            const simulationFunction = new Function("parameters", data.simulationFn)
            simulationResult = simulationFunction(parameters)
          } catch (error) {
            console.error("Error in custom simulation function:", error)
            simulationResult = { error: "Simulation failed to run" }
          }
        }
        break
    }

    setResult(simulationResult)
  }

  const renderSimulationResult = () => {
    if (!result) return null

    switch (data.type) {
      case "physics":
        // Render a simple canvas with the trajectory
        return (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Simulation Results</h3>
            <div className="bg-muted p-4 rounded-md">
              <p>Maximum Height: {result.maxHeight.toFixed(2)} m</p>
              <p>Range: {result.range.toFixed(2)} m</p>

              <div className="mt-4 relative h-60 border border-border rounded-md overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-px bg-border"></div>
                {result.trajectory.map((point: any, index: number) => (
                  <div
                    key={index}
                    className="absolute h-2 w-2 bg-primary rounded-full"
                    style={{
                      left: `${(point.x / result.range) * 100}%`,
                      bottom: `${(point.y / result.maxHeight) * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      case "population":
        // Render a simple bar chart
        const maxPop = Math.max(...result.populationData.map((d: any) => d.population))
        return (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Population Growth</h3>
            <p>
              Final population after {parameters.years} years: {result.finalPopulation}
            </p>

            <div className="mt-4 flex h-60 items-end space-x-2 border border-border rounded-md p-4">
              {result.populationData.map((d: any, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-primary rounded-t-sm"
                    style={{ height: `${(d.population / maxPop) * 100}%` }}
                  />
                  <span className="text-xs mt-1">{d.year}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case "custom":
        // For custom simulations, just display the result as JSON
        return (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Simulation Results</h3>
            <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        {data.description && <CardDescription>{data.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.parameters.map((param) => (
            <div key={param.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={param.id}>{param.name}</Label>
                <span>
                  {parameters[param.id]} {param.unit}
                </span>
              </div>
              <Slider
                id={param.id}
                min={param.min}
                max={param.max}
                step={param.step}
                value={[parameters[param.id]]}
                onValueChange={(value) => handleParameterChange(param.id, value)}
              />
            </div>
          ))}

          <Button
            onClick={() => {
              setIsRunning(true)
              runSimulation()
            }}
            className="mt-4"
          >
            Run Simulation
          </Button>

          {renderSimulationResult()}
        </div>
      </CardContent>
    </Card>
  )
}

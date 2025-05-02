"use client"
import { Quiz } from "./interactive/quiz"
import { InteractiveDiagram } from "./interactive/interactive-diagram"
import { Simulation } from "./interactive/simulation"
import { Glossary } from "./interactive/glossary"
import { MemoryPuzzle } from "./interactive/memory-puzzle"
import { PerceptionTest } from "./interactive/perception-test"
import { RealityChoice } from "./interactive/reality-choice"
import { UnreliableUI } from "./interactive/unreliable-ui"
import { MetaNarrative } from "./interactive/meta-narrative"
import { VisualDistortion } from "./interactive/visual-distortion"

type InteractiveElementProps = {
  type:
    | "quiz"
    | "diagram"
    | "simulation"
    | "glossary"
    | "memory-puzzle"
    | "perception-test"
    | "reality-choice"
    | "unreliable-ui"
    | "meta-narrative"
    | "visual-distortion"
  data: any
  id: string
}

export function InteractiveElement({ type, data, id }: InteractiveElementProps) {
  switch (type) {
    case "quiz":
      return <Quiz data={data} id={id} />
    case "diagram":
      return <InteractiveDiagram data={data} id={id} />
    case "simulation":
      return <Simulation data={data} id={id} />
    case "glossary":
      return <Glossary data={data} id={id} />
    case "memory-puzzle":
      return <MemoryPuzzle data={data} id={id} />
    case "perception-test":
      return <PerceptionTest data={data} id={id} />
    case "reality-choice":
      return <RealityChoice data={data} id={id} />
    case "unreliable-ui":
      return <UnreliableUI data={data} id={id} />
    case "meta-narrative":
      return <MetaNarrative data={data} id={id} />
    case "visual-distortion":
      return <VisualDistortion data={data} id={id} />
    default:
      return <div>Unknown interactive element type</div>
  }
}

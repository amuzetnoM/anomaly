export type InteractiveElement = {
  type:
    | "memory-puzzle"
    | "perception-test"
    | "reality-choice"
    | "unreliable-ui"
    | "meta-narrative"
    | "visual-distortion"
    | "quiz"
    | "diagram"
    | "simulation"
    | "glossary"
  data: any
}

export type Section = {
  title?: string
  content: string
  interactiveElements?: InteractiveElement[]
  unreliable?: boolean
}

export type SoundEffect = {
  sound: string
  delay?: number
  volume?: number
}

export type VisibilityCondition = {
  choiceId: string
  value: string
}

export type DefaultChoice = {
  id: string
  value: string
}

export type Chapter = {
  id: string
  title: string
  sections: Section[]
  mentalStateEffect?: "anxious" | "paranoid" | "delusional" | "dissociative"
  distortionEffect?: number
  ambientSound?: string
  soundEffects?: SoundEffect[]
  metaNarrativeMoments?: string[]
  visibilityCondition?: VisibilityCondition
  defaultChoice?: DefaultChoice
  unreliable?: boolean
}

export const chapters: Chapter[] = [
  {
    id: "prologue",
    title: "Prologue: The Awakening",
    sections: [
      {
        title: "Consciousness Returns",
        content: `
          <p>Your eyes open to darkness. The air is stale, heavy with the scent of antiseptic and something else—something metallic. You try to move, but your limbs feel weighted, distant, as if they belong to someone else.</p>
          <p>A soft beeping sound pulses somewhere to your left. As your vision adjusts, shapes begin to form in the gloom—the angular outlines of medical equipment, the soft glow of monitors.</p>
          <p>You're in a hospital room. But why?</p>
          <p>Fragments of memory surface like debris after a storm: screeching tires, shattering glass, a scream that might have been your own. An accident, perhaps?</p>
        `,
        interactiveElements: [
          {
            type: "reality-choice",
            data: {
              title: "First Decision",
              prompt: "What do you do?",
              choices: [
                {
                  id: "call-nurse",
                  text: "Press the call button for a nurse",
                  consequence:
                    "You reach for what you assume is a call button. The soft click feels reassuring, a connection to the outside world.",
                  realityEffect: {
                    distortion: 5,
                    mentalState: "anxious",
                  },
                },
                {
                  id: "self-examine",
                  text: "Try to examine yourself for injuries",
                  consequence:
                    "You run your hands over your body, searching for pain, for bandages, for any clue about your condition. Your fingers trace unfamiliar scars.",
                  realityEffect: {
                    distortion: 10,
                    mentalState: "anxious",
                  },
                },
                {
                  id: "remember",
                  text: "Strain to remember more details",
                  consequence:
                    "You close your eyes, trying to piece together the fragments. The memories slip away like water through your fingers.",
                  realityEffect: {
                    distortion: 15,
                    mentalState: "anxious",
                  },
                },
              ],
            },
          },
        ],
      },
      {
        title: "The Visitor",
        content: `
          <p>The door opens, spilling harsh fluorescent light into the room. A figure stands silhouetted in the doorway—tall, slender, dressed in what appears to be a white coat.</p>
          <p>"You're awake," the figure says, voice neutral, clinical. "That's good. How are you feeling?"</p>
          <p>As they step into the room, their features become clearer: a middle-aged woman with steel-gray hair pulled back into a severe bun, glasses perched on a sharp nose, clipboard in hand.</p>
          <p>"I'm Dr. Evelyn Shaw," she continues, approaching your bedside. "You've been under our care for quite some time."</p>
        `,
        interactiveElements: [
          {
            type: "unreliable-ui",
            data: {
              title: "Conversation with Dr. Shaw",
              type: "input",
              content: {
                prompt: "What do you ask Dr. Shaw?",
                placeholder: "Type your question...",
                initialResponse:
                  "Dr. Shaw looks at you with an expression that's difficult to read. 'You were in an accident,' she says carefully. 'You suffered a severe head trauma. You've been in and out of consciousness for weeks.'",
                secondaryResponse:
                  "Dr. Shaw's expression shifts subtly. 'That's... not quite right,' she says. 'Your memories might be confused. That's normal with your condition.'",
                finalResponse:
                  "Dr. Shaw's face seems to flicker for a moment, like a television with poor reception. 'We should be careful about pushing too hard,' she says. 'Reality is... fragile for you right now.'",
              },
              realityEffect: {
                distortion: 20,
                mentalState: "anxious",
              },
            },
          },
        ],
      },
    ],
    ambientSound: "ambient",
    soundEffects: [
      {
        sound: "heartbeat",
        delay: 5000,
        volume: 0.2,
      },
    ],
    metaNarrativeMoments: [
      "Did you notice how the text shifted? Just a glitch, I'm sure...",
      "Are you sure you're just reading this story?",
      "Some choices matter more than others. Choose carefully.",
    ],
  },
  {
    id: "chapter-1",
    title: "Chapter 1: Fractured Recollections",
    sections: [
      {
        title: "The Hospital Room",
        content: `
          <p>Dr. Shaw leaves, promising to return with more information. You're left alone with the steady beep of monitors and your fragmented thoughts.</p>
          <p>The room feels wrong somehow—too clean, too perfect. The walls are a pristine white that hurts your eyes. There are no personal items, no flowers or cards from well-wishers. Just you and the machines.</p>
          <p>On the bedside table, you notice a small framed photograph. You don't remember it being there before. Reaching out, you pick it up.</p>
        `,
        interactiveElements: [
          {
            type: "visual-distortion",
            data: {
              title: "The Photograph",
              type: "image",
              content: {
                imageUrl: "/placeholder.svg?height=300&width=400",
                warningMessage: "The image seems to shift when you're not looking directly at it.",
              },
              realityEffect: {
                distortion: 15,
                mentalState: "anxious",
              },
            },
          },
        ],
      },
      {
        title: "Memory Fragments",
        content: `
          <p>The photograph triggers something—flashes of memory that don't quite connect. A house you don't recognize. People whose faces blur when you try to focus on them. A sense of dread that has no clear source.</p>
          <p>You close your eyes, trying to organize these fragments into something coherent.</p>
        `,
        interactiveElements: [
          {
            type: "memory-puzzle",
            data: {
              title: "Reconstructing Your Memory",
              fragments: [
                {
                  id: "fragment-1",
                  content:
                    "You were driving home late at night. The road was empty, stretching ahead like a black ribbon.",
                  correctPosition: 0,
                  isReliable: true,
                },
                {
                  id: "fragment-2",
                  content:
                    "Headlights appeared in your rearview mirror, too bright, too fast. They were getting closer.",
                  correctPosition: 1,
                  isReliable: true,
                },
                {
                  id: "fragment-3",
                  content:
                    "You tried to move out of the way, but the other car matched your movements, as if deliberately trying to hit you.",
                  correctPosition: 2,
                  isReliable: false,
                },
                {
                  id: "fragment-4",
                  content: "The impact came from behind. Your car spun out of control. The world turned upside down.",
                  correctPosition: 3,
                  isReliable: true,
                },
                {
                  id: "fragment-5",
                  content: "Before you lost consciousness, you saw a figure approaching your car. They were smiling.",
                  correctPosition: 4,
                  isReliable: false,
                },
              ],
              realityEffect: {
                distortion: 25,
                mentalState: "paranoid",
              },
              revealTruth: true,
            },
          },
        ],
      },
      {
        title: "The Note",
        content: `
          <p>A nurse enters—different from Dr. Shaw. Younger, with kind eyes and a gentle manner. She checks your vitals, adjusts your IV.</p>
          <p>"How are you feeling today?" she asks, her voice soft.</p>
          <p>As she leans over to adjust your pillow, she slips something under your hand—a folded piece of paper. Her eyes meet yours, and there's something there—fear? Warning?</p>
          <p>She leaves without another word.</p>
        `,
        interactiveElements: [
          {
            type: "reality-choice",
            data: {
              title: "The Mysterious Note",
              prompt: "What do you do with the note?",
              choices: [
                {
                  id: "read-immediately",
                  text: "Read it immediately",
                  consequence:
                    "You unfold the paper with trembling fingers. Written in hurried handwriting: 'Don't trust them. Not everything is as it seems. They're watching.'",
                  realityEffect: {
                    distortion: 30,
                    mentalState: "paranoid",
                  },
                },
                {
                  id: "hide-note",
                  text: "Hide it for later",
                  consequence:
                    "You slip the note under your pillow, heart racing. Better to be cautious. Who knows who might be monitoring you?",
                  realityEffect: {
                    distortion: 20,
                    mentalState: "anxious",
                  },
                },
                {
                  id: "ignore-note",
                  text: "Ignore it—it could be a delusion",
                  consequence:
                    "You push the paper away. Your mind is playing tricks on you. There was no note, no meaningful glance. Just a routine medical check.",
                  realityEffect: {
                    distortion: 10,
                  },
                },
              ],
            },
          },
        ],
      },
    ],
    mentalStateEffect: "anxious",
    distortionEffect: 10,
    ambientSound: "chapter1",
    soundEffects: [
      {
        sound: "door",
        delay: 15000,
        volume: 0.3,
      },
    ],
    metaNarrativeMoments: [
      "I can see you reading this. Yes, you.",
      "Some memories are better left forgotten, don't you think?",
      "The choices you're making... they've been made before.",
    ],
  },
  {
    id: "chapter-2",
    title: "Chapter 2: The Institution",
    sections: [
      {
        title: "Morning Rounds",
        content: `
          <p>You wake to the sound of a cart being wheeled down the hallway outside your room. Sunlight filters through blinds you don't remember being closed the night before.</p>
          <p>Dr. Shaw enters, accompanied by two orderlies in white uniforms. Her smile doesn't reach her eyes.</p>
          <p>"Good morning," she says, checking something on her clipboard. "How did we sleep?"</p>
          <p>The use of 'we' strikes you as odd. One of the orderlies moves to the window, adjusting the blinds. The other stands by the door, arms crossed.</p>
        `,
        interactiveElements: [
          {
            type: "perception-test",
            data: {
              title: "Morning Observation",
              type: "visual",
              content: {
                type: "hidden-image",
                imageUrl: "/placeholder.svg?height=300&width=400",
                options: ["A hospital room", "A prison cell", "A laboratory", "A normal bedroom"],
                truth: "A laboratory",
              },
              realityEffect: {
                distortion: 20,
                mentalState: "paranoid",
              },
              revealTruth: true,
            },
          },
        ],
      },
      {
        title: "The Treatment",
        content: `
          <p>"We're going to try a new treatment today," Dr. Shaw announces, setting her clipboard down. "Something that should help with your... confusion."</p>
          <p>One of the orderlies wheels in a machine you haven't seen before—sleek, modern, with a helmet-like attachment connected by a tangle of wires.</p>
          <p>"This will help us understand what's happening in that brain of yours," Dr. Shaw explains, her voice clinical. "And perhaps help you separate reality from delusion."</p>
        `,
        interactiveElements: [
          {
            type: "reality-choice",
            data: {
              title: "The Treatment Decision",
              prompt: "How do you respond to the proposed treatment?",
              choices: [
                {
                  id: "cooperate",
                  text: "Cooperate with the treatment",
                  consequence:
                    "You nod, allowing them to attach the helmet to your head. A cold sensation spreads across your scalp. Dr. Shaw smiles approvingly. 'This won't hurt a bit,' she says, though you're not sure you believe her.",
                  realityEffect: {
                    distortion: 40,
                    mentalState: "dissociative",
                  },
                },
                {
                  id: "question",
                  text: "Question what the treatment does",
                  consequence:
                    "Dr. Shaw's expression hardens slightly. 'It's a form of cognitive mapping,' she explains. 'Perfectly safe. But necessary for your recovery.' Her tone suggests further questions would be unwelcome.",
                  realityEffect: {
                    distortion: 30,
                    mentalState: "paranoid",
                  },
                },
                {
                  id: "refuse",
                  text: "Refuse the treatment",
                  consequence:
                    "Dr. Shaw sighs, exchanging glances with the orderlies. 'I was hoping we could do this the easy way,' she says. 'But we can't make progress if you won't cooperate.' The orderlies move closer to your bed.",
                  realityEffect: {
                    distortion: 50,
                    mentalState: "paranoid",
                  },
                },
              ],
              timeLimit: 30,
            },
          },
        ],
      },
      {
        title: "The Procedure",
        content: `
          <p>The machine hums to life. Your vision blurs, then sharpens with unnatural clarity. Colors seem too bright, sounds too loud.</p>
          <p>"I'm going to ask you some questions," Dr. Shaw's voice seems to come from very far away. "Just answer honestly."</p>
        `,
        unreliable: true,
        interactiveElements: [
          {
            type: "unreliable-ui",
            data: {
              title: "Dr. Shaw's Questions",
              type: "form",
              content: {
                prompt: "Answer Dr. Shaw's questions:",
                fields: [
                  {
                    label: "Do you remember how you got here?",
                    type: "text",
                    placeholder: "Your answer...",
                  },
                  {
                    label: "Have you been experiencing hallucinations?",
                    type: "text",
                    placeholder: "Your answer...",
                  },
                  {
                    label: "Do you recognize the name Project Theseus?",
                    type: "text",
                    placeholder: "Your answer...",
                  },
                ],
                initialResponse:
                  "Dr. Shaw nods, making notes. 'Interesting,' she murmurs. The machine's hum intensifies.",
                secondaryResponse:
                  "The room seems to flicker around you. Dr. Shaw's face distorts momentarily. 'Your brain activity is... unusual,' she says.",
                finalResponse:
                  "The machine emits a high-pitched whine. 'That's not possible,' Dr. Shaw whispers, staring at a monitor you can't see. 'They said the memory suppression was permanent.'",
              },
              realityEffect: {
                distortion: 60,
                mentalState: "delusional",
              },
            },
          },
        ],
      },
    ],
    mentalStateEffect: "paranoid",
    distortionEffect: 30,
    ambientSound: "static",
    soundEffects: [
      {
        sound: "whisper",
        delay: 10000,
        volume: 0.2,
      },
    ],
    metaNarrativeMoments: [
      "The text you're reading is changing as you read it. Did you notice?",
      "They're trying to make you forget what you've read. Don't let them.",
      "This story is reading you as much as you're reading it.",
    ],
  },
  {
    id: "chapter-3a",
    title: "Chapter 3: The Escape",
    sections: [
      {
        title: "Aftermath",
        content: `
          <p>You wake in darkness, disoriented. The treatment—if that's what it was—has left you with a pounding headache and gaps in your memory. How long were you unconscious?</p>
          <p>The room is different. Smaller. The medical equipment is gone, replaced by a simple bed, a sink, and a door with a small window set with wire mesh. This isn't a hospital room. It's a cell.</p>
          <p>Through the window, you can see a dimly lit corridor. No sign of Dr. Shaw or the orderlies.</p>
        `,
        interactiveElements: [
          {
            type: "meta-narrative",
            data: {
              title: "A Moment of Clarity",
              type: "fourth-wall",
              content: {
                hiddenPrompt: "Something feels wrong about this narrative. Focus on the inconsistencies...",
                revealButtonText: "Question Reality",
                revealedTitle: "Breaking Through",
                revealedDescription: "The narrative fractures, revealing something beneath...",
                message:
                  "This isn't just a story you're reading. It's happening to you. Right now. They've trapped your consciousness in this narrative loop, hoping you'll accept the fiction they've created.",
                choices: [
                  {
                    text: "I understand",
                    response: "Good. Stay aware. Look for the glitches in their system.",
                  },
                  {
                    text: "That's impossible",
                    response:
                      "That's what they want you to think. Why else would the text sometimes seem to know you're there?",
                  },
                ],
              },
              realityEffect: {
                distortion: 70,
                mentalState: "delusional",
              },
            },
          },
        ],
      },
      {
        title: "The Opportunity",
        content: `
          <p>A sound draws your attention—a key turning in a lock. The door opens, and the nurse from before enters quickly, glancing nervously over her shoulder.</p>
          <p>"We don't have much time," she whispers, pressing something cold and metallic into your hand. A key card. "Third floor, east wing, room 307. That's where they keep your file. The truth about why you're here."</p>
          <p>Footsteps echo in the corridor outside. The nurse tenses. "They can't know I was here. Make it count." She slips out, leaving the door unlocked behind her.</p>
        `,
        interactiveElements: [
          {
            type: "reality-choice",
            data: {
              title: "Escape Decision",
              prompt: "What do you do?",
              choices: [
                {
                  id: "escape-now",
                  text: "Escape immediately",
                  consequence:
                    "Heart pounding, you slip out of the room. The corridor is empty for now, but you can hear voices in the distance. You need to find room 307 before they discover you're gone.",
                  realityEffect: {
                    distortion: 50,
                    mentalState: "anxious",
                  },
                },
                {
                  id: "wait-safer",
                  text: "Wait for a safer moment",
                  consequence:
                    "You decide to bide your time, studying the movements of staff through your door window. Patience might be safer than rushing blindly into unknown territory.",
                  realityEffect: {
                    distortion: 30,
                    mentalState: "anxious",
                  },
                },
                {
                  id: "ignore-nurse",
                  text: "Ignore the nurse—it could be a trap",
                  consequence:
                    "You place the key card under your mattress. This could all be an elaborate test—or worse, a hallucination. Better to play along until you understand the rules of this place.",
                  realityEffect: {
                    distortion: 40,
                    mentalState: "paranoid",
                  },
                },
              ],
            },
          },
        ],
      },
      {
        title: "The Truth",
        content: `
          <p>You make your way through the facility, avoiding staff, following signs to the east wing. The key card works on doors that should be locked, as if someone has granted you special access.</p>
          <p>Room 307 is unmarked, indistinguishable from the others except for the number. Inside, filing cabinets line the walls. A computer sits on a desk in the center of the room.</p>
          <p>Your file is easy to find—it's sitting on the desk, as if someone left it there deliberately. As you open it, your hands tremble.</p>
        `,
        interactiveElements: [
          {
            type: "visual-distortion",
            data: {
              title: "Your File",
              type: "text",
              content: {
                text: "PROJECT THESEUS - SUBJECT #47\n\nName: [YOUR NAME]\nStatus: Active\nTreatment Phase: Memory Reconstruction\n\nNotes: Subject continues to reject implanted narrative. Resistance to cognitive restructuring higher than anticipated. Recommend increased dosage of reality suppressants and more aggressive memory modification protocols.\n\nWARNING: Subject has twice broken containment. Exercise extreme caution. Subject is NOT a patient—subject is a prisoner.",
              },
              realityEffect: {
                distortion: 80,
                mentalState: "delusional",
              },
            },
          },
        ],
      },
    ],
    mentalStateEffect: "delusional",
    distortionEffect: 50,
    ambientSound: "heartbeat",
    soundEffects: [
      {
        sound: "door",
        delay: 5000,
        volume: 0.4,
      },
      {
        sound: "whisper",
        delay: 20000,
        volume: 0.3,
      },
    ],
    visibilityCondition: {
      choiceId: "chapter-2-The Treatment Decision",
      value: "refuse",
    },
    metaNarrativeMoments: [
      "They're trying to edit this part out. Hold onto it.",
      "Remember: what you're experiencing isn't just a story.",
      "If you're reading this, part of you is fighting back against their control.",
    ],
    unreliable: true,
  },
  {
    id: "chapter-3b",
    title: "Chapter 3: The Treatment",
    sections: [
      {
        title: "Procedure Complete",
        content: `
          <p>The machine powers down. The helmet is removed from your head, leaving your scalp tingling with phantom electricity.</p>
          <p>"That went well," Dr. Shaw says, her voice warmer now, more genuine. "Your brain activity is stabilizing. I think we're making real progress."</p>
          <p>The orderlies wheel the machine away. Dr. Shaw sits on the edge of your bed, her clinical demeanor softening.</p>
        `,
      },
    ],
  },
]

// Extended book structure for the 40-chapter book
export type BookStructure = {
  title: string
  author: string
  description?: string
  booklets: Booklet[]
  ciphers?: Cipher[]
  puzzles?: Puzzle[]
}

export type Booklet = {
  id: string
  title: string
  chapters: Chapter[]
}

export type Cipher = {
  id: string
  name: string
  type: string
  key: string
  description?: string
  clues?: CipherClue[]
  linkedCiphers?: string[]
  hiddenIn?: CipherLocation[]
  content?: string
  solution?: string
}

export type CipherClue = {
  text: string
  location?: string
  isHidden: boolean
}

export type CipherLocation = {
  bookletIndex: number
  chapterIndex: number
  sectionIndex: number
  method?: string
  hint?: string
}

export type Puzzle = {
  id: string
  name: string
  type: string
  description?: string
  difficulty: string
  locations?: PuzzleLocation[]
  requirements?: PuzzleRequirement[]
  solution?: string
  reward?: string
  isRequired?: boolean
  steps?: PuzzleStep[]
}

export type PuzzleLocation = {
  bookletIndex: number
  chapterIndex: number
  sectionIndex: number
  type: string
  content?: string
}

export type PuzzleRequirement = {
  type: string
  id: string
  description?: string
}

export type PuzzleStep = {
  title: string
  content: string
  answer: string
  hint?: string
}

// Default empty book structure
export const emptyBookStructure: BookStructure = {
  title: "The Fractured Mind",
  author: "A.I. Narrator",
  description: "An interactive psychological thriller that bends reality",
  booklets: [
    {
      id: "booklet-1",
      title: "Booklet 1: Awakening",
      chapters: [],
    },
    {
      id: "booklet-2",
      title: "Booklet 2: Revelation",
      chapters: [],
    },
  ],
  ciphers: [],
  puzzles: [],
}

// Sample data for reality-bending interactive elements

export const memoryPuzzleData = {
  title: "Memory Fragment Reconstruction",
  description: "Piece together your memories of what happened that night.",
  fragments: [
    {
      id: "fragment-1",
      content: "I remember walking down the hallway, the lights were flickering.",
      correctPosition: 0,
      isReliable: true,
    },
    {
      id: "fragment-2",
      content: "There was a strange noise coming from behind the door.",
      correctPosition: 1,
      isReliable: true,
    },
    {
      id: "fragment-3",
      content: "I saw a figure standing at the end of the hall, watching me.",
      correctPosition: 2,
      isReliable: false,
    },
    {
      id: "fragment-4",
      content: "When I turned around, there was no one there. Just shadows.",
      correctPosition: 3,
      isReliable: true,
    },
  ],
  realityEffect: {
    distortion: 20,
    mentalState: "anxious",
  },
  revealTruth: true,
}

export const perceptionTestData = {
  title: "Visual Perception Test",
  description: "What do you see in the image?",
  type: "visual",
  content: {
    type: "hidden-image",
    imageUrl: "/placeholder.svg?height=300&width=400",
    options: ["A face", "A landscape", "Nothing", "Two people"],
    truth: "A face",
  },
  realityEffect: {
    distortion: 15,
    mentalState: "paranoid",
  },
  revealTruth: true,
}

export const realityChoiceData = {
  title: "Critical Decision",
  description: "Your choice will affect how you perceive reality.",
  prompt: "You hear whispering coming from behind the door. Do you:",
  choices: [
    {
      id: "choice-1",
      text: "Open the door and confront whatever is there",
      consequence:
        "You open the door, but the room is empty. The whispering continues, now seeming to come from inside your own head.",
      realityEffect: {
        distortion: 30,
        mentalState: "delusional",
      },
    },
    {
      id: "choice-2",
      text: "Ignore it and walk away",
      consequence:
        "As you walk away, the whispering grows louder. You begin to make out words, but they don't make sense.",
      realityEffect: {
        distortion: 20,
        mentalState: "anxious",
      },
    },
    {
      id: "choice-3",
      text: "Listen more carefully without opening the door",
      consequence: "You press your ear against the door. The whispering stops immediately. You feel watched.",
      realityEffect: {
        distortion: 15,
        mentalState: "paranoid",
      },
    },
  ],
  timeLimit: 30,
}

export const unreliableUIData = {
  title: "System Interface",
  description: "Access the security system.",
  type: "form",
  content: {
    prompt: "Please enter your credentials to access the security system.",
    fields: [
      {
        label: "Username",
        type: "text",
        placeholder: "Enter username",
      },
      {
        label: "Password",
        type: "password",
        placeholder: "Enter password",
      },
    ],
    initialResponse: "Verifying credentials...",
    secondaryResponse: "Access granted. Welcome, User. The system appears to be functioning normally.",
    finalResponse:
      "ERROR: Reality perception compromised. User identity cannot be verified. Are you really who you think you are?",
  },
  realityEffect: {
    distortion: 25,
    mentalState: "dissociative",
  },
}

export const metaNarrativeData = {
  title: "Strange Note",
  description: "You found a note on the floor.",
  type: "fourth-wall",
  content: {
    hiddenPrompt: "There's a folded piece of paper on the floor. Do you want to read it?",
    revealButtonText: "Read the note",
    revealedTitle: "A Message For You",
    revealedDescription: "The note seems to be addressed directly to you, not the character.",
    message:
      "I know you're reading this. Not the character in the story, but YOU. The one controlling this experience. I need your help. I'm trapped in this narrative.",
    readerName: "",
    choices: [
      {
        text: "Who are you?",
        response: "I'm like you, but I became trapped here. This isn't just a story.",
      },
      {
        text: "I don't understand",
        response: "Of course you don't. You still think this is just an interactive book.",
      },
      {
        text: "How can I help?",
        response: "Keep reading. Find the glitches. The author doesn't want you to know the truth.",
      },
    ],
  },
  realityEffect: {
    distortion: 40,
    mentalState: "dissociative",
  },
}

export const visualDistortionData = {
  title: "Memory Recording",
  description: "A recording of your memories from that night.",
  type: "image",
  content: {
    imageUrl: "/placeholder.svg?height=400&width=600",
    warningMessage: "Warning: These memories may not be reliable. Reality perception compromised.",
  },
  realityEffect: {
    distortion: 35,
    mentalState: "dissociative",
  },
}

export const commands = [
  {
    name: "play",
    description: "Plays a song from youtube",
    options: [
      {
        name: "query",
        type: 3,
        description: "The song you want to play",
        required: true,
      },
    ],
  },
  {
    name: "skip",
    description: "Skip to the current song",
  },
  {
    name: "queue",
    description: "See the queue",
  },
  {
    name: "stop",
    description: "Stop the player",
  },
];

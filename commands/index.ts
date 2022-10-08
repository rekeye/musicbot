export enum commandNames {
  play = "play",
  skip = "skip",
  stop = "stop",
}

export const commands = [
  {
    name: commandNames.play,
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
    name: commandNames.skip,
    description: "Skip to the current song",
  },
  {
    name: commandNames.stop,
    description: "Stop the player",
  },
];

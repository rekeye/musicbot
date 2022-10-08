export enum commandNames {
  play = "play",
  skip = "skip",
  stop = "stop",
  loop = "loop",
  loopTrack = "looptrack",
  nightcore = "nightcore",
  bassboost = "bassboost",
  clearFilters = "clearfilters",
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
  {
    name: commandNames.loop,
    description: "Loops the current queue",
  },
  {
    name: commandNames.loopTrack,
    description: "Loops the currently playing track",
  },
  {
    name: commandNames.nightcore,
    description: "Enables a nightcore audio filter",
  },
  {
    name: commandNames.bassboost,
    description: "Enables a bassboost audio filter",
  },
  {
    name: commandNames.clearFilters,
    description: "Disables all filters",
  },
];

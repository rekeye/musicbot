import { Client } from "discord.js";
import { Player, Queue } from "discord-player";

/**
 * It initializes the player and sets up event listeners for the player
 * @param {Client} client - The client that the player will be attached to.
 * @returns A function that takes in a client and returns a player.
 */
export const initPlayer = (client: Client): Player => {
  const player = new Player(client);

  player.on("error", (queue, error) =>
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`)
  );
  player.on("connectionError", (queue, error) =>
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`)
  );
  player.on("trackStart", (queue: Queue<any>, track) => {
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
  });
  player.on("trackAdd", (queue: Queue<any>, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
  });
  player.on("botDisconnect", (queue: Queue<any>) => {
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
  });
  player.on("channelEmpty", (queue: Queue<any>) => {
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
  });
  player.on("queueEnd", (queue: Queue<any>) => {
    queue.metadata.send("✅ | Queue finished!");
  });

  return player;
};

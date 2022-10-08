import { Client, GuildMember, Message } from "discord.js";
import { initPlayer } from "./player";
import { commands } from "./commands";
import { QueryType } from "discord-player";
import ytdl from "ytdl-core";

require("dotenv").config();

// Client setup
const client = new Client({
  intents: ["GuildMessages", "Guilds", "GuildVoiceStates", "MessageContent"],
});

client.login(process.env.TOKEN);

client.once("ready", () => console.log(`Logged in as ${client.user?.tag}`));
client.on("error", console.error);
client.on("warn", console.warn);

// Player initialisation
const player = initPlayer(client);

// Slash commands setup
client.on("messageCreate", async (message: Message) => {
  if (message.content === "!deploy") {
    await message.guild?.commands.set(commands);
    await message.reply("Deployed!");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return;

  if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channelId) {
    return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
  }

  if (interaction.commandName === "play") {
    await interaction.deferReply();

    const query = interaction.options.get("query")?.value as string;

    const searchResult = await player
      .search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .catch(() => {});
    if (!searchResult || !searchResult.tracks.length)
      return void interaction.followUp({ content: "No results were found!" });
    if (!interaction.guild) return void interaction.followUp({ content: "Something went wrong!" });

    const queue = player.createQueue(interaction.guild, {
      metadata: interaction.channel,
      async onBeforeCreateStream(track, _source, _queue) {
        return ytdl(track.url, {
          filter: "audioonly",
          quality: "highestaudio",
          highWaterMark: 1 << 25,
        });
      },
    });

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channelId);
    } catch {
      void player.deleteQueue(interaction.guildId);
      return void interaction.followUp({ content: "Could not join your voice channel!" });
    }

    await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` });
    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) await queue.play();
  }

  if (interaction.commandName === "skip") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!",
    });
  }
  if (interaction.commandName === "stop") {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
    queue.destroy();
    return void interaction.followUp({ content: "🛑 | Stopped the player!" });
  }
});

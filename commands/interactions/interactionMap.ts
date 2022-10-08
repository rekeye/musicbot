import { AudioFilters, Player, QueryType, QueueFilters } from "discord-player";
import ytdl from "ytdl-core";
import { commandNames } from "..";

export const interactions = new Map<string, (interaction: any, player: Player) => void>();

interactions.set(commandNames.play, async (interaction: any, player: Player) => {
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
    if (!queue.connection) await queue.connect(interaction.member?.voice.channelId);
  } catch {
    void player.deleteQueue(interaction.guildId);
    return void interaction.followUp({ content: "Could not join your voice channel!" });
  }

  await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? "playlist" : "track"}...` });
  searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
  if (!queue.playing) await queue.play();
});
interactions.set(commandNames.skip, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;
  const currentTrack = queue.current;
  const success = queue.skip();
  return void interaction.followUp({
    content: success ? `✅ | Skipped **${currentTrack}**!` : "❌ | Something went wrong!",
  });
});
interactions.set(commandNames.stop, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;
  queue.destroy();
  return void interaction.followUp({ content: "🛑 | Stopped the player!" });
});
interactions.set(commandNames.loop, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;
  queue.setRepeatMode(2);
  return void interaction.followUp({
    content: "✅ | Looped currently playing songs",
  });
});
interactions.set(commandNames.loopTrack, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;
  queue.setRepeatMode(1);
  return void interaction.followUp({
    content: "✅ | Looped currently playing song",
  });
});
interactions.set(commandNames.nightcore, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;

  const filters: QueueFilters = { nightcore: true };
  queue.setFilters(filters);

  return void interaction.followUp({
    content: "✅ | Enabled nightcore filter",
  });
});
interactions.set(commandNames.bassboost, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;

  const filters: QueueFilters = { bassboost: true };
  queue.setFilters(filters);

  return void interaction.followUp({
    content: "✅ | Enabled bassboost filter",
  });
});
interactions.set(commandNames.clearFilters, async (interaction: any, player: Player) => {
  await interaction.deferReply();
  const queue = getQueue(interaction, player);
  if (!queue) return;

  queue.setFilters({});

  return void interaction.followUp({
    content: "✅ | Disabled all filters",
  });
});

const getQueue = (interaction: any, player: Player) => {
  const queue = player.getQueue(interaction.guildId);
  if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
  return queue;
};

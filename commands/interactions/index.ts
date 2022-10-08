import { Client, GuildMember } from "discord.js";
import { Player } from "discord-player";
import { interactions } from "./interactionMap";

export const setupInteractions = (client: Client, player: Player) => {
  return client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channelId) {
      return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    }

    const command = interactions.get(interaction.commandName);
    if (command) command(interaction, player);
  });
};

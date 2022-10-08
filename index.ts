import { Client, Message } from "discord.js";
import { initPlayer } from "./player";
import { commands } from "./commands";

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

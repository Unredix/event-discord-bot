const { Client, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", (message) => {
  if (message.content === "!embed") {
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Sample Embed")
      .setDescription("This is an example of an embed message")
      .setTimestamp()
      .setFooter("Some footer text here", "https://i.imgur.com/wSTFkRM.png");

    message.channel.send({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);

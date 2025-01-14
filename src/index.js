import dotenv from "dotenv";
import pkg from "discord.js";

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = pkg;

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  console.log(`Interaction received: ${interaction.type}`);

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "submit") {
      const code = interaction.options.getString("code");
      const submitter = interaction.user;

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("approved")
          .setLabel("Approved")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅"), // Add emoji

        new ButtonBuilder()
          .setCustomId("not_approved")
          .setLabel("Not Approved")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌"), // Add emoji

        new ButtonBuilder()
          .setCustomId("other")
          .setLabel("Other")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❓") // Add emoji
      );

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Code Submission")
        .setDescription(`\`\`\`${code}\`\`\``)
        .addFields(
          { name: "Submitted by", value: `${submitter.tag}`, inline: true },

          {
            name: "Submitted in",
            value: `${interaction.channel.name}`,
            inline: true,
          },
          {
            name: "Status",
            value: "Pending approval",
            inline: false,
          }
        )
        .setTimestamp();

      const targetChannel = interaction.guild.channels.cache.get(
        `${process.env.SUBMIT_CHANNEL_ID}`
      ); // Replace with your target channel ID

      if (targetChannel) {
        await targetChannel.send({ embeds: [embed], components: [row] });
      }

      await interaction.reply({
        content: "Your code has been submitted!",
        ephemeral: true,
      });
    } else if (interaction.commandName === "clear") {
      const count = interaction.options.getInteger("count");
      await interaction.channel.bulkDelete(count);
      await interaction.reply({
        content: `Deleted ${count} messages.`,
      });
    }
  } else if (interaction.isButton()) {
    console.log(`Button interaction received: ${interaction.customId}`);

    if (interaction.customId === "approved") {
      await interaction.reply({
        content: "You clicked Approved!",
        ephemeral: true,
      });
    } else if (interaction.customId === "not_approved") {
      await interaction.reply({
        content: "You clicked Not Approved!",
        ephemeral: true,
      });
    } else if (interaction.customId === "other") {
      await interaction.reply({
        content: "You clicked Other!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.reply("pong");
  }
});

client.login(process.env.TOKEN);

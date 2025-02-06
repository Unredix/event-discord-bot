import dotenv from "dotenv";
import pkg from "discord.js";
import { PermissionsBitField } from "discord.js";
import { registerUser, unregisterUser } from "../models/registerHandler.js";

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
  if (interaction.isChatInputCommand()) {
    const roleId = `${process.env.PARTICIPANT_ROLE_ID}`;

    if (interaction.commandName === "submit") {
      if (!interaction.member.roles.cache.has(roleId)) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

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
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.ManageMessages
        )
      ) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case "register":
      await registerUser(interaction);

      interaction.member.roles.add(process.env.PARTICIPANT_ROLE_ID);

      break;

    case "unregister":
      await unregisterUser(interaction);

      interaction.member.roles.remove(process.env.PARTICIPANT_ROLE_ID);

      break;
  }
});

client.login(process.env.TOKEN);

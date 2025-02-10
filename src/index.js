import dotenv from "dotenv";
import pkg from "discord.js";
import { PermissionsBitField } from "discord.js";
import { registerUser, unregisterUser } from "../models/registerHandler.js";
import { functionstart } from "./startfunction.js";
import { approvedSubmit, declinedSubmit } from "./approveHandler.js";
import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { Submits } from "../models/Submits.js";

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = pkg;

dotenv.config();

class IDGenerator {
  constructor() {
    this.counter = 0;
  }

  generate() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    const counterPart = (this.counter++).toString(36).padStart(2, "0");

    return `${timestamp}${randomPart}${counterPart}`;
  }
}

const idGenerator = new IDGenerator();

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
    const roleId = `${process.env.PARTICIPANT_ROLE_ID}`;

    if (interaction.commandName === "submit") {
      if (!interaction.member.roles.cache.has(roleId)) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const attachment = interaction.options.getAttachment("attachment");
      const submitter = interaction.user;
      const submitId = idGenerator.generate();

      function SubmitID() {
        return submitId
      }

      await Submits.create({
        SUBMIT_ID: submitId,
        username: submitter.tag,
        approval: "undecided",
      });

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
          .setEmoji("✖️"), // Add emoji

        new ButtonBuilder()
          .setCustomId("other")
          .setLabel("Other")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❓") // Add emoji
      );

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Code Submission")
        .addFields(
          { name: "Submitted by", value: `${submitter.tag}`, inline: true },
          {
            name: "Submitted in",
            value: `${interaction.channel?.name || "Unknown"}`,
            inline: true,
          },
          { name: "Submit ID", value: submitId, inline: false },
          { name: "Status", value: "Pending approval", inline: false },
          { name: "Points", value: "not yet known", inline: true },
          { name: "Time of submission", value: "0", inline: true }
        )
        .setTimestamp();

      if (attachment) {
        embed.addFields({
          name: "Attachment",
          value: `[${attachment.name}](${attachment.url})`,
          inline: false,
        });
      }

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
        ephemeral: true,
      });
    } else if (interaction.commandName === "start") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const TARGET_ROLE_ID = "1336742482720985239";
      const NEW_ROLE_ID = "1336726820221095936";

      await functionstart(interaction, TARGET_ROLE_ID, NEW_ROLE_ID);
    } else if (interaction.commandName === "addpoints") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const user = interaction.options.getUser("user");
      const points = interaction.options.getInteger("points");

      await addPoints(user.tag, points);

      const newPoints = await getPoints(user.tag);

      await interaction.reply({
        content: `${points} hozzá lett adva ${user.tag}-hoz/hez. Új pontszám: ${newPoints}`,
        ephemeral: true,
      });
    } else if (interaction.commandName == "removepoints") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const user = interaction.options.getUser("user");
      const points = interaction.options.getInteger("points");

      await removePoints(user.tag, points);

      const newPoints = await getPoints(user.tag);

      await interaction.reply({
        content: `${points} levonva ${user.tag}-tól. Új pontszám: ${newPoints}`,
        ephemeral: true,
      });
    } else if (interaction.commandName == "getpoints") {
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      const user = interaction.options.getUser("user");

      const points = await getPoints(user.tag);

      await interaction.reply({
        content: `${user.tag} pontszáma: ${points}`,
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    console.log(`Button interaction received: ${interaction.customId}`);

    if (interaction.customId === "approved") {
      await approvedSubmit(SubmitID());
      await interaction.reply({
        content: "You clicked Approved!",
        ephemeral: true,
      });
    } else if (interaction.customId === "not_approved") {
      await declinedSubmit(interaction.user.tag);
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

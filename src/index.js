import dotenv from "dotenv";
import pkg from "discord.js";
import { PermissionsBitField } from "discord.js";
import {
  registerUser,
  unregisterUser,
  forceRegisterUser,
  forceUnRegisterUser,
} from "../models/registerHandler.js";
import { functionstart } from "./startfunction.js";
import { approvedSubmit, declinedSubmit } from "./approveHandler.js";
import { addPoints, removePoints, getPoints } from "./pointsHandler.js";
import { Submits } from "../models/Submits.js";
import {
  refreshLeaderboardMain,
  refreshLeaderboardA1,
  refreshLeaderboardA2,
} from "./leaderboardRefresh.js";
import { pauseTimer } from "./timeHandler.js";

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
    this.submitId = "";
  }

  generate() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    const counterPart = (this.counter++).toString(36).padStart(2, "0");

    this.submitId = `${timestamp}${randomPart}${counterPart}`;
    return this.submitId;
  }
}

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
  console.log("\x1b[36m%s\x1b[0m", `INFO`, `Logged in as ${client.user.tag}!`);
});

client.on("ready", async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  const channelId = process.env.LEADERBOARD_CHANNEL_ID;
  if (guild && channelId) {
    const targetChannel = guild.channels.cache.get(channelId);
    if (targetChannel) {
      const messages = await targetChannel.messages.fetch({ limit: 3 });
      if (messages.size > 0) {
        await messages.forEach((message) => message.delete());
      }
    }
    await refreshLeaderboardMain(guild, channelId);
    await refreshLeaderboardA1(guild, channelId);
    await refreshLeaderboardA2(guild, channelId);
    setInterval(() => refreshLeaderboardMain(guild, channelId), 30000);
    setInterval(() => refreshLeaderboardA1(guild, channelId), 30000);
    setInterval(() => refreshLeaderboardA2(guild, channelId), 30000);
  }
});

client.on("interactionCreate", async (interaction) => {
  // console.log(`Interaction received: ${interaction.type}`);

  const idGenerator = new IDGenerator();
  const submitId = idGenerator.generate();

  console.log("\x1b[36m%s\x1b[0m", `INFO`, `Generated submit ID: ${submitId}`);

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

      console.log(
        "\x1b[36m%s\x1b[0m",
        `INFO`,
        "Creating new submission record:",
        submitId,
        submitter.tag
      );

      await Submits.create({
        SUBMIT_ID: submitId,
        username: submitter.tag,
        approval: "undecided",
      });

      console.log(
        "\x1b[93m%s\x1b[0m",
        `ACTION`,
        `Submission received from ${submitter.tag}`
      );

      pauseTimer(submitter.tag);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`approved`)
          .setLabel("Approved")
          .setStyle(ButtonStyle.Success)
          .setEmoji("✅"),

        new ButtonBuilder()
          .setCustomId(`not_approved`)
          .setLabel("Not Approved")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("✖️"),

        new ButtonBuilder()
          .setCustomId(`other`)
          .setLabel("Other")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❓")
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
        content: "A kódodat sikeresen elküldted!",
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
    console.log(
      "\x1b[93m%s\x1b[0m",
      `ACTION`,
      `Button interaction received: ${interaction.customId}`
    );

    // const [action, submitId] = interaction.customId.split("_");

    // if (action === "approved") {
    //   await approvedSubmit(submitId, interaction.guild);
    //   await interaction.reply({
    //     content: `Submission **${submitId}** has been approved!`,
    //     ephemeral: true,
    //   });
    // } else if (action === "not") {
    //   console.log(submitId);
    //   await declinedSubmit(submitId, interaction.guild);
    //   await interaction.reply({
    //     content: `Submission **${submitId}** was not approved!`,
    //     ephemeral: true,
    //   });
    // } else if (action === "other") {
    //   await interaction.reply({
    //     content: "You clicked Other!",
    //     ephemeral: true,
    //   });
    // }

    // TODO: Editelni kéne valahogy a embedet scopon kívül...

    if (interaction.customId === "approved") {
      approvedSubmit(submitId, interaction.guild);
      interaction;
      await interaction.reply({
        content: `Submission has been approved!`,
        ephemeral: true,
      });
    } else if (interaction.customId === "not_approved") {
      declinedSubmit(submitId, interaction.guild);
      await interaction.reply({
        content: `Submission was not approved!`,
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
    case "forceregister":
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "Nincs jogosultságod ehhez a parancshoz!",
          ephemeral: true,
        });
      } else {
        const target = interaction.options.getUser("user");
        const group = interaction.options.getString("group");

        await forceRegisterUser(target.tag, group);

        interaction.reply({
          content: `Nézd meg a console-t több információért!`,
          ephemeral: true,
        });
      }
      break;

    case "forceunregister":
      if (
        !interaction.member.permissions.has(
          PermissionsBitField.Flags.Administrator
        )
      ) {
        return interaction.reply({
          content: "Nincs jogosultságod ehhez a parancshoz!",
          ephemeral: true,
        });
      } else {
        const target = interaction.options.getUser("user");

        await forceUnRegisterUser(target.tag);

        interaction.reply({
          content: `Nézd meg a console-t több információért!`,
          ephemeral: true,
        });
      }
      break;
  }
});

client.login(process.env.TOKEN);

const fs = require('fs');
const ms = require('ms');
const chalk = require('chalk');
//const McPing = require('mc-ping-updated');
//const ping = require('mcping-js');
const util = require('minecraft-server-util');

const {
  Client,
  Collection,
  GatewayIntentBits,
  ActivityType,
  Intents,
  AuditLogEvent,
  Events,
} = require('discord.js');


const config = require('./config.json');

const Welcomer = require('./structures/Welcomer.js');

const client = new Client({
  intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.GUILD_VOICE_STATES],
});

const Discord = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
client.discord = Discord;
client.config = config;

const configuration = new Configuration({
  apiKey: require('./config.json').apiKey,
});

const openai = new OpenAIApi(configuration);
const xpfile = require("./xp.json");

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

//Eventos
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  };
});

// Status
client.on('ready', async () => {

  const updateStatus = () => {
    const duration = ms(client.uptime, { long: true });
    client.user.setPresence({
      activities: [{
        name: `for: ${duration}`,
        type: "WATCHING"
      }],
      status: 'dnd',
    });
  };

  updateStatus();

  setInterval(updateStatus, 1000);
});

client.on('ready', async () => {
  const channel = client.channels.cache.get(client.config.MinecraftChannel);

  const options = {
    sessionID: 1,
    enableSRV: true
  };
  console.log(chalk.green('[Minecraft Server Status]') + chalk.cyan(' Sent the widget..'))
  let lastMessage;
  setInterval(() => {
    util.queryFull('localhost', 25565, options).then((result) => {
      let playerList = result.players.list.join(", ");
      if (!playerList) {
        playerList = "No players online";
      }
  
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `SERVER_NAME`, iconURL: "" })
        .setTitle(`${result.hostIP} ◾️ ${result.hostPort} ◾️ 👥${result.players.online}/${result.players.max}`)
        .setDescription(`**${playerList}**`)
  
      if (!lastMessage) {
        channel.send({ embeds: [embed] }).then(message => {
          lastMessage = message;
        })
      } else {
        lastMessage.edit({ embeds: [embed] });
      }
    }).catch((error) => {
  
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `SERVER_NAME`, iconURL: "" })
        .setTitle(`SERVER_IP ◾️ SERVER_PORT ◾️ 👥OFFLINE`)
  
      if (!lastMessage) {
        channel.send({ embeds: [embed] }).then(message => {
          lastMessage = message;
        })
      } else {
        lastMessage.edit({ embeds: [embed] });
      }
    });
  }, 15000);
});

client.login(require('./config.json').token);
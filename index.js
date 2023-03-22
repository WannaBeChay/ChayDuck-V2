const fs = require('fs');
const ms = require('ms');
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

//XP
client.on('messageCreate', function (message) {

  if (message.author.bot) return;
  var addXP = Math.floor(Math.random() * 5) + 2;
  if (!xpfile[message.author.id]) {
    xpfile[message.author.id] = {
      xp: 0,
      level: 0,
      reqxp: 50
    }

    fs.writeFile("./xp.json", JSON.stringify(xpfile), function (err) {
      if (err) console.log(err)
    })
  } else {
    xpfile[message.author.id].xp += addXP
    //console.log(xpfile[message.author.id].xp)
    //console.log(addXP)
    if (xpfile[message.author.id].xp > xpfile[message.author.id].reqxp) {
      //xpfile[message.author.id].xp -= 
      xpfile[message.author.id].reqxp *= 3.5 //xp que é preciso aumentar
      xpfile[message.author.id].reqxp = Math.floor(xpfile[message.author.id].reqxp) //reqxp volta
      xpfile[message.author.id].level += 1 // Adicionar level
      xpfile[message.author.id].reqxp // retirar xp

      // Find the user's rank
      const sortedXP = Object.entries(xpfile).sort((a, b) => b[1].xp - a[1].xp);
      const userRank = sortedXP.findIndex(([id]) => id === message.author.id) + 1;

      message.reply("Now you are on Level **" + xpfile[message.author.id].level + "**! Your rank is **#" + userRank + "**.")//.then(message => message.delete({timeout: "1000000"}))
    }

    fs.writeFile("./xp.json", JSON.stringify(xpfile), function (err) {
      if (err) console.log(err)
    })
  }
});

client.login(require('./config.json').token);
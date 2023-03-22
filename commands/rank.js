const Discord = require('discord.js');
const fs = require('fs');
const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('See your rank!')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('See other people ranks.')
      .setRequired(false)),
  async execute(interaction, client) {
    // Read in xp file
    const xpData = fs.readFileSync('./xp.json', 'utf8');
    client.xpfile = JSON.parse(xpData);

    // Get target user or default to author
    const user = interaction.options.getUser('target') || interaction.user;

    if (!client.xpfile[user.id]) {
      return interaction.reply({
        content: 'This user has not earned any XP yet.'
      });
    }

    const xpInfo = client.xpfile[user.id];
    const xpToNextLevel = xpInfo.reqxp - xpInfo.xp;

    // Find the user's rank
    const sortedXP = Object.entries(client.xpfile).sort(([, a], [, b]) => b.xp - a.xp);
    const userRank = sortedXP.findIndex(([id]) => id === user.id) + 1;

    const embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`Rank for ${user.username}`)
      .setDescription(`**Global Rank #${userRank}**`)
      .addField('XP:', `${xpInfo.xp}`, true)
      .addField('Level:', `${xpInfo.level}`, true)
      .addField('Required XP to Level Up', `${xpToNextLevel}`, false)
      .setThumbnail(user.avatarURL())

    await interaction.reply({
      embeds: [embed]
    });
  },
};

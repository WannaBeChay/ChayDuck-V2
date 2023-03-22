const Discord = require('discord.js');
const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('See the top 10 users based on XP!'),
  async execute(interaction, client) {
    // Read in xp file
    const xpData = fs.readFileSync('./xp.json', 'utf8');
    client.xpfile = JSON.parse(xpData);

    // Sort users by XP
    const sortedXP = Object.entries(client.xpfile).sort((a, b) => b[1].xp - a[1].xp);

    // Create leaderboard
    const leaderboard = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Top 10 Users Based on XP')
      .setThumbnail('https://cdn-icons-png.flaticon.com/512/4489/4489655.png');

    // Add top 10 users to leaderboard
    for (let i = 0; i < 10 && i < sortedXP.length; i++) {
      const [id, xpInfo] = sortedXP[i];
      const user = await client.users.fetch(id);
      leaderboard.addField(`**${i + 1}#** ${user.username}`, `**XP:** ${xpInfo.xp} | **Level:** ${xpInfo.level}`);
    }

    await interaction.reply({
      embeds: [leaderboard]
    });
  },
};

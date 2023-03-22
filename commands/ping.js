const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Watch the ping'),
    async execute(interaction, client) {
      const embed = new client.discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('**Pong 🏓**')
        .setThumbnail('https://i.pinimg.com/originals/e6/10/9e/e6109e32a9ac1a8f2496d7fba78e9c84.gif')
        .addFields(
            { name: '``Ping``', value: `${client.ws.ping}ms`, inline: true },)
        .setTimestamp()
      await interaction.reply({
        embeds: [embed]
      });
    },
  };
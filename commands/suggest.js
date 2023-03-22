const Discord = require('discord.js');

const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('suggest')
      .setDescription('Make a suggestion')
      .addStringOption(option =>
        option.setName("description")
            .setDescription("Describe your suggestion clearly.")
            .setRequired(true)
    ),
    async execute(interaction, client) {
      const { options, guildId, member, user, guild } = interaction;

      const description = interaction.options.getString("description");
        
      const suggChannel = client.channels.cache.get(client.config.suggestionChannel)

      if (!suggChannel) {
          return interaction.channel.send("Could not find suggestion channel, check staff support!");}

    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `Suggestion from ${interaction.user.username}`})
        .setDescription(`**${description}**`)
        //.setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        await interaction.reply({
          content: 'Suggestion sent!',
          ephemeral: true
        });
    
    const message = await suggChannel.send({
        embeds: [embed],
        });

    //Add reacts  
    //message.react('⭐');
}}
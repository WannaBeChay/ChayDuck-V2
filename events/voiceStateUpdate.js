const config = require('../config.json');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState, client) {
    const logchannel = client.channels.cache.get(config.channels.channellog);
    const guild = newState.guild;
    
    // Check if the user joined a voice channel
    if (!oldState.channelId && newState.channelId) {
      const embed = new client.discord.MessageEmbed()
        .setAuthor('User joined a voice channel!', client.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `<@${newState.member.id}>`, inline: true },
          { name: 'Channel', value: `<#${newState.channelId}>`, inline: true }
        )
        .setTimestamp();
        
      logchannel.send({ embeds: [embed] });
    }
    
    // Check if the user left a voice channel
    if (oldState.channelId && !newState.channelId) {
      const embed = new client.discord.MessageEmbed()
        .setAuthor('User left a voice channel!', client.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'User', value: `<@${oldState.member.id}>`, inline: true },
          { name: 'Channel', value: `<#${oldState.channelId}>`, inline: true }
        )
        .setTimestamp();
        
      logchannel.send({ embeds: [embed] });
    }
  }
};
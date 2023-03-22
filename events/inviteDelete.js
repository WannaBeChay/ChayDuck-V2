const config = require('../config.json');

module.exports = {
name: 'inviteDelete',
async execute(invite, client) {

      let logChannel = client.channels.cache.get(config.channels.channellog);
  
      const embed = new client.discord.MessageEmbed()
        .setTitle('Invite deleted')
        .setDescription(`**Invite code:** ${invite.code}\n**Channel:** ${invite.channel.toString()}`)
        .setTimestamp();
  
      logChannel.send({ embeds: [embed] });
}
};
const config = require('../config.json');

module.exports = {
  name: 'inviteCreate',
  async execute(invite, client) {

    let logChannel = client.channels.cache.get(config.channels.channellog);

    const embed = new client.discord.MessageEmbed()
      .setTitle('New invite created')
      .setDescription(`**Invite code:** ${invite.code}\n**Max uses:** ${invite.maxUses}\n**Expires at:** ${invite.expiresAt}`)
      .addField(`Created by: <@${invite.inviter.id}>`)
      .addField('Channel', invite.channel.toString(), true)
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  }
};
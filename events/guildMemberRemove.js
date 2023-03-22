const config = require('../config.json');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, client) {

    let logchannel = client.channels.cache.get(config.channels.channellog);
    let goodbyeChannel = client.channels.cache.get(config.channels.goodbyechannel);
    const fetchedLogs = await member.guild.fetchAuditLogs({
      limit: 10,
      type: 'MEMBER_KICK',
    });
    
    const kickLog = fetchedLogs.entries.find(entry => entry.action === 'MEMBER_KICK');
    
    if (kickLog && kickLog.target.id === member.id) {
      const kickedMember = kickLog.target;

      const embed = new client.discord.MessageEmbed()
          .setAuthor({ name: `Member has been kicked !`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setColor('#FF0000')
          .addFields(
              { name: '`Kicked Member`', value: `${kickedMember.tag}`, inline: false },
              { name: '`Kicked Member ID`', value: `${kickedMember.id}`, inline: false },
              { name: '`Kicked by`', value: `${kickLog.executor.tag}`, inline: false },
              { name: '`Reason`', value: `${kickLog.reason || 'No reason provided'}`, inline: false }
          )
          .setThumbnail(kickedMember.avatarURL())
          .setImage('https://media.tenor.com/azGzgkvqONEAAAAC/funny-league-of-legend.gif')
          .setTimestamp()

      logchannel.send({ embeds: [embed] });
    } else {
      const embed = new client.discord.MessageEmbed()
          .setDescription(`**${member.user.tag}** left the server.`)
          .setColor('#FF0000')
          .setTimestamp()
          .setThumbnail(member.avatarURL());

      goodbyeChannel.send({ embeds: [embed] });
    }
  }
};

const config = require('../config.json');

module.exports = {
  name: 'guildMemberBan',
  async execute(interaction, client) {

    let logchannel = client.channels.cache.get(config.channels.channellog);
    const fetchedLogs = await interaction.guild.fetchAuditLogs({
      limit: 10,
      type: 'MEMBER_BAN_ADD',
    });
    
    const banLog = fetchedLogs.entries.find(entry => entry.action === 'MEMBER_BAN_ADD');
    
    /*if (!banLog) {
      console.log('No MEMBER_BAN_ADD audit log entry found.');
      return;
    }*/

    const bannedMember = banLog.target;

    const embed = new client.discord.MessageEmbed()
        .setAuthor({ name: `Member has been banned !`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor('#FF0000')
        .addFields(
            { name: '`Banned Member`', value: `${bannedMember.tag}`, inline: false },
            { name: '`Banned Member ID`', value: `${bannedMember.id}`, inline: false },
            { name: '`Banned by`', value: `<@${banLog.executor.id}>`, inline: false },
            { name: '`Reason`', value: `${banLog.reason || 'No reason provided'}`, inline: false }
        )
        .setThumbnail(bannedMember.avatarURL())
        .setImage('https://media.tenor.com/azGzgkvqONEAAAAC/funny-league-of-legend.gif')
        .setTimestamp()

    logchannel.send({ embeds: [embed] })
}};

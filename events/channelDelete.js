const config = require('../config.json');

module.exports = {
  name: 'channelDelete',
  async execute(interaction, client) {

    let logchannel = client.channels.cache.get(config.channels.channellog);
    const fetchedLogs = await interaction.guild.fetchAuditLogs({
      limit: 10,
      type: 'CHANNEL_DELETE',
    });
    
    const deleteLog = fetchedLogs.entries.find(entry => entry.action === 'CHANNEL_DELETE');
    
    const channelName = deleteLog.changes.find(change => change.key === 'name').old;

    const embed = new client.discord.MessageEmbed()
        .setAuthor({ name: `Channel has been deleted !`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { name: '`Channel Name`', value: `${channelName}`, inline: true },
            { name: '`Deleted by`', value: `<@${deleteLog.executor.id}>`, inline: true })
        .setTimestamp()

    logchannel.send({ embeds: [embed] })
}};

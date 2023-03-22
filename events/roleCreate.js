const config = require('../config.json');

module.exports = {
  name: 'roleCreate',
  async execute(role, client) {
    const auditLog = await role.guild.fetchAuditLogs({
      limit: 1,
      type: 'ROLE_CREATE',
    }).then(audit => audit.entries.first());

    const { executor, target } = auditLog;

    const embed = new client.discord.MessageEmbed()
      .setTitle('Role created')
      .setDescription(`**Name:** ${role.name}\n**Permissions:** ${role.permissions.toArray().join(', ')}\n**Created by:** <@${executor.id}>`)
      .setTimestamp();

    const logChannel = client.channels.cache.get(config.channels.channellog);
    logChannel.send({ embeds: [embed] });
  },
};
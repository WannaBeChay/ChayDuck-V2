const config = require('../config.json');

module.exports = {
  name: 'roleUpdate',
  async execute(oldRole, newRole, client) {
    let logChannel = client.channels.cache.get(config.channels.channellog);

    // Check if role name, color, or permissions have been updated
    if (oldRole.name === newRole.name && oldRole.color === newRole.color && oldRole.permissions === newRole.permissions) return;

    const embed = new client.discord.MessageEmbed()
      .setAuthor({ name: `Guild Role has been updated!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    if (oldRole.name !== newRole.name) {
      embed.addField('`Old Role name`', `${oldRole.name}`);
      embed.addField('`New Role name`', `${newRole.name}`);
    }

    if (oldRole.color !== newRole.color) {
      embed.addField('`Old Role color`', `${oldRole.hexColor}`);
      embed.addField('`New Role color`', `${newRole.hexColor}`);
    }

    if (!oldRole.permissions.equals(newRole.permissions)) {
      const oldPermissions = oldRole.permissions.toArray().join(', ');
      const newPermissions = newRole.permissions.toArray().join(', ');
      embed.addField('`Role permissions changed`', `**Old permissions:** ${oldPermissions}\n**New permissions:** ${newPermissions}`);
    }

    logChannel.send({ embeds: [embed] });
  },
};

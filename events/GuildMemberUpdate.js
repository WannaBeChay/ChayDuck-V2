const config = require('../config.json');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember, client) {
    let logChannel = client.channels.cache.get(config.channels.channellog);

    // Check if member nickname or roles have been updated
    if (oldMember.nickname === newMember.nickname && oldMember.roles.cache.equals(newMember.roles.cache)) return;

    const embed = new client.discord.MessageEmbed()
      .setTitle(`Guild Member has been updated!`)
      .setDescription(`**Person: <@${newMember.id}>**`)
      .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    if (oldMember.nickname !== newMember.nickname) {
      embed.addField('`Old Nickname`', `${oldMember.nickname || 'None'}`);
      embed.addField('`New Nickname`', `${newMember.nickname || 'None'}`);
    }

    if (!oldMember.roles.cache.equals(newMember.roles.cache)) {
      const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id)).map(role => `<@&${role.id}>`).join(', ');
      const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id)).map(role => `<@&${role.id}>`).join(', ');

      if (addedRoles) {
        embed.addField('`Roles Added`', `${addedRoles}`);
      }

      if (removedRoles) {
        embed.addField('`Roles Removed`', `${removedRoles}`);
      }
    }

    logChannel.send({ embeds: [embed] });
  },
};

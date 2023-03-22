const config = require('../config.json');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser, client) {
    const logchannel = client.channels.cache.get(config.channels.channellog);

    if (oldUser.username !== newUser.username) {
      const embed = new client.discord.MessageEmbed()
          .setDescription(`**${oldUser.username}** changed their username to **${newUser.username}**`)
          .setColor('#FF0000')
          .setTimestamp();

      logchannel.send({ embeds: [embed] });
    }

    if (oldUser.avatarURL() !== newUser.avatarURL()) {
      const embed = new client.discord.MessageEmbed()
          .setDescription(`**${oldUser.username}** changed their avatar`)
          .setColor('#FF0000')
          .setThumbnail(newUser.avatarURL())
          .setTimestamp();

      logchannel.send({ embeds: [embed] });
    }
  }
};

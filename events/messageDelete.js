const config = require('../config.json');

module.exports = {
  name: 'messageDelete',
  async execute(message, client) {
    if(message.author.bot) return;

    // Partial message can't be logged
    if (message.partial) {
      try {
        await message.fetch();
      } catch (error) {
        console.error('Error fetching message: ', error);
        return;
      }
    }

    let logchannel = client.channels.cache.get(config.channels.channellog);

    const embed = new client.discord.MessageEmbed()
      .setAuthor({ name: `Message has been deleted!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .addFields(
        { name: '`Deleted by`', value: `<@${message.author.id}>`, inline: false },
        { name: '`Channel`', value: `${message.channel}`, inline: false },
        { name: '`Message`', value: `${message.content || 'None'}`, inline: false }
      )
      .setTimestamp();

    logchannel.send({ embeds: [embed] });
  }
};

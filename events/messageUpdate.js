const config = require('../config.json');

module.exports = {
name: 'messageUpdate',
async execute(oldMessage, newMessage, client) {

    let logchannel = client.channels.cache.get(config.channels.channellog);

if (oldMessage.content === newMessage.content) return;

const embed = new client.discord.MessageEmbed()
.setAuthor({ name: `Message has been updated !`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
.addFields(
    { name: '`Updated by`', value: `<@${newMessage.author.id}>`, inline: false },
    { name: '`Original Message`', value: `${oldMessage.content}`, inline: false },
    { name: '`Updated Message`', value: `${newMessage.content}`, inline: false }
)
.setTimestamp()

logchannel.send({ embeds: [embed] })

}};
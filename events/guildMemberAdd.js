const config = require('../config.json');
const Welcomer = require('../structures/Welcomer.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {

    let logChannel = client.channels.cache.get(config.channels.channellog);
    if (member.user.bot) return;

    let welChannel = client.channels.cache.get(config.channels.welcomechannel);

    await member.roles.add(config.roles.newUserRole);

    const image = new Welcomer()
    .setBackground("https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif")
    .setGIF(true)
    .setAvatar(member.user.displayAvatarURL({ format: "png" }))
    .setName(member.user.username)
    .setDiscriminator(`#${member.user.discriminator}`)
    .setBlur(2)

    const embed = new client.discord.MessageEmbed()
    .setDescription(`**Welcome to ChayLab's** \n **Now we are ${member.guild.memberCount} !**`)
    //.addField(`Inviter: <@${inviter.id}>`)
    .setImage("attachment://welcome.gif");

    return welChannel.send({ files: [{ attachment: await image.generate(), name: "welcome.gif" }], embeds: [embed] });

}};
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: require('../config.json').apiKey,
  });
  
  const openai = new OpenAIApi(configuration);
  
const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ai")
      .setDescription("Interact with AI")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text")
          .setRequired(true)
      ),
    async execute(interaction, client) {
      try {

        interaction.deferReply();

        const pedido = interaction.options.getString("text");
  
        // getting a response from openai
        const res = await openai.createCompletion({
          model: "text-davinci-003",
          max_tokens: 500,
          temperature: 0.7,
          prompt: `AI is a friendly chatbot.\n\
                          AI: Hello there!\n\
                          ${interaction.user.username}: ${pedido}\n\
                          AI:`,
  
          stop: ["AI:", `${interaction.user.username}:`],
        });
  
        const embed1 = new client.discord.MessageEmbed()
          .setAuthor({
            name: `${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(`**Asked: ${pedido}**`);
  
        const embed2 = new client.discord.MessageEmbed()
          .setAuthor({
            name: `${client.user.username}`,
            iconURL:
              "https://media.discordapp.net/attachments/925947526945861653/1068096605879812126/chayduck.jpg",
          })
          .setDescription(`**Answer: ${res.data.choices[0].text}**`);
  
        /*await interaction.deferReply({
          embeds: [embed1, embed2],
        });*/

        await interaction.editReply({
          embeds: [embed1, embed2],
        });

      } catch (error) {
        console.error(error);
      }
    },
  };  
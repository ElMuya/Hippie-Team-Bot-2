const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: "ping",
  description: "Comprobar la latencia del bot",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {


    try {

      const start = Date.now();
      interaction.reply("Pinging....").then(msg => {
        const end = Date.now();
        const embed = new EmbedBuilder()
          .setColor(`#00b19e`)
          .setTitle(`Latencia del bot`)
          .setDescription(`**Ping :** ${end - start}ms`)
        return interaction.editReply({ embeds: [embed] }).catch(e => { });
      }).catch(err => { })

    } catch (e) {
    console.error(e); 
  }
  },
};

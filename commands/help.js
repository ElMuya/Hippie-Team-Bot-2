const { EmbedBuilder } = require('discord.js');


module.exports = {
  name: "help",
  description: "Obtén información sobre el bot",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {
     

      const embed = new EmbedBuilder()
        .setColor('#00b19e')
        .setTitle('COMANDOS:')
        .setDescription('**/play :** Empiece a reproducir las canciones.\n' +
          '**/ping :** Comprobar la latencia del bot.\n' +
          '**/support :** Mostrar información del servidor.')
        .setImage('https://media.discordapp.net/attachments/1236113159861964930/1236409791631327232/Banner_Discord_Invit.png?ex=6637e7d9&is=66369659&hm=194bdd64fd6cd7e8f627f8782b22c6fc1bed8f4f8668b815c6ee36f501a1da07&=&quality=lossless')
        .setTimestamp()
        .setFooter({ 
          text: 'Hippie Team',
          iconURL: 'https://media.discordapp.net/attachments/563003573894512650/844696332887392256/20210519_230644_1.png?ex=663bf643&is=663aa4c3&hm=269c93767b6850b8d436d43619a7fc2f6c9710c3479b35c388c3e68c0d440434&'
        });

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
    console.error(e); 
  }
  },
};

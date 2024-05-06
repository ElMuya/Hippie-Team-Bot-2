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
      .setDescription('Welcome to the Music Bot!\n\n- Here are the available commands:\n\n' +
        '**/play :** Empiece a reproducir las canciones.\n' +
        '**/ping :** Comprobar la latencia del bot.\n' +
        '**/support :** Mostrar información del servidor.');

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
    console.error(e); 
  }
  },
};

const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "support",
  description: "Obtén información del servidor.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {

      const instagramLink = "https://www.instagram.com/hippie.team";
      const youtubehtLink = "https://www.youtube.com/@hippieteamoficial";
      const youtubehscLink = "https://www.youtube.com/@hippiesimcup";
      const webLink = "http://hippieteam.free.nf";
      const embed = new EmbedBuilder()
        .setColor('#00b19e')
        .setTitle('INFORMACIÓN:')
        .setDescription(`➡️ **Síguenos en:**\n- Web - ${webLink}\n- Instagram - ${instagramLink}\n- Youtube HT - ${youtubehtLink}\n- Youtube HSC - ${youtubehscLink}`)
        .setImage('https://media.discordapp.net/attachments/1236113159861964930/1236409791631327232/Banner_Discord_Invit.png?ex=6637e7d9&is=66369659&hm=194bdd64fd6cd7e8f627f8782b22c6fc1bed8f4f8668b815c6ee36f501a1da07&=&quality=lossless')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
    console.error(e); 
  }
  },
};

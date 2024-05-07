const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

const queueNames = [];

async function play(client, interaction) {
    try {
        const query = interaction.options.getString('name'); 

        const player = client.riffy.createConnection({
            guildId: interaction.guildId,
            voiceChannel: interaction.member.voice.channelId,
            textChannel: interaction.channelId,
            deaf: true
        });

     
        await interaction.deferReply();

   
        const resolve = await client.riffy.resolve({ query: query, requester: interaction.user });
        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === 'playlist') {
            for (const track of resolve.tracks) {
                track.info.requester = interaction.user;
                player.queue.add(track);
                queueNames.push(track.info.title); 
            }

            if (!player.playing && !player.paused) player.play();

        } else if (loadType === 'search' || loadType === 'track') {
            const track = tracks.shift();
            track.info.requester = interaction.user;

            player.queue.add(track);
            queueNames.push(track.info.title);

            if (!player.playing && !player.paused) player.play();
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('No se encontraron resultados.');

        
            await interaction.editReply({ embeds: [errorEmbed] });
            return;
        }

       
        await new Promise(resolve => setTimeout(resolve, 500));
        
     
const { EmbedBuilder } = require("discord.js");


const embeds = [
  
    new EmbedBuilder()
    .setColor('#00FF00')
    .setAuthor({
        name: '¡Canción añadida a la cola!',
        iconURL: 'https://cdn.discordapp.com/attachments/1236113159861964930/1237505376572670032/verify-green.gif?ex=663be431&is=663a92b1&hm=b42638cf936fef93e88f301f6dae3ff4945f282f41a750c0791ac0724935e144&', 
        url: 'https://discord.gg/xQF9f9yUEM'
    })
    .setDescription('➡️ **Su solicitud ha sido procesada exitosamente.**\n➡️** Utilice los botones para controlar la cola.**')
];


const randomIndex = Math.floor(Math.random() * embeds.length);


await interaction.followUp({ embeds: [embeds[randomIndex]] });

    } catch (error) {
        console.error('Error al procesar el comando de reproducción:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Error')
            .setDescription('Se produjo un error al procesar su solicitud.');

     
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}

module.exports = {
    name: "play",
    description: "Añade opciones también",
    permissions: "0x0000000000000800",
    options: [{
        name: 'name',
        description: 'Ingresa el nombre de la canción / enlace / lista de reproducción.',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    run: play,
    queueNames: queueNames
};

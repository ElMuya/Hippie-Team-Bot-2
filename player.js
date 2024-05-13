const { Riffy } = require("riffy");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { queueNames } = require("./commands/play"); 

function initializePlayer(client) {
    const nodes = [
        {
            host: "xeon1-de.reyo.run",
            password: "freelavalinkserver",
            port: 2561,
            secure: false
        },
    ];

    client.riffy = new Riffy(client, nodes, {
        send: (payload) => {
            const guildId = payload.d.guild_id;
            if (!guildId) return;

            const guild = client.guilds.cache.get(guildId);
            if (guild) guild.shard.send(payload);
        },
        defaultSearchPlatform: "spsearch",
        restVersion: "v4"
    });

    client.riffy.on("nodeConnect", node => {
        console.log(`Node "${node.name}" connected.`);
    });

    client.riffy.on("nodeError", (node, error) => {
        console.error(`Node "${node.name}" encountered an error: ${error.message}.`);
    });

    client.riffy.on("trackStart", async (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);

   
        const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setAuthor({
            name: 'Canción Actual',
            iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236664581364125787/music-play.gif?ex=6638d524&is=663783a4&hm=5179f7d8fcd18edc1f7d0291bea486b1f9ce69f19df8a96303b75505e18baa3a&', 
            url: 'https://discord.gg/xQF9f9yUEM'
        })
        .setDescription(`➡️ **Nombre:** [${track.info.title}](${track.info.uri})\n➡️ **Autor:** ${track.info.author}\n➡️ **Plataformas :** YouTube, Spotify, SoundCloud`)

        .setImage(`https://cdn.discordapp.com/attachments/1004341381784944703/1165201249331855380/RainbowLine.gif?ex=663939fa&is=6637e87a&hm=e02431de164b901e07b55d8f8898ca5b1b2832ad11985cecc3aa229a7598d610&`)
        .setThumbnail(track.info.thumbnail)
        .setTimestamp()
        .setFooter({ text: '¡Haga clic en los botones para controlar la reproducción!'}); 



        const queueLoopButton = new ButtonBuilder()
            .setCustomId("loopQueue")
            .setLabel("Bucle On")
            .setEmoji('🔄')
            .setStyle(ButtonStyle.Primary);

        const disableLoopButton = new ButtonBuilder()
            .setCustomId("disableLoop")
            .setLabel("Bucle Off")
            .setEmoji('🔄')
            .setStyle(ButtonStyle.Danger);

        const skipButton = new ButtonBuilder()
            .setCustomId("skipTrack")
            .setLabel("Saltar")
            .setEmoji('⏭️')
            .setStyle(ButtonStyle.Primary);

        const showQueueButton = new ButtonBuilder()
            .setCustomId("showQueue")
            .setLabel("Ver Cola")
            .setEmoji('📄')
            .setStyle(ButtonStyle.Primary);
        const clearQueueButton = new ButtonBuilder()
            .setCustomId("clearQueue")
            .setLabel("Borrar Cola")
            .setEmoji('📇')
            .setStyle(ButtonStyle.Danger);

    
        const actionRow = new ActionRowBuilder()
            .addComponents(queueLoopButton,  disableLoopButton, showQueueButton, clearQueueButton , skipButton);

       
        const message = await channel.send({ embeds: [embed], components: [actionRow] });

      
        const filter = i => i.customId === 'loopQueue' || i.customId === 'skipTrack' || i.customId === 'disableLoop' || i.customId === 'showQueue' || i.customId === 'clearQueue';
        const collector = message.createMessageComponentCollector({ filter, time: 180000 });
        setTimeout(() => {
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    queueLoopButton.setDisabled(true),
                    disableLoopButton.setDisabled(true),
                    skipButton.setDisabled(true),
                    showQueueButton.setDisabled(true),
                    clearQueueButton.setDisabled(true)
                );
        
          
            message.edit({ components: [disabledRow] })
                .catch(console.error);
        }, 180000);
        collector.on('collect', async i => {
            await i.deferUpdate();
            if (i.customId === 'loopQueue') {
                setLoop(player, 'queue');
                const loopEmbed = new EmbedBuilder()
            .setAuthor({
                    name: 'Bucle activado',
                    iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157318080670728283/7905-repeat.gif?ex=66383bb4&is=6636ea34&hm=65f37cf88245f1c09285b547fda57b82828b3bbcda855e184f446d6ff43756b3&', 
                    url: 'https://discord.gg/xQF9f9yUEM'
                })
            .setColor("#00FF00")
            .setTitle("**¡El bucle de la cola está activado!**")
         

        await channel.send({ embeds: [loopEmbed] });
            } else if (i.customId === 'skipTrack') {
                player.stop();
                const skipEmbed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({
                  name: 'Canción omitida',
                  iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157269773118357604/giphy.gif?ex=6517fef6&is=6516ad76&hm=f106480f7d017a07f75d543cf545bbea01e9cf53ebd42020bd3b90a14004398e&',
                  url: 'https://discord.gg/FUEHs7RCqz'
                })
            .setTitle("**¡Se reproducirá la siguiente canción!**");
               
    
            await channel.send({ embeds: [skipEmbed] });
            } else if (i.customId === 'disableLoop') {
                setLoop(player, 'none');
                const loopEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setAuthor({
                    name: 'Bucle apagado',
                    iconURL: 'https://media.discordapp.net/attachments/1236113159861964930/1237532875482464277/off.png?ex=663bfdcd&is=663aac4d&hm=85e8845b2c4ba0bcbbb29df64c3f981c83a25acce63f378c6c62276a85a22276&=&quality=lossless', 
                    url: 'https://discord.gg/xQF9f9yUEM'
                })
                .setDescription('**¡El bucle está deshabilitado para la cola y la canción única!**');
                  
    
            await channel.send({ embeds: [loopEmbed] });
            } else if (i.customId === 'showQueue') {

const pageSize = 10; 

const queueMessage = queueNames.length > 0 ?
    queueNames.map((song, index) => `${index + 1}. ${song}`).join('\n') :
    "La cola está vacía.";


const pages = [];
for (let i = 0; i < queueNames.length; i += pageSize) {
    const page = queueNames.slice(i, i + pageSize);
    pages.push(page);
}

for (let i = 0; i < pages.length; i++) {
    const numberedSongs = pages[i].map((song, index) => `**${index + 1}.** ${song}`).join('\n');

    const queueEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`Cola actual (Página ${i + 1}/${pages.length})`)
        .setDescription(numberedSongs);

    await channel.send({ embeds: [queueEmbed] });
}

            } else if (i.customId === 'clearQueue') {
                clearQueue(player);
                const queueEmbed = new EmbedBuilder()
                .setColor("#FF0000")
                .setAuthor({
                    name: 'Cola borrada',
                    iconURL: 'https://media.discordapp.net/attachments/1236113159861964930/1237506879509495828/delete.png?ex=663be597&is=663a9417&hm=f5d59b7b963cb8da64bdd54d5dcf155792825a8a701874fa3111f7c65e43a148&=&quality=lossless', 
                    url: 'https://discord.gg/xQF9f9yUEM'
                })
                .setDescription('**¡Las canciones en cola se borraron correctamente!**');
               
    
            await channel.send({ embeds: [queueEmbed] });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    });

    client.riffy.on("queueEnd", async (player) => {
        const channel = client.channels.cache.get(player.textChannel);
        const autoplay = false;

        if (autoplay) {
            player.autoplay(player);
        } else {
            player.destroy();
            const queueEmbed = new EmbedBuilder()
                .setColor("#0099ff")
                .setDescription('**¡Las canciones en cola terminaron! ¡Desconectando Bot!**');
               
    
            await channel.send({ embeds: [queueEmbed] });
        }
    });

  
    function setLoop(player, loopType) {
        if (loopType === "queue") {
            player.setLoop("queue");
        } else {
            player.setLoop("none");
        }
    }

  
    function clearQueue(player) {
        player.queue.clear();
        queueNames.length = 0; 
    }

    
    function showQueue(channel, queue) {
        const queueList = queue.map((track, index) => `${index + 1}. ${track.info.title}`).join('\n');
        const queueEmbed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Queue")
            .setDescription(queueList);
        channel.send({ embeds: [queueEmbed] });
    }

    module.exports = { initializePlayer, setLoop, clearQueue, showQueue };
}

module.exports = { initializePlayer };

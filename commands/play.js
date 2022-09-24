const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");
const { ActivityType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song").addStringOption(option =>
            option.setName("terms").setDescription("The starting words of the video").setRequired(true)
        ),
    execute: async ({client, interaction}) => {
        let player;
        if(!interaction.member.voice.channel) await interaction.reply(`Join the voice channel first`)
        const res = await client.manager.search(interaction.options.get("terms").value, interaction.user);
            player = client.manager.create({
                guild:interaction.guildId,
                voiceChannel:interaction.member.voice.channelId,
                textChannel: interaction.channelId
            })
            let track = res.tracks[0]
            player.connect();
            player.queue.add(track);
            embed = new EmbedBuilder().setDescription(`Now playing **${track.title}**`).setThumbnail(track.thumbnail).setURL(track.uri)
            
        if (!player.playing && !player.paused && !player.queue.size){ player.play()  }
            

        await interaction.reply({
            embeds:[embed]
        })
    }
}



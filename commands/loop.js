const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder().setName("loop").setDescription("loop the music"),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId)
        if(!player) return await interaction.reply("There is no player!")
        if(!interaction.member.voice.channel) return await interaction.reply("you need to join a voice channel");
        if(interaction.member.voice.channelId !== player.voiceChannel) return message.reply("You're not in the same voice channel");
        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
        return await interaction.reply(`${trackRepeat} track repeat.`)
    }
}


const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder().setName("pause").setDescription("Pause the current song. "),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId)
        if(!interaction.member.voice.channel) return await interaction.reply(`You need to join Voice Channel first`);
        if(interaction.member.voice.channelId !== player.voiceChannel )  return await interaction.reply(`You're not in the same voice channel`) ;
        if(player.paused) return await interaction.reply(`You have already paused the player`)
        player.pause(true)
        await interaction.reply(`The player is paused`);
    }
}
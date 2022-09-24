const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder().setName("exit").setDescription("Kick the bot out of the vc"),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId);
        if(!player) return await interaction.reply("No player in this guild");
        if(!interaction.member.voice.channel) return await interaction.reply("Join a voice channel first")
        if(interaction.member.voice.channelId !== player.voiceChannel) return await interaction.reply("You are not in the same voice channel")

        player.destroy();
        await interaction.reply("Player Stopped");
    }
}
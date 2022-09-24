const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("volume").setDescription("Changes the volume of the music").addNumberOption(option=>option.setName("value").setDescription("Volume in the range of 0 to 100").setRequired(true)),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId)
        if(!player) return await interaction.reply("There is no player!")
        if(!interaction.member.voice.channel) return await interaction.reply("you need to join a voice channel");
        if(interaction.member.voice.channelId !== player.voiceChannel) return message.reply("You're not in the same voice channel");
        const vol = interaction.options.get("value").value
        if(vol > -1 && vol < 101){
            player.setVolume(vol)
            return await interaction.reply(`Changed the volume to ${vol}`)
        }else{
            return await interaction.reply(`Please enter the value between 0 and 100`)
        }
        
    }
}

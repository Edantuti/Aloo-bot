const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder().setName("role").setDescription("roles Display"),
    execute: async ({client, interaction}) =>{
        console.log(interaction.memberPermissions)
        await interaction.reply(`<@&${interaction.member._roles[0]}>`)
    }
}

//PermissionsBitField { bitfield: 1071698660961n } manage server

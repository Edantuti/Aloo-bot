const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");



module.exports = {
    data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song. "),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId);
        if (!player) return await interaction.reply("there is no player for this guild.");
  
      const { channel, channelId } = interaction.member.voice;
      if (!channel) return await interaction.reply("you need to join a voice channel.");
      if (channelId !== player.voiceChannel) return await interaction.reply("you're not in the same voice channel.");

      if (!player.queue.current) return await interaction.reply("there is no music playing.")
        
      const { title, thumbnail } = player.queue.current;

      player.stop();
        await interaction.reply({
            embeds:[
                new EmbedBuilder().setDescription(`Skipped **${title}**`).setThumbnail(thumbnail)
            ]
        })
    }
}
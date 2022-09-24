const {SlashCommandBuilder} = require("@discordjs/builders");
const { EmbedBuilder} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Shows the Songs in queue"),
    execute: async({client, interaction}) => {
        const player = client.manager.get(interaction.guildId)
        const queue = player.queue;
        const embed = new EmbedBuilder()
      .setAuthor({ name: `Queue for ${interaction.guild.name}` })

        const tracks = queue
        if (queue.current) embed.addFields([{ name: "Current", value: `[${queue.current.title}](${queue.current.uri})`}]);
        if (!tracks.length) embed.setDescription(`No tracks in the queue`);
        else embed.setDescription(tracks.map((track, i) => `${(++i)} - [${track.title}](${track.uri})`).join("\n"));
         
        return await interaction.reply({
            embeds:[embed]
        })

    }
}
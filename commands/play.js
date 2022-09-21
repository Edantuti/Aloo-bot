const {SlashCommandBuilder, EmbedBuilder} = require("@discordjs/builders");
const {QueryType} = require("discord-player");
const { CommandInteractionOptionResolver } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song").addSubcommand(subcommand => 
        subcommand.setName("search").setDescription("Searches for a Song").addStringOption(option => 
            option.setName("terms").setDescription("Search Keywords").setRequired(true))
    ).addSubcommand(subcommand =>
        subcommand.setName("playlist").setDescription("Plays playlist from yt").addStringOption(option => 
            option.setName("url").setDescription("Playlist Url").setRequired(true)
        )
    ).addSubcommand(subcommand =>
        subcommand.setName("song").setDescription("plays song from yt").addStringOption(option =>
            option.setName("url").setDescription("url of the song").setRequired(true)
        )
    ),
    execute: async ({client, interaction}) => {
        if(!interaction.member.voice.channel){
            await interaction.reply("you must be in a voice channel to use this channel. ");
            return;
        }

        const queue = await client.player.createQueue(interaction.guild);
        if(!queue.connection) await queue.connect(interaction.member.voice.channel);
        let song;
        let embed = new EmbedBuilder()
        if(interaction.options.getSubcommand() === "song"){
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });
            if(!result.tracks.length){
                await interaction.reply("no results found");
                return;
            }

            song = result.tracks[0];
            await queue.addTrack(song);
                            
            embed
                .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duration: ${song.duration}`});
            }
            else if(interaction.options.getSubcommand() === "playlist"){
            let url = interaction.options.getString("url");
                            const result = await client.player.search(url, {
                                requestedBy: interaction.user,
                                searchEngine: QueryType.YOUTUBE_PLAYLIST,
                            });
                            if(!result.tracks.length){
                                await interaction.reply("no playlist found");
                                return;
                            }

                            const playlist = result.playlist;
                            await queue.addTracks(playlist);
                            
                            embed
                            .setDescription(`Added **[${playlist.title}](${playlist.url})** to the queue.`)
                            .setThumbnail(playlist.thumbnail)
                            .setFooter({text: `Duration: ${playlist.duration}`});
            }
            else if(interaction.options.getSubcommand() === "search"){
            let url = interaction.options.getString("terms");
                        const result = await client.player.search(url, {
                            requestedBy: interaction.user
                        });
                        if(!result.tracks.length){
                            await interaction.reply("no results found");
                            return;
                        }

                        song = result.tracks[0];
                        await queue.addTrack(song);
                      
                        
                        embed
                        .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
                        .setThumbnail(song.thumbnail)
                        .setFooter({text: `Duration: ${song.duration}`});

        }
        if(!queue.playing){
            try{
                await interaction.reply({
                    embeds:[embed]
                })
                await queue.play();

                
                
            }catch(err){
                console.error(err);
            }
        }
        // await interaction.reply({
        //     embeds:[embed]
        // })
    }

}
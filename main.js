require("dotenv").config();

const {REST} = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { Client,GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const express = require("express");

const fs = require("node:fs");
const path = require("node:path");


const route = require('./website/merger.js');

const app = express();


const client = new Client({
    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences]
});

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for(const file of commandFiles){
    const filePath  = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.player = new Player(
    client, {
        ytdlOptions:{
            filter: 'audioonly',
            highWaterMark: 1 << 25
        }
});


client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version:"9"}).setToken(process.env.TOKEN);
       
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands}).then(()=> console.log(`Added ${commands.length}`)).catch(console.error);
})


client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try{
        await command.execute({client, interaction});
    }
    catch(err)
    {
        console.error(err);
        await interaction.reply("An error occured while executing that command.");
    }
})
for(const router of route)
        app.use(router.dir, router.route)
app.listen(process.env.PORT, ()=> console.log(`App listening at https://localhost:${process.env.PORT}`));

client.login(process.env.TOKEN)


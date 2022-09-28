require("dotenv").config();

const {REST} = require("@discordjs/rest");
const { Routes, ActivityType } = require("discord-api-types/v10");
const { Client,GatewayIntentBits, Collection } = require("discord.js");

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const fs = require("node:fs");
const path = require("node:path");

const {Manager} = require("erela.js")

const route = require('./website/merger.js');
const db = require('./db/db.js');

const app = express();


const client = new Client({
    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences]
});

process.client = client;

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

const nodes = [
    {host:"node1.kartadharta.xyz", port:443, password:"kdlavalink", secure: true},
    {host:"node1.gglvxd.tk", port:443, password:"free", secure: true}
]


client.manager = new Manager({
    nodes, send:(id,payload) => {
        const guild = client.guilds.cache.get(id);
        if(guild) guild.shard.send(payload);
    }
})

client.on("ready", async () => {
    const rest = new REST({version:"9"}).setToken(process.env.TOKEN);  
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {body: commands}).then(()=> console.log(`Added ${commands.length}`)).catch(console.error);
    db.connection()
    let guilds = []
    client.guilds.cache.map(guild => {
        guilds.push({name:guild.name, server_id:guild.id})
    })
    for(let guild of guilds){

        if(!await db.Server.findOne(guild)){
            await db.Server(guild).save()
        }
    }
    
    client.manager.init(client.user.id);
    client.user.setActivity("you", {type: ActivityType.Watching})
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

client.on("guildCreate", async guild => {
    await db.Server({name:guild.name,server_id:guild.id}).save();
})

client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

// Emitted whenever a node encountered an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})

client.manager.on("trackStart", (player, track) => {
    client.user.setActivity(track.title, {type:ActivityType.Playing})
});

client.manager.on("queueEnd", player => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send("Queue has ended.");
    player.destroy();
    client.user.setActivity("you", {type:ActivityType.Watching})
});


client.on("raw", d => client.manager.updateVoiceState(d));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:604800},
    store: MongoStore.create({mongoUrl:process.env.MONGO_URL, ttl:604800})
    
}))
app.set("view engine", 'ejs')

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, "views/static")))
for(const router of route)
    app.use(router.dir, router.route)

app.use((err, req, res, next)=>{
    res.status(500)
    res.render('error', { error: err })
})

app.listen(process.env.PORT, ()=> console.log(`App listening at https://localhost:${process.env.PORT}`));

client.login(process.env.TOKEN)


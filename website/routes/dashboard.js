const { default: axios } = require("axios");
const express = require("express")
const router = express.Router();

const db = require('../../db/db')

router.get("/", async (req,res)=>{
    if(req.session.data){
            const response = await axios.get(
                'https://discord.com/api/users/@me/guilds',
                {
                    headers:{
                        'Authorization':`Bearer ${req.session.data.access_token}`
                    }
                }
            )
        let servers = []
        for (let server of response.data){
            if(await db.Server.findOne({server_id:server.id})){
                servers.push(server)
            }
        }
        return res.render("dashboard", {servers:servers})
    }
    return res.redirect('/')
})

router.get("/:id", async (req,res) => {
        if(!req.session.data)
            return res.redirect("/")
    const guild = process.client.guilds.cache.get(req.params.id).toJSON()
    const member = process.client.guilds.cache.get(req.params.id).members.cache.get(req.session.data.user.id)
    const guildObj = {
            name:guild.name,
            id:guild.id,
            profile:guild.icon,
            memberCount: guild.memberCount,
            roles: guild.roles,
            rolesCount: guild.roles.length,
            channels: guild.channels,
            channelsCount: guild.channels.length,
            everyoneRole: process.client.guilds.cache.get(req.params.id).roles.everyone.id,
            member:member
        }
        return res.render("server", {guild:guildObj})
    
    
})

module.exports = {
    dir:"/dashboard",
    route: router
}
const axios = require("axios");
const {URLSearchParams} = require("node:url");
const express = require("express");
const router = express.Router();

const auth = require("./auth");

router.get("/", async (req, res)=>{
    try{
        if(auth.data[0]){
            const headers = {
                'Authorization': `Bearer ${auth.data[0]}`
            }
            const response = await axios.get(
                'https://discord.com/api/users/@me/guilds',
                {
                    headers:headers
                }
            )
            return res.json(response.data)
        }else{
            return res.json({error:"Please Authenticate"})
        }

    }catch(err){
        console.error(err)
    }
})

module.exports = {
    dir:"/guild",
    route:router
}
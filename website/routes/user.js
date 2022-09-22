const axios = require("axios");

const express = require('express');
const router = express.Router();

const token = require("./auth")


router.get('/', async (req, res) => {
    if(token.data){
        try{
        const response = await axios.get(
        'https://discord.com/api/users/@me',
        {
            headers:{
                'Authorization':`Bearer ${token.data[0]}`
            }
        }
    )
        
        return res.json(response.data)   
    }catch(err){console.error(err)}
    }
    return res.json("user")
})

module.exports = {
    dir:"/user",
    route:router
}
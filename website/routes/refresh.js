const {URLSearchParams} = require("node:url")
const axios = require("axios");
const express = require("express");
const router = express.Router();

const auth = require("./auth")

router.get('', async (req, res) =>{
    try{
        console.log(auth.data)
        const formData = new URLSearchParams({
            client_id:process.env.CLIENT_ID,
            client_secret:process.env.CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token:auth.data[1]
        })
        const headers = {
            'Content-Type': `application/x-www-form-urlencoded`
        }

        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            formData, headers
        )

        data[0]=response.data.access_token
        data[1]=response.data.refresh_token
        return res.json({access_token:response.data.access_token, refresh_token:response.data.refresh_token})
    }catch(err)
    {
        console.error(err);
    }
})

module.exports = {
    dir:"/refresh",
    route:router
}
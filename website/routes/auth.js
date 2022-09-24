require("dotenv").config();
const axios = require("axios");
const { URLSearchParams} = require("node:url")
const express = require("express");
const router = express.Router();

let token=[];

router.get('/',async (req, res)=>{
    
    try{
        const {code} = req.query;
        if(code){
            const formData = new URLSearchParams({
                client_id:process.env.CLIENT_ID,
                client_secret:process.env.CLIENT_SECRET,
                grant_type:'authorization_code',
                code:code.toString(),
                redirect_uri:`http://localhost:${process.env.PORT}/auth`
            })
            const headers = {
                'Content-Type':'application/x-www-form-urlencoded'
            }
            const response = await axios.post(
                'https://discord.com/api/oauth2/token',
                formData, headers
            )
            token.push(response.data.access_token);
            token.push(response.data.refresh_token);

            return res.render("auth", {token:response.data.access_token, refresh:response.data.refresh_token})
        }
        return res.render("auth", {token:"", refresh:""})
    }catch(err){
        console.error(err)
    }
})




module.exports= {
        dir:"/auth", //directory
        data:token,
        route:router // router object
}
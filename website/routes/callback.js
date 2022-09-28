require("dotenv").config();
const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

const db = require("../../db/db")

router.get('/',async (req, res)=>{
    
    try{
        const {code} = req.query;
        
        if(!code){return res.send('Not Autheticated yet')}
        const formData = new URLSearchParams({
            client_id:process.env.CLIENT_ID,
            client_secret:process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code:code.toString(),
            redirect_uri:`http://localhost:${process.env.PORT}/callback`
        })
        const headers = {
            'Content-Type':'application/x-www-form-urlencoded'
        }
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            formData, headers
        )  
            
        const user = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers:{
                    'Authorization':`Bearer ${response.data.access_token}`
                }
            }
        )

        const data = {
            UserID: user.data.id,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            scope: response.data.scope,
            user:{
                    id: user.data.id,
                    username: user.data.username,
                    avatar: user.data.avatar,
                    discriminator: user.data.discriminator,
                    email:user.data.email
                },
            maxAge: response.data.expires_in
               
        }  
                
        if(await db.User.findOne({UserID:user.data.id})){
            await db.User.updateOne({UserID:user.data.id}, data)
            req.session.data = data
            
        }else{
            req.session.data = data
            await db.User(data).save()
        }           
        return res.redirect('/')
    }catch(err){
        console.error(err)
    }
})

module.exports= {
        dir:"/callback", //directory
        route:router // router object
}
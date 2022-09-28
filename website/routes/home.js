require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("", (req, res)=>{
    
    if(!req.session.data)
        return res.render("index", {data:undefined})
    res.render("index", {data:req.session.data})
})

module.exports = {
    dir:"/",
    route:router
}
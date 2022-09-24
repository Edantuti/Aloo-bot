require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("", (req, res)=>{
    return res.render("index", {})
})

module.exports = {
    dir:"/",
    route:router
}
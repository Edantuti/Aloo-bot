const mongoose = require("mongoose");

const ServerData = new mongoose.Schema({
    name:String,
    server_id: String
})

module.exports = {
    name:"Server",
    schema:ServerData
}


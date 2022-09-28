const mongoose = require("mongoose");

const UserData = new mongoose.Schema({
    UserID:String,
    access_token: String,
    refresh_token: String,
    scope: String,
    user:{
            id: String,
            username:String,
            avatar: String,
            discriminator: String,
            email: String,
        },
    maxAge: Number,
    timestamps:{
        createdAt: {type:Date, default: Date.now()}, 
        updatedAt: {type:Date, default:Date.now()}
    }
})

module.exports = {
    name:"User",
    schema: UserData
}
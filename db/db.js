require("dotenv").config();
const mongoose = require(`mongoose`);
const User = require("./Schema/UserData")
const Server = require("./Schema/ServerData")

exports.Server = mongoose.model(Server.name, Server.schema)
exports.User = mongoose.model(User.name, User.schema)

// exports.Server = mongoose.model('Server', ServerSchema);

exports.connection = async () => {
    await mongoose.connect(`${process.env.MONGO_URL}`)
}


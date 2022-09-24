require("dotenv").config();
const mongoose = require(`mongoose`);

const ServerSchema = new mongoose.Schema({
    name:String,
    server_id: String
})


exports.Server = mongoose.model('Server', ServerSchema);

exports.connection = async () => {
    await mongoose.connect(`${process.env.MONGO_URL}`)
}


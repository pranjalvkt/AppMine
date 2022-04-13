const mongoose = require("mongoose");
const appSchema = new mongoose.Schema({
    image: String, 
    title: String,
    para: String,
    name: String,
    appAdmin: String,
    appOS: String
});
module.exports = mongoose.model("app", appSchema);
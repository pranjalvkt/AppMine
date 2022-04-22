const mongoose = require("mongoose");
const appSchema = new mongoose.Schema({
    image: String, 
    title: String,
    para: String,
    name: String,
    appAdmin: String,
    appOS: String,
    downloadNum: Number,
    reviewSum: Number,
    reviewCount: Number,
    review: Number
});
module.exports = mongoose.model("app", appSchema);
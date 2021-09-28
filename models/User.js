const mongoose = require("mongoose");
const Schema = mongoose.Schema; //创建模板

//给模板添加字段
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

//模板导出
module.exports = User = mongoose.model("users", UserSchema);
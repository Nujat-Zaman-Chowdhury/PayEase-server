const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Agent", "Admin"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "active", "blocked"],
        default: "pending"
    },
    balance: {
        type: Number,
        default: 0
    },
    bonusReceived: {
        type: Boolean,
        default: false
    }
});
const UserModel = mongoose.model("users",UserSchema)
module.exports = UserModel;

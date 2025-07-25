const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    watchlist: {
        type: Array, // Array to hold movie objects
        default: [],
    },
});

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;

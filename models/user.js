const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    adress: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },
}, {timestamps: true})

const User = mongoose.model('user', userSchema)
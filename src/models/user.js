const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role'  
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
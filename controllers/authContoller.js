const User = require('../models/user');
const mongoose = require("mongoose")
const roleId = "652e4b682547cf7e2afe4045";

const register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address, image, role } = req.body;

        const newUser = new User({
            name,
            email,
            password,
            phoneNumber,
            address,
            image,
            role: new mongoose.Types.ObjectId(roleId)
        });

        
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    register
};
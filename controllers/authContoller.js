const User = require('../models/user')
const mongoose = require("mongoose")
const roleId = "652e4b682547cf7e2afe4045"
const {jwtToken} = require('../utils/jwtToken')
const cookie = require("cookie-parser")
const jwt = require ('jsonwebtoken')
const sendEmail = require("../utils/sendEmail")

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
            isVerified: false,
            isDeleted: false,
            role: new mongoose.Types.ObjectId(roleId)
        });


        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const login = async(req, res) => {

    const {email , password} = req.body;

    const user = await User.findOne({email})

    if(user && password == user.password)
    {
        const verificationToken = jwtToken.generate(user._id , '10m')

        if(!user.isVerified){
            const verificationLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;
            await sendEmail.sendEmail(user.email, "Email Verification", verificationLink);
            res.json({ message : "please check your email "})
        }else{
            res.status(201).json({ message: 'User logedin successfully.' });
        }

        }else{
            res.status(401).json({ message: 'Info Invalide' });
        }
} 

const emailVerification = async(req, res) => {
    const { token } = req.params;

    try {
        const decodedToken = jwtToken.verify(token, process.env.JWT_SECRET)

        if (decodedToken.id) {
            const user = await User.findById(decodedToken.id);

            if (user) {
                user.isVerified = true;
                await user.save();
                return res.status(200).json({ message: 'Email verified successfully.' });
            }
        }
        return res.status(400).json({ message: 'Invalid token for email verification.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const logout = async(req, res) => {
    res.clearCookie('jwtToken'); 
    res.json({ message: 'Logged out successfully' });
}

const forgetPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10m'})

        const resetLink = `${process.env.BASE_URL}/api/auth/reset-password/${resetToken}`;
        await sendEmail.sendEmail(user.email, 'Password Reset', resetLink);

        res.json({ message: 'Password reset link sent successfully.' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body

    try {
        const decodedToken = jwtToken.verify(token, process.env.JWT_SECRET)
        if (decodedToken.id) {
            const user = await User.findById(decodedToken.id)
            user.password = password
            await user.save()
            res.status(201).json({ message: 'Password is reset successfully.' });
        }else{
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

    } catch (error) {
        if(error.name == "TokenExpiredError"){
            res.status(500).json({ message: 'Your Token is Expired.' });
        }
    }
}



module.exports = {
    register,
    login,
    emailVerification,
    logout,
    forgetPassword,
    resetPassword
};
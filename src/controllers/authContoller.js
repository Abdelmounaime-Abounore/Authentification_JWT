const User = require('../models/user')
const Role = require('../models/role')
const mongoose = require("mongoose")
const {jwtToken} = require('../../utils/jwtToken')
const cookie = require('cookie-parser');
const jwt = require ('jsonwebtoken')
const sendEmail = require("../../utils/sendEmail")

const register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address, image, roleName } = req.body;

        const role = await Role.findOne({name: roleName})
        if(!role){
            return res.status(400).json({ message: 'Invalid role.' });
        }

        const newUser = new User({
            name,
            email,
            password,
            phoneNumber,
            address,
            image,
            isVerified: false,
            isDeleted: false,
            role: role._id
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

    const user = await User.findOne({email}).populate('role')

    if(user && password == user.password)
    {
        const verificationToken = jwtToken.generate(user._id , '30m')
        const tokenSended = verificationToken.replace(/\./g, '-')

        if(!user.isVerified){
            const verificationLink = `http://localhost:3000/email-verify?role=${user.role.name}&token=${tokenSended}`;
            await sendEmail.sendEmail(user.email, "Email Verification", verificationLink);
            return res.json({
                verificationMessage: "Please check your email for verification instructions.",
            });
        }

         res.cookie('jwtToken', verificationToken, { exp: "30m" });
            return res.status(201).json({ 
            message: `Welcome ${user.name}, your are ${user.role.name}`,
            user: {
                name: user.name,
                role: user.role.name,
            },
            token : verificationToken
        });
        

    }else{ 
        return res.status(400).json({ message: 'Info Invalide' });
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
        if(error.name == "TokenExpiredError"){
            res.status(500).json({ message: 'Your Token is Expired.' });
        }
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie('jwtToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error)
    }
}

const forgetPassword = async (req, res) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email}).populate('role')
        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '10m'})

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; 
        await sendEmail.sendEmail(user.email, 'Password Reset', resetLink);

        res.json({ message: 'Password reset link sent successfully.' });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

const resetPassword = async (req, res) => {
    const {token} = req.params;
    const password  = req.body.password;

    try {
        const decodedToken = jwtToken.verify(token, process.env.JWT_SECRET)
        if (decodedToken.id) {
            console.log('hhhhh1')
            const user = await User.findById(decodedToken.id)
            user.password = password
            await user.save()
            res.status(201).json({ message: 'Password is reset successfully.' });
        }else{
            return res.status(400).json({ message: 'Invalid token.' });
        }

    } catch (error) {
        if(error.name == "TokenExpiredError"){
            res.status(500).json({ message: 'Your Token is Expired.' });
        }
    }
}

const editPassword = async (req, res) => {
    try {
        const token = req.params.token;
        console.log(token, "hhhhh");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  
        if (!decodedToken.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(decodedToken.id)

        if (user.email !== req.body.email) {
            return res.status(400).json({ message: 'Invalid email.' });
        }

        if (user.password != req.body.oldPassword) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        user.password = req.body.password;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    register,
    login,
    emailVerification,
    logout,
    forgetPassword,
    resetPassword,
    editPassword
};
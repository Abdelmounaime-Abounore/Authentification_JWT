const User = require('../models/user')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const {JWT_SECRET} = process.env

const roleId = "652e4b682547cf7e2afe4045"

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

        
        // await newUser.save();

        console.log(JWT_SECRET);

        const token = jwt.sign({ verification: true }, JWT_SECRET, { expiresIn: '1d' });

        sendVerificationEmail(email, token)
        verifyEmail(req, res);

        res.status(201).json({ message: 'Check your email for verification.' });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'abdelmounaim.abounore@gmail.com',
            // pass: '' Your email password
        }
    });

    const mailOptions = {
        from: 'abdelmounaim.abounore@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: http://localhost:9000/api/verify/${token}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        throw new Error('Error sending verification email.');
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              console.log("error");
            } else {
              // Use the decoded information
              console.log(decoded);
            }
          });
        const decodedToken = jwt.verify(token, JWT_SECRET);

        if (decodedToken.verification) {
            // Find user and mark as verified
            const user = await User.findOne({ email: decodedToken.email });

            if (user) {
                user.isVerified = true;
                await user.save();
                return res.status(200).json({ message: 'Email verified successfully.' });
            }
        }

        return res.status(400).json({ message: 'Invalid token for email verification.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    register,
    verifyEmail
};
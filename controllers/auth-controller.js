require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register endpoint
const registerUser = async(req, res) => {
    try {

        
        //extract user information
        const {userName, email, password, role} = req.body;
        
        //checkvif the user already exist in our database
        const existingUser = await User.findOne({$or: [{userName}, {email}]});
        if(existingUser){
            return res.status(400).json({
                message: 'User already exist',
                success: false
            });
        }

        //hash user password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user and save in the database
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();

        if(newUser){
            return res.status(201).json({
                message: 'User created successfully',
                success: true
            });
        } else {
            return res.status(400).json({
                message: 'Invalid user data',
                success: false
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false
        }); 
    }
}

//login endpoint
const loginUser = async(req, res) => {
    try {
        //extract user information
        const {email, password} = req.body;

        //check if email doesn't exist in the database 
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: 'User not found, register first',
                success: false
            });    
        }
        console.log(user);


        //check if the password match the saved password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        //create a token for the curent user
        const token = jwt.sign(
            {userId: user._id, role: user.role, userName: user.userName, email: user.email}, 
            process.env.JWT_SECRET_KEY, 
            {expiresIn: '1h'}
        );

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            token: token
        });

        
        
    } catch (error) {
        console.log(error); 
        res.status(500).json({
            message: error.message,
            success: false
        }); 
    }
}

const changePassword = async(req, res) => {
    try {
        const userId = req.User.userId;

        //extract old and new password
        const {oldPassword, newPassword} = req.body;

        //check if oldPassword is correct
        const user = await User.findById(userId);

        //check if the user exist
        if(!user){
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        //check if the old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: 'Invalid old password',
                success: false
            });
        }

        //check if the new password is not the same as the old password
        if(oldPassword === newPassword){
            return res.status(400).json({
                message: 'New password cannot be the same as the old password',
                success: false
            });
        }else{
            //hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            //update the user password
            user.password = hashedPassword;
            await user.save();


            console.log(newPassword, hashedPassword);
             console.log(user);

            return res.status(200).json({
                message: 'Password changed successfully',
                success: true
            });
        }

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false
        });
    }
}


module.exports = {
    registerUser,
    loginUser,
    changePassword
};
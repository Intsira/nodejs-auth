const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();


router.get('/wellcome', authMiddleware, (req,res) => {
    const {userName, role, email, userId} = req.User;
    
    res.json({
        message : "home page",
        user: {
            userId,
            userName,
            role,
            email  
        }
    });
});

module.exports = router;
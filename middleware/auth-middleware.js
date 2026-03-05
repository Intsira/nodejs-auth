const jwt = require('jsonwebtoken');
require('dotenv').config();


//create a middleware to check the privilege of the user
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ 
        message: 'Unauthorized, please login',
        success: false
     });
    }

    //decode the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.User = decoded;

    } catch (error) {
        return res.status(500).json({ 
            message: 'Unauthorized, please login',
            success: false
         });    
    }

  
  next();
};

module.exports = authMiddleware;
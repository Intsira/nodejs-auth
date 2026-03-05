const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');


const router = express.Router();


router.get('/wellcome', authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        message: 'wellcome to admin page'
    } );
});

module.exports = router;


const isAdminUser = (req, res, next) => {
    if(req.User.role === 'admin'){
        next();
    } else {
        res.status(403).json({
            message: 'this page is Forbidden',
            success: false
        });
    }
};

module.exports = isAdminUser;
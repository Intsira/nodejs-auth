require('dotenv').config();

const express = require('express');
const connectDB = require('./database/db');
const authRoutes = require('./route/auth-route');
const homeRoutes = require('./route/home-routes');
const adminRoutes = require('./route/admin-routes');
const uploadImageRoutes = require('./route/image-route');


//connect to database
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

//using json middleware
app.use(express.json());

//using routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);


//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
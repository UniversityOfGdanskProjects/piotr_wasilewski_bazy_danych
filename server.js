const express = require('express');
const cors = require('cors');
const authController = require('./src/Controllers/authController.js');
const secureController = require('./src/Controllers/idleController.js');
const adminController = require('./src/Controllers/adminController.js');
const { isAdminMiddleware } = require('./src/Middlewares/isAdminMiddleware.js');
const { securePathMiddleware } = require('./src/Middlewares/securePathMiddleware.js');
const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/auth', authController);
app.use('/secure',securePathMiddleware,secureController);
app.use('/admin',securePathMiddleware,isAdminMiddleware,adminController);
app.use('/movies', moviesController);

app.listen(2020, () => {
    console.log('Server started on port 2020');
});
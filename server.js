const express = require('express');
const cors = require('cors');
const authController = require('./src/Controllers/authController.js');
const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/auth', authController);

app.listen(2020, () => {
    console.log('Server started on port 2020');
});
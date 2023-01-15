const express = require('express');
const router = express.Router();
const { registerNewUser, userLogin } = require('../Services/authService.js');

router.post('/register', async (req, res) => {
    const {email, password, name, last_name} = req.body;
    try {
        const result = await registerNewUser(email, password, name, last_name);
        res.status(200).json({message: result});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await userLogin(email, password);
        res.status(200).json({token: result});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

});

module.exports = router;
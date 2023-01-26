const express = require('express');
const router = express.Router();
const { registerNewUser, userLogin, getUser } = require('../Services/authService.js');

router.post('/register', async (req, res) => {
    const {email, password, name, last_name} = req.body;
    try {
        const result = await registerNewUser(email, password, name, last_name);
        res.status(200).json({message: result});
    } catch (error) {
        console.log(error.message);
        res.status(418).json({message: error});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await userLogin(email, password);
        res.status(200).json({token: result});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

router.get('/user', async (req, res) => {
    try {
        console.log(req.tokenInfo.id);
        const user = await getUser(req.tokenInfo.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
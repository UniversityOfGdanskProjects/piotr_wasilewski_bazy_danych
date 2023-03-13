const {getUser, getFavorites, getWishlist} = require('../Services/userService');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const user = await getUser(req.tokenInfo.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/favs', async (req, res) => {
    try {
        const favorites = await getFavorites(req.tokenInfo.id);
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/wishlist', async (req, res) => {
    try {
        const wishlist = await getWishlist(req.tokenInfo.id);
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
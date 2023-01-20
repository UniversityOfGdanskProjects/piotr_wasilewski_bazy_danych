const express = require('express');
const router = express.Router();
const { getGenres } = require('../Services/otherService');

router.get('/genres',  async (req, res) => {
    try {
        const result = await getGenres();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
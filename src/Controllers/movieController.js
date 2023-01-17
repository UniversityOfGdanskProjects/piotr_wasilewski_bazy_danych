const express = require('express');
const router = express.Router();
const { getMovieById } = require('../Services/movieService.js');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getMovieById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
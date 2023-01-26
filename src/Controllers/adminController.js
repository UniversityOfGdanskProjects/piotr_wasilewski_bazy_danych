const express = require('express');
const router = express.Router();
const {
    deleteUser,
    deleteComment,
    addMovie,
    getReport
} = require('../Services/adminService');

router.delete('/movie', async (req, res) => {
    // TODO: delete movie
});

router.delete('/user/:id', async (req, res) => {
    try {
        res = await deleteUser(req.params.id);
        res.status(200).json(res);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/comment/:id', async (req, res) => {
    try {
        result = await deleteComment(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/movie', async (req, res) => {
    const {title,
        description,
        year,
        director,
        actors,
        genre,
        poster_image,
        image_urls
    } = req.body;
    try {
        const result = await addMovie(title, description, year, director, actors, genre, poster_image, image_urls);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/report', async (req, res) => {
    try {
        const result = await getReport();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
module.exports = router;
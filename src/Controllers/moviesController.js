const express = require('express');
const router = express.Router();
const {
    getAllMoviesWithRatingsAndGenres,
    getBlockedMovies
} = require('../Services/moviesService');

router.get('/', async (req, res) => {
    const title = req.query.title;
    const genre = req.query.genre;
    const director = req.query.director;
    const year = req.query.year;
    const actor = req.query.actor;
   try {
         const result = await getAllMoviesWithRatingsAndGenres(title, genre, director, year, actor, req.tokenInfo.id);
         res.status(200).json(result);
   } catch (error) {
        res.status(500).json({message: error.message});
   }
});

router.get('/blocked', async (req, res) => {
    try {
        const result = await getBlockedMovies(req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

module.exports = router;

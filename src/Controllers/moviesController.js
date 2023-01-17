const express = require('express');
const router = express.Router();
const {
    getAllMoviesWithRatingsAndGenres,
    getMovieByTitleWithRatingAndGenre,
    getMovieByGenreWithRatingAndGenre,
    getMovieByDirectorWithRatingAndGenre,
    getMovieByYearWithRatingAndGenre,
    getMovieByActorWithRatingAndGenre
} = require('../Services/moviesService');

router.get('/', async (req, res) => {
    const filter = req.query.filter;
    const title = req.query.title;
    const genre = req.query.genre;
    const director = req.query.director;
    const year = Number(req.query.year);
    const actor = req.query.actor;
   try {
    if(filter === 'title') {
        const result = await getMovieByTitleWithRatingAndGenre(title);
        return res.status(200).json(result);
    } else if (filter === 'genre') {
        const result = await getMovieByGenreWithRatingAndGenre(genre);
        return res.status(200).json(result);
    } else if (filter === 'director') {
        const result = await getMovieByDirectorWithRatingAndGenre(director);
        return res.status(200).json(result);
    }else if (filter === 'year') {
        const result = await getMovieByYearWithRatingAndGenre(year);
        return res.status(200).json(result);
    } else if (filter === 'actor') {
        const result = await getMovieByActorWithRatingAndGenre(actor);
        return res.status(200).json(result);
    }
    else {    
         const result = await getAllMoviesWithRatingsAndGenres();
         res.status(200).json(result);
    }
   } catch (error) {
        res.status(500).json({message: error.message});
   }
});

module.exports = router;

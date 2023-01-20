const express = require('express');
const router = express.Router();
const { 
     getMovieById,
     addComment,
     addRate,
     addToWishlist,
     addToFavorites,
     deleteFromWishlist,
     deleteFromFavorites
    } = require('../Services/movieService.js');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getMovieById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        console.log(req.tokenInfo);
        const result = await addComment(id, comment,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {commentId} = req.body;
        const result = await deleteComment(id,req.tokenInfo.id,commentId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/rate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { rate } = req.body;
        rate = parseInt(rate);
        const result = await addRate(id, rate,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/wishlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await addToWishlist(id,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/wishlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteFromWishlist(id,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/favorite/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await addToFavorites(id,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.delete('/favorite/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteFromFavorites(id,req.tokenInfo.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
module.exports = router;
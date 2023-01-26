const express = require('express');
const router = express.Router();

router.delete('/movie', async (req, res) => {
    // TODO: delete movie
});

router.delete('/user', async (req, res) => {
    // TODO: delete user
});

router.delete('/comment', async (req, res) => {
    // TODO: delete comment
});

module.exports = router;
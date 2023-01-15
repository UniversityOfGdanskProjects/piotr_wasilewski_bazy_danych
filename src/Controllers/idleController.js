const express = require('express');
const { appendFile } = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'siema z zabezieczonego enpointa'});
});

module.exports = router;

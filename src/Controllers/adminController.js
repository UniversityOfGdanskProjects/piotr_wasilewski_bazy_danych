const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'siema z zabezieczonego enpointa jako admin'});
})

module.exports = router;
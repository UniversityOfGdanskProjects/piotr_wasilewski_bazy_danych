const dotenv = require('dotenv');
dotenv.config();
const SECRET = process.env.SECRET;

module.exports = { SECRET };
const express = require('express');
const cors = require('cors');
const authController = require('./src/Controllers/authController.js');
const adminController = require('./src/Controllers/adminController.js');
const moviesController = require('./src/Controllers/moviesController.js');
const movieController = require('./src/Controllers/movieController.js');
const userController = require('./src/Controllers/userController.js');
const otherController = require('./src/Controllers/otherController.js');
const { isAdminMiddleware } = require('./src/Middlewares/isAdminMiddleware.js');
const { securePathMiddleware } = require('./src/Middlewares/securePathMiddleware.js');
const { getTopMovies } = require('./src/Services/moviesService.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/auth', authController);
app.use('/admin',securePathMiddleware,isAdminMiddleware,adminController);
app.use('/movies/top', async (req, res) => {
    try {
        const result = await getTopMovies();
       return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
});
app.use('/movies', securePathMiddleware,moviesController);
app.use('/movie',securePathMiddleware, movieController);
app.use('/user',securePathMiddleware, userController);
app.use('/other', otherController);

app.listen(2020, () => {
    console.log('Server started on port 2020');
});
const {session} = require('../Config/db_connector');
const { userLogin } = require('./authService');

exports.getTopMovies = async (req, res) => {
    try {
        const result = await session.run(
            'MATCH (m:Movie)<-[r:RATED]-() WITH m, avg(r.rating) as avg_rating ORDER BY avg_rating DESC LIMIT 10 RETURN m, avg_rating'
);
            console.log(result);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image
                },
                rating: record._fields[1]
            }
        });
            return movies
        }
     catch (error) {
        throw new Error(error);
    }
};

exports.getAllMoviesWithRatingsAndGenres = async (title, genre, director, year, actor,user_id) => {
    try {
        console.log(`title: ${title}, genre: ${genre}, director: ${director}, year: ${year}, actor: ${actor}`);
        const query = `
        MATCH (p:Person)-[:ACTED_IN]->(m:Movie)-[:TYPE]->(g:Genre) ,
        (m)<-[:DIRECTED]-(d:Person) ,
        (m)<-[r:RATED]-(u:User)
        WHERE (g.name = "${genre}" OR "${genre}"= "")
        AND (toLower(p.name) contains toLower("${actor}") OR "${actor}"= "")
        AND (toLower(d.name) contains toLower("${director}") OR "${director}"= "")
        AND (toLower(m.title) contains toLower("${title}") OR "${title}"= "")
        AND (m.released = "${year}" OR "${year}"= "")
        WITH m ,
        avg(r.rating) as avg_rating,
        count(r) as rating_count,
        g as genre ORDER BY rating_count DESC,
        avg_rating DESC
        RETURN m, avg_rating, genre
        `;

        const blockedQuery = `
        MATCH (m:Movie)<-[:BLOCKED]-(u:User {id: "${user_id}"})
        RETURN m
        `;
        const result = await session.run(query);
        const blockedResult = await session.run(blockedQuery);
        console.log(result);
        const movies = result.records.map(record => {
            console.log(record._fields[0].properties);
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image,
                    tagline: record._fields[0].properties.tagline,
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }
    });
        const blockedMovies = blockedResult.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image,
                    tagline: record._fields[0].properties.tagline,
                }
            }
        });
        const filteredMovies = movies.filter(movie => {
            return !blockedMovies.some(blockedMovie => blockedMovie.movie.id === movie.movie.id);
        });
        return filteredMovies;
        }
     catch (error) {
        throw new Error(error);
    }
};

exports.getBlockedMovies = async (user_id) => {
    try {
        const query = `
        MATCH (m:Movie)<-[:BLOCKED]-(u:User {id: "${user_id}"}),
(m)<-[r:RATED]-(h:User)
WITH m ,
avg(r.rating) as avg_rating
RETURN m, avg_rating
        `;
        const result = await session.run(query);
        console.log(result);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image,
                    tagline: record._fields[0].properties.tagline,
                    rating: record._fields[1]
                }
            }
        });
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
}

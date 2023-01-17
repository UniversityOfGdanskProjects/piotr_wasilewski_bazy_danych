const {session} = require('../Config/db_connector');

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
                    id: record._fields[0].identity.low
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

exports.getAllMoviesWithRatingsAndGenres = async (req, res) => {
    try {
        const result = await session.run(
            'MATCH (m:Movie)<-[r:RATED]-(:User), (m:Movie)-[:TYPE]->(g:Genre) WITH m, avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre'
);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }
    });
        return movies;  
        }
     catch (error) {
        throw new Error(error);
    }
};

exports.getMovieByTitleWithRatingAndGenre = async (title) => {
    try {
        const query = `MATCH (m:Movie)<-[r:RATED]-(:User) , (m:Movie)-[:TYPE]->(g:Genre) WHERE apoc.text.clean(m.title) CONTAINS apoc.text.clean("${title}") WITH m , avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre`;
        const result = await session.run(query);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }   
        }); 
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
};

exports.getMovieByGenreWithRatingAndGenre = async (genre) => {
    try {
        const query = `MATCH (m:Movie)<-[r:RATED]-(:User) , (m:Movie)-[:TYPE]->(g:Genre) WHERE apoc.text.clean(g.name) CONTAINS apoc.text.clean("${genre}") WITH m , avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre`;
        const result = await session.run(query);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }   
        }); 
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.getMovieByDirectorWithRatingAndGenre = async (director) => {
    try {
        const query = `MATCH (m:Movie)<-[r:RATED]-(:User) , (m:Movie)-[:TYPE]->(g:Genre) WHERE apoc.text.clean(m.director) CONTAINS apoc.text.clean("${director}") WITH m , avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre`;
        const result = await session.run(query);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }   
        }); 
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.getMovieByYearWithRatingAndGenre = async (year) => {
    try {
        const query = `MATCH (m:Movie)<-[r:RATED]-(:User) , (m:Movie)-[:TYPE]->(g:Genre) WHERE m.released=${year} WITH m , avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre`;
        const result = await session.run(query);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }   
        }); 
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.getMovieByActorWithRatingAndGenre = async (actor) => {
    try {
        const query = `MATCH (m:Movie)<-[r:RATED]-(:User) , (m:Movie)-[:TYPE]->(g:Genre) ,(m:Movie)<-[:ACTED_IN]-(p:Person) where toLower(p.name) contains toLower(apoc.text.join(apoc.text.split("${actor}", '-'),' ')) WITH m , avg(r.rating) as avg_rating, count(r) as rating_count, g as genre ORDER BY rating_count DESC, avg_rating DESC RETURN m, avg_rating, genre`;
        const result = await session.run(query);
        const movies = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].identity.low
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }   
        }); 
        return movies;
        }
     catch (error) {
        throw new Error(error);
    }
}
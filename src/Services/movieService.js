const {session} = require('../Config/db_connector.js');

exports.getMovieById = async (id) => {
    try {
        const result = await session.run(
            `MATCH (m:Movie)<-[r:RATED]-(:User),
            (m:Movie)-[:TYPE]->(g:Genre)
            WHERE m.id = $id
            WITH m, avg(r.rating) as avg_rating, count(r) as rating_count,
            g as genre 
            ORDER BY rating_count DESC,
            avg_rating DESC 
            RETURN m, avg_rating, genre`,
            {id}
        );
        const movie = result.records.map(record => {
            return {
                movie: {
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released.low,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image,
                    image_urls: record._fields[0].properties.image_urls
                },
                rating: record._fields[1],
                genre: record._fields[2].properties.name
            }
        });
        const cast = await session.run(
            `MATCH (m:Movie)<-[r:ACTED_IN]-(a:Person)
            WHERE m.id = $id
            RETURN a`,
            {id}
        );
        const castList = cast.records.map(record => {
            return {
                name: record._fields[0].properties.name,
                id: record._fields[0].properties.id,
                profile_image: record._fields[0].properties.profile_image
            }
        });
        const crew = await session.run(
            `MATCH (m:Movie)<-[r:DIRECTED]-(a:Person)
            WHERE m.id = $id
            RETURN a`,
            {id}
        );
        const crewList = crew.records.map(record => {
            return {
                name: record._fields[0].properties.name,
                id: record._fields[0].properties.id,
                profile_image: record._fields[0].properties.profile_image
            }
        });

        const comments = await session.run(
            `MATCH (m:Movie)<-[r:COMMENTED]-(u:User)
            WHERE m.id = $id
            RETURN u,r`,
            {id}
        );
        const commentList = comments.records.map(record => {
            return {
                user: {
                    name: record._fields[0].properties.name,
                    id: record._fields[0].properties.id,
                    profile_image: record._fields[0].properties.profile_image
                },
                comments: record._fields[1].properties.comments
            }
        });


        return {movie:movie,director:crewList,actors:castList,comments:commentList};
    } catch (error) {
        throw new Error(error);
    }
    
};

exports.addComment = async (movie_id, comment, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            MERGE (u)-[c:COMMENTED {comments:[]}]->(m)
            ON CREATE SET c.comments = ["${comment}"]
            ON MATCH SET c.comments = c.comments + ["${comment}"]`,
            
        );
        return {message: 'Comment added successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.deleteComment = async (movie_id, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'})-[r:COMMENTED]->(m:Movie {id: '${movie_id}'})
            DELETE r`,
        );
        return {message: 'Comment deleted successfully!'};
    }
    catch (error) {
        throw new Error(error);
    }
}


exports.addRate = async (movie_id, rate, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            MERGE (u)-[r:RATED {rating: ${rate}}]->(m)`,
            
        );
        return {message: 'Rating added successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.addToWishlist = async (movie_id, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            MERGE (u)-[r:WISHLISTED]->(m)`,
            
        );
        return {message: 'Movie added to wishlist successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.addToFavorites = async (movie_id, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            MERGE (u)-[r:FAVORITED]->(m)`,
            
        );
        return {message: 'Movie added to favorites successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.deleteFromWishlist = async (movie_id, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'})-[r:WISHLISTED]->(m:Movie {id: '${movie_id}'})
            DELETE r`,
            
        );
        return {message: 'Movie deleted from wishlist successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}
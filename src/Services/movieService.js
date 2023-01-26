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
                
                    title: record._fields[0].properties.title,
                    released: record._fields[0].properties.released,
                    tagline: record._fields[0].properties.tagline,
                    id: record._fields[0].properties.id,
                    poster_path: record._fields[0].properties.poster_image,
                    image_urls: record._fields[0].properties.image_urls,
                    rating: record._fields[1],
                    genre: record._fields[2].properties.name
            }
        })[0];
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
                },
                comments: record._fields[1].properties.comments,
                id: record._fields[1].properties.id
            }
        });

        return {movie,director:crewList,actors:castList,comments:commentList};
    } catch (error) {
        throw new Error(error);
    }
    
};

exports.addComment = async (movie_id, comment, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            CREATE (u)-[r:COMMENTED {id: apoc.create.uuid(), comments: '${comment}'}]->(m)
            `,
            
        );
        
        return {message: 'Comment added successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.getMovieComments = async (movie_id) => {
    try {
        const result = await session.run(
            `MATCH (m:Movie)<-[r:COMMENTED]-(u:User)
            WHERE m.id = $id
            RETURN u,r`,
            {id: movie_id}
        );
        const commentList = result.records.map(record => {
            return {
                user: {
                    name: record._fields[0].properties.name,
                    id: record._fields[0].properties.id,
                },
                comments: record._fields[1].properties.comments
            }
        });
        return commentList;
    } catch (error) {
        throw new Error(error);
    }
}

// {
//     "user": {
//         "name": "wiktor",
//         "id": "5580a7f5-3a14-47bd-8c81-a69b9cee7e6a"
//     },
//     "comments": [
//         "Dobry,film"
//     ]
// },
exports.deleteComment = async (movie_id, user_id, comment_id) => {
    console.log(`movie_id: ${movie_id}, user_id: ${user_id}, comment_id: ${comment_id}`);
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'})-[r:COMMENTED {id: "${comment_id}"}]->(m:Movie {id: '${movie_id}'})
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
        const isALreadyRated = await session.run(
            `match (u:User {id: '${user_id}'})-[r:RATED]->(m:Movie {id: '${movie_id}'})
            RETURN r`,
        );
        if(isALreadyRated.records.length > 0){
            return {message: 'Already rated!'};
        }
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
        const isALreadyInWishlist = await session.run(
            `match (u:User {id: '${user_id}'})-[r:WISHLISTED]->(m:Movie {id: '${movie_id}'})
            RETURN r`,
        );
        if(isALreadyInWishlist.records.length > 0){
            return {message: 'Movie already in wishlist!'};
        }
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

exports.addToFavorites = async (movie_id, user_id) => {
    try {
        const isALreadyInFavorites = await session.run(
            `match (u:User {id: '${user_id}'})-[r:FAVORITED]->(m:Movie {id: '${movie_id}'})
            RETURN r`,
        );
        if(isALreadyInFavorites.records.length > 0){
            return {message: 'Movie already in favorites!'};
        }
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

exports.deleteFromFavorites = async (movie_id, user_id) => {
    try {
        const result = await session.run(
            `match (u:User {id: '${user_id}'})-[r:FAVORITED]->(m:Movie {id: '${movie_id}'})
            DELETE r`,
            
        );
        return {message: 'Movie deleted from favorites successfully!'}; 
        }
     catch (error) {
        throw new Error(error);
    }
}

exports.blockMovie = async (movie_id, user_id) => {
    console.log(`movie_id: ${movie_id}, user_id: ${user_id}`);
    const query = `MATCH (u:User {id: '${user_id}'})-[r:BLOCKED]->(m:Movie {id: '${movie_id}'})
    RETURN r`;
    try {
        const result = await session.run(query);
        if(result.records.length > 0){
            return {message: 'Movie already blocked!'};
        }
        const result2 = await session.run(
            `MATCH (u:User {id: '${user_id}'}) , (m:Movie {id: '${movie_id}'})
            CREATE (u)-[:BLOCKED]->(m)`,
        );
        return {message: 'Movie blocked successfully!'};
    } catch (error) {
        throw new Error(error);
    }
}

exports.unBlockMovie = async (movie_id, user_id) => {
    console.log(`movie_id: ${movie_id}, user_id: ${user_id}`);
    const query = `MATCH (u:User {id: '${user_id}'})-[r:BLOCKED]->(m:Movie {id: '${movie_id}'})
    DELETE r`;
    try {
        const result = await session.run(query);
        return {message: 'Movie unblocked successfully!'};
    } catch (error) {
        throw new Error(error);
    }
}


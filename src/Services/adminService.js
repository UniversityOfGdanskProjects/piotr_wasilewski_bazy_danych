const {session} = require('../Config/db_connector.js');

exports.deleteUser = async (id) => {
    try {
        const isUser = await session.run('MATCH (n:User {id: $id}) RETURN n', {id});
        if (isUser.records.length === 0) throw new Error('User not found');
        const result = await session.run('MATCH (n:User {id: $id}) DETACH DELETE n', {id});
        return result;
    } catch (error) {
        throw new Error(error);
        return error;
    }
}  

exports.deleteComment = async (id) => {
    try {
        const isComment = await session.run(`MATCH (:Movie)<-[c:COMMENTED {id: "${id}"}]-(:User) return c`);
        console.log('siema po isUser');
        if (isComment.records.length === 0) throw new Error('Comment not found');
        const result = await session.run(`MATCH (:Movie)<-[c:COMMENTED {id: "${id}"}]-(:User) DETACH DELETE c`);
        return 'Comment deleted successfully!';
    } catch (error) {
        throw new Error(error);
    }
}

exports.addMovie = async (title, description, year, director, actors, genre, poster_image, image_urls) => {
    try {
        const isMovie = await session.run('MATCH (n:Movie {title: $title}) RETURN n', {title});
        if (isMovie.records.length !== 0) throw new Error('Movie already exists');
        const result = await session.run('CREATE (n:Movie {title: $title, description: $description, year: $year, director: $director, actors: $actors, genre: $genre, poster_image: $poster_image, image_urls: $image_urls}) RETURN n', {title, description, year, director, actors, genre, poster_image, image_urls});
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getReport = async () => {
    const query = `
    MATCH (m:Movie)
    WITH count(m) as movies
    MATCH (u:User)
    WITH movies, count(u) as users
    MATCH (u:User)-[r:COMMENTED]->(:Movie)
    WITH movies, users, count(u) as comments, u, collect(r.rating) as ratings
    ORDER BY comments DESC
    LIMIT 1
    MATCH (best_user:User) WHERE ID(best_user) = ID(u)
    WITH movies, users, comments, best_user, ratings
    MATCH (m:Movie)<-[r:COMMENTED]-(:User)
    WITH movies, users, comments, best_user, ratings, m, avg(r.rating) as rating
    ORDER BY rating DESC
    LIMIT 1
    MATCH (best_movie:Movie) WHERE ID(best_movie) = ID(m)
    MATCH (a:Person)-[:ACTED_IN]->(:Movie)
    WITH movies, users, comments, best_user, best_movie, count(distinct a) as actors
    MATCH (d:Person)-[:DIRECTED]->(:Movie)
    WITH movies, users, comments, best_user, best_movie, actors, count(distinct d) as directors
    MATCH (g:Genre)
    RETURN movies, users, comments, best_user, best_movie, actors, directors, count(g) as genres    
    `;
    try {
        const result = await session.run(query);
        return result.records.map(record => {
            return {
                movies: record._fields[0].low,
                users: record._fields[1].low,
                comments: record._fields[2].low,
                best_user: record._fields[3].properties.name,
                best_movie: record._fields[4].properties.title,
                actors: record._fields[5].low,
                directors: record._fields[6].low,
                genres: record._fields[7].low,
            }
        }   );
    } catch (error) {
        throw new Error(error);
    }
}

exports.deleteMovie = async (id) => {
    try {
        const isMovie = await session.run('MATCH (n:Movie {id: $id}) RETURN n', {id});
        if (isMovie.records.length === 0) throw new Error('Movie not found');
        const result = await session.run('MATCH (n:Movie {id: $id}) DETACH DELETE n', {id});
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getUsers = async () => {
    const query = `
     MATCH (n:User) RETURN n
     `;
    try {
        const result = await session.run(query);
        console.log(result);
        return result.records.map(record => {
            return {
                id: record._fields[0].properties.id,
                name: record._fields[0].properties.name,
                email: record._fields[0].properties.email,
            }
        });
    }
    catch (error) {
        throw new Error(error);
    }
}
    
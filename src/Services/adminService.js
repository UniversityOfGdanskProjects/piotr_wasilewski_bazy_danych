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
       
    `;
    try {
        
    } catch (error) {
        
    }
}

const {session} = require('../Config/db_connector.js');

exports.getGenres = async () => {
    try {
        const result = await session.run(
            `MATCH (g:Genre)
            RETURN g`
        );
        const genres = result.records.map(record => {
            return {
                name: record._fields[0].properties.name,
                id: record._fields[0].properties.id
            }
        });
        return genres;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getMostActive = async () => {
    try {
        const query = `
        match (u:User)-[c:COMMENTED]->(:Movie) 
        with u.name as user_name, 
        count(c) as num_of_comments 
        return user_name, num_of_comments
        `;
        const result = await session.run(query);
        const users = result.records.map(record => {
            return {
                name: record._fields[0],
                comments: record._fields[1].low
            }
        }
        );
        return users;
    } catch (error) {
        throw new Error(error);
    }
}
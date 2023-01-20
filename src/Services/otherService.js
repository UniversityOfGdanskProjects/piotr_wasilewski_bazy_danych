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
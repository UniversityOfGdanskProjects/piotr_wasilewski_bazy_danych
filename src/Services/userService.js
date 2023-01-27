exports.getUser = async (id) => {
    try {
        const result = await session.run(`MATCH (n:User {id: "${id}"}) RETURN n`);
        const object = result.records[0]._fields[0].properties;
        delete object['password'];
        return object;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getFavorites = async (id) => {
    try {
        const result = await session.run(
            `MATCH (u:User {id: "${id}"})-[r:FAVORITED]->(m:Movie) RETURN m`
        );
        console.log(result.records[0]._fields[0].properties);
        const favorites = result.records.map(record => {
            return {
                id: record._fields[0].properties.id,
                title: record._fields[0].properties.title,
                poster: record._fields[0].properties.poster_path,
                rating: record._fields[0].properties.rating,
                genre: record._fields[0].properties.genre
            }
        });
        return favorites;
    } catch (error) {
        throw new Error(error);
    }
}

exports.getWishlist = async (id) => {
    try {
        const result = await session.run(
            `MATCH (u:User {id: "${id}"})-[r:WISHLISTED]->(m:Movie) RETURN m`
        );
        const wishlist = result.records.map(record => {
            return {
                id: record._fields[0].properties.id,
                title: record._fields[0].properties.title,
                poster: record._fields[0].properties.poster,
                rating: record._fields[0].properties.rating,
                genre: record._fields[0].properties.genre
            }
        });
        return wishlist;
    } catch (error) {
        throw new Error(error);
    }
}
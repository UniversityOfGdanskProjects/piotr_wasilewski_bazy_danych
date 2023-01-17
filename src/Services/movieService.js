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

        return {movie,crewList,castList};
    } catch (error) {
        throw new Error(error);
    }
    
};
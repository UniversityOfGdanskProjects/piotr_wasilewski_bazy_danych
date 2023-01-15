const { session } = require('../Config/db_connector.js');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../Config/vars.js');
const bcrypt = require('bcrypt');

exports.registerNewUser = async (email, password, name, last_name) => {
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        await session.run('CREATE (n:User {id: apoc.create.uuid(),email: $email, password: $hashPassword, name: $name, last_name: $last_name}) RETURN n', {email, hashPassword, name, last_name});
        return 'User created';
    } catch (error) {
        throw new Error(error);
    }
}

exports.userLogin = async (email, password) => {
    try {
        const result = await session.run('MATCH (n:User {email: $email}) RETURN n', {email});
        const user = result.records[0]._fields[0].properties;
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
            // 
            console.log(result.records[0]._fields[0].properties.id);
            const token = jwt.sign({id: user.id},SECRET, {expiresIn: '1h'});
            return token;
        } else {
            return 'Wrong password';
        }
    } catch (error) {
        throw new Error(error);
    }
}
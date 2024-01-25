const { session } = require('../Config/db_connector.js');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../Config/vars.js');
const bcrypt = require('bcrypt');

exports.registerNewUser = async (email, password, name, last_name) => {
    console.log(email, password, name, last_name);
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const isUnique = await session.run('MATCH (n:User {email: $email}) RETURN n', {email});
        if (isUnique.records.length > 0) throw new Error('User already exists');
        await session.run('CREATE (n:User {id: apoc.create.uuid(),email: $email, password: $hashPassword, name: $name, last_name: $last_name, role: "USER"}) RETURN n', {email, hashPassword, name, last_name});
        return 'User created';
    } catch (error) {
        throw new Error(error);
    }
}

exports.userLogin = async (email, password) => {
    try {
        const result = await session.run('MATCH (n:User {email: $email}) RETURN n', {email});
        if (result.records.length === 0) throw new Error('User not found');
        console.log(result);
        const user = result.records[0]._fields[0].properties;
        const comparePassword = await bcrypt.compare(password, user.password);
        if (comparePassword) {
            console.log(result.records[0]._fields[0].properties);
            const token = jwt.sign({id: user.id, role:user.role},SECRET, {expiresIn: '1h'});
            return token;
        } else {
            throw new Error('Wrong password');
        }
    } catch (error) {
        throw new Error(error);
    }
}


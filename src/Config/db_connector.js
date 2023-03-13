const neo4j = require('neo4j-driver');

const driver = neo4j.driver('bolt://pwasil.pl:10001', neo4j.auth.basic('neo4j', 'test1234'));

session = driver.session();

module.exports = { session };
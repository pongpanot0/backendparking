const { MongoClient } = require("mongodb");
const uri = `${process.env.mongodb}`;
const conn = new MongoClient(uri);
conn.connect();
console.log("Start");
module.exports = conn;

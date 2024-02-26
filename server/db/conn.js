//import { MongoClient } from "mongodb";

require("dotenv").config({ path: "../loadEnvironment.mjs" });
const MongoClient = require("mongodb").MongoClient;
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient("mongodb+srv://jnbernabe:jnbMongo94!@navigrade.sznat3k.mongodb.net/?retryWrites=true&w=majority");

let _db;

module.exports = {
  connectToServer: async function (callback) {

    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }

    _db = client.db("NavigradeDB");
    console.log("connected to db")
    return (_db === undefined ? false : true);
  },
  getDb: function () {
    return _db;
  },
};


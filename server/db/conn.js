const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;

const client = new MongoClient(Db);
var _db;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect();
      _db = client.db("Cluster0");
      console.log("Successfully connected to MongoDB.");
    } catch (err) {
      console.error("Failed to connect to MongoDB", err);
      throw err; // Rethrow the error for further handling
    }
  },

  getDb: function () {
    if (!_db) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return _db;
  },
};

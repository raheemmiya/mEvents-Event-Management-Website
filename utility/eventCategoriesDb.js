const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;

const url =
  "mongodb+srv://dev123:mernStack124@mern-stack-projects.woja8.mongodb.net/?retryWrites=true&w=majority&appName=MERN-Stack-Projects";

const dbName = "Event-Management-System";

let _db;

const mongoConnect = () => {
  mongoClient
    .connect(url, (err, db) => {
      if (err) throw err;
    })
    .then((result) => {
      console.log("Database connected successfully");
      if (result) {
        _db = result.db(dbName);
      }
    });
};

mongoConnect();

const getEventCategoriesDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Event Categories database found!";
};

module.exports = {
  getEventCategoriesDb,
  mongoConnect
};

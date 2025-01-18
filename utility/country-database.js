const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;

const url =
  "mongodb+srv://dev123:mernStack124@mern-stack-projects.woja8.mongodb.net/?retryWrites=true&w=majority&appName=MERN-Stack-Projects";

const dbName = "Event-Management-System";

let _db;

const mongoConnect = () => {
  MongoClient.connect(url)
    .then((result) => {
      if (result) {
        _db = result.db(dbName);
      }
    })
    .catch((err) =>
      console.log("Error while connecting the country database", err)
    );
};

mongoConnect();

const getCountryDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Country Database Found";
};

module.exports = {
  getCountryDb,
  mongoConnect,
};

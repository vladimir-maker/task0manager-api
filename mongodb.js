const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://localhost:27017";
const databaseName = "task-maneger";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName);

    db.collection("tasks")
      .deleteOne({
        description: "create templates",
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

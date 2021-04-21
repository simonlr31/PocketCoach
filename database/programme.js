const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createPool({
  host: "localhost",
  user: "pocketcoach_user",
  password: "secret",
  database: "pocketcoach",
});

// Starting our app.
const app = express();

// Creating a GET route that returns data from the 'users' table.
app.get("/programme", function (req, res) {
  // Connecting to the database.
  connection.getConnection(function (err, connection) {
    // Executing the MySQL query (select all data from the 'users' table).
    connection.query(
      "SELECT * FROM programme",
      function (error, results, fields) {
        // If some error occurs, we throw an error.
        if (error) throw error;

        // Getting the 'response' from the database and sending it to our route. This is were the data is.
        res.send(results);
      }
    );
  });
});

// Starting our server.
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/programme so you can see the data.");
});

// test(){
//   fetch('http://169.254.26.69/16:3000/programme')
//     .then(response => response.json())
//     .then(programmes => console.warn(programmes))
// }

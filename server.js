const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = {
  origin: "http://localhost:8080",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// defines the routes for the server
require("./api/routes/programme.route")(app);
require("./api/routes/semaine.route")(app);
require("./api/routes/seance.route")(app);
require("./api/routes/video.route")(app);
require("./api/routes/utilisateur.route")(app);
// require("./api/routes/note.routes.js")(app);
// require("./api/routes/utilisateur.routes.js")(app);
// require("./api/routes/location.routes.js")(app);
// require("./api/routes/vetement.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

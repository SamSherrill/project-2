const express = require("express");
const compression = require("compression");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

const db = require("./models");

// app.use(express.static("public"));
app.use(express.static("dist"));

// Parse application body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(compression());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

require("./routes/handlebars-routes.js")(app);
require("./routes/user-games-api-routes.js")(app);

app.get("/api/config", function (req, res) {
  res.json({
    success: true,
  });
});

// db.sequelize.sync({force: true}).then(function () {
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`Server listening on: http://localhost:${PORT}`);
  });
});
const db = require("../models");

module.exports = function (app) {

  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/SteamUser/:username", function (req, res) {

    const user = req.params.username;
    // const user = "dabigcheezey";
    console.log("user in when 1st defined: ", user);
    // use sequelize to find the user in our DB
    db.SteamUser.findOne({
      where: {
        // BUT this is almost for sure not ID
        personaName: user,
      }
    })
      .then((user) => {
        // check our DB for the user. IF they exist their with their games list,
        // then we display those in the browser with res.render("SteamUser");
        // res.render("SteamUser", {user});
        console.log("user in .then: ", user);
      })
      .catch((err) => {
        console.log(err);
        // If they aren't in our DB, then we use a .catch()
        // that will need to use user-api-routes.js &
        // user-games-api-routes.js to do the necessary calls to Steam's API

        // pass in data
        // data passed to handlebars files comes through the html-routes file
      });
  });
};

// USER.JS CODE:

// module.exports = function (sequelize, DataTypes) {
//   const SteamUser = sequelize.define("SteamUser", {
//     personaName: DataTypes.STRING,
//     steamId: DataTypes.STRING,
//     profileUrl: DataTypes.STRING,
//     avatarUrl: DataTypes.STRING
//   });

//   SteamUser.associate = function (models) {
//     SteamUser.belongsToMany(models.Game, {
//       through: "SteamUserGames",
//       foreignKey: "steamUserId",
//     });
//   };
//   return SteamUser;
// };
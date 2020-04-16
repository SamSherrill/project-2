//get user info
//http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F83481CE586D90CD0924F6576AA13DEC&steamids=76561198071626037

//get user id by steam name
//"http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=58B845E0858DDB3A73B47D71B787198A&vanityurl=sammysticks"

var db = require("../models");
module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY || "58B845E0858DDB3A73B47D71B787198A";

  function getUserInfo(apiKey, cb) {
    const user = "sammysticks";
    const queryVanityUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${user}`;

    axios.get(queryVanityUrl).then(function (res) {
      console.log(res.data.response.steamid);
      let userId = res.data.response.steamid;
      const querySteamUserUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`;
      axios.get(querySteamUserUrl).then(function (res) {
        console.log(res.data.response.players);
        let steamUser = {
          personaName: res.data.response.players[0].personaname,
          steamId: res.data.response.players[0].steamid,
          profileUrl: res.data.response.players[0].profileurl,
          avatarUrl: res.data.response.players[0].avatarmedium,
        };
        return cb(steamUser);
      });
    });
  }

  // app.post("/api/posts", function(req, res) {
  //     db.Post.create(req.body).then(function(dbPost) {
  //       res.json(dbPost);
  //     });
  //   });

  app.post("/api/steamUsers", function (req, res) {
    getUserInfo(apiKey, (steamUser) => {
      db.SteamUser.create(steamUser).then(function (dbPost) {
        res.json(dbPost);
      });
    });
  });

  app.get("/api/steamUsers", function (req, res) {
    db.SteamUser.findAll({}).then((user) => {
      res.json(user);
    });
  });

  app.get("/api/steamUsers/:steamUserId", function (req, res) {
    db.SteamUser.findOne({
      where: {
        steamId: req.params.steamId,
      },
    }).then((user) => {
      res.json(user);
    });
  });
};

//   const SteamUser = sequelize.define("SteamUser", {
//     personaName: DataTypes.STRING,
//     steamId: DataTypes.STRING,
//     profileUrl: DataTypes.STRING,
//     avatarUrl: DataTypes.STRING
//   });

// ****** PSEUDO CODE HERE:

// What do we need to do in this folder? Let's pseudo code that.

// This file will reference our models. We will need to require them.
// Also, we'll need to require expres & setup a router.

// const express = require("express");
// const router = express.Router();
// const db = require("../models");

// What routes do we need to setup for this file?
// First we need to check our DB to see if the user exists there
// If the user doesn't exist there, we we'll need to get their info from the Steam API
// That if

// /users/:username (or similar)
// Make this using seed data first. Show their pertinent info, and all of their games.

// To pull the data we need to display, we will almost certainly use the following code:

//

// We'll do the above first with seed data
// THen next we'll need to make that work with real data
// That will require a check of whether we already have their data in our DB already
// If we have it, return that data; if we don't, call the Steam API
// We'll need to be prepared to show our user an error if we can't find the user's info
// THey may have mistyped it, or the username my not exist. We'll want to make up for user error if possible.58B845E0858DDB3A73B47D71B787198A
// Edge case, we may want to show our user options of multiple Steam UserNames, if the
// name they typed is too similar to names of other steam user. This is probably outside the scope of our MVP.
// Edge case note: Users may buy new games after we have pulled their data once

// ****** END PSEUDO CODE

// userController.js from Jonathan's lego tracker app:
// const express = require("express");
// const router = express.Router();
// const db = require("../models");

// router.get("/users", function (req, res) {
//   db.User.findAll()
//     .then((users) => {
//       console.log(users);
//       res.render("all-users", { users });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500);
//       res.json({
//         error: true,
//       });
//     });
// });

// router.get("/users/:id", function (req, res) {
//   db.User.findOne({
//     where: {
//       id: req.params.id,
//     },
//     include: [
//       {
//         model: db.Lego,
//       },
//     ],
//   })
//     .then((user) => {
//       console.log(user.Legos);
//       res.render("single-user", { user, legos: user.Legos });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500);
//       res.json({
//         error: true,
//       });
//     });
// });

// router.get("/api/users", function (req, res) {
//   db.User.findAll()
//     .then((users) => {
//       console.log(users);
//       res.json(users);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500);
//       res.json({
//         error: true,
//       });
//     });
// });

// router.get("/api/users/:id", function (req, res) {
//   db.User.findOne({
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((user) => {
//       console.log(user);
//       res.json(user);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500);
//       res.json({
//         error: true,
//       });
//     });
// });

// module.exports = router;

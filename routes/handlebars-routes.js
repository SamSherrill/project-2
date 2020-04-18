const db = require("../models");

module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY || "58B845E0858DDB3A73B47D71B787198A";

  function getUserInfo(apiKey, user, cb) {
    const queryVanityUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${user}`;

    axios.get(queryVanityUrl).then(function (res) {
      let userId = res.data.response.steamid;
      const querySteamUserUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`;
      axios.get(querySteamUserUrl).then(function (res) {
        if (res.data.response.players.length > 0) {
          let steamUser = {
            personaName: res.data.response.players[0].personaname,
            steamId: res.data.response.players[0].steamid,
            profileUrl: res.data.response.players[0].profileurl,
            avatarUrl: res.data.response.players[0].avatarmedium,
          };
          return cb(steamUser);
        } else {
          return console.log("Couldn't find user!");
          // redirect to a 404 page user not found
        }
      });
    });
  }

  app.post("/api/steamUsers", function (req, res) {
    db.SteamUser.findOne({
      where: {
        personaName: req.body.user,
      },
    }).then((user) => {
      console.log(user);
      if (!user) {
        getUserInfo(apiKey, req.body.user, (steamUser) => {
          db.SteamUser.create(steamUser).then(function (dbPost) {
            res.json(dbPost);
          });
        });
      } else {
        console.log("user already exists!");
      }
    });
  });

  app.get("/api/steamUsers", function (req, res) {
    db.SteamUser.findAll({}).then((user) => {
      res.json(user);
    });
  });

  app.get("/api/steamUsers/:personaName", function (req, res) {
    db.SteamUser.findOne({
      where: {
        personaName: req.params.personaName,
      },
    }).then((user) => {
      console.log(
        "User in the app.get(/api.steamUsers/:personaName function .then",
        user
      );
      console.log("User object from database: ", user);
      res.json(user);
    });
  });
  app.get("/", function (req, res) {
    res.render("index");
  });

  app.get("/SteamUser/:username", function (req, res) {
    const user = req.params.username;
    // const user = "dabigcheezey";
    // use sequelize to find the user in our DB
    db.SteamUser.findOne({
      where: {
        // BUT this is almost for sure not ID
        personaName: user,
      },
      include: [db.Game],
    })
      .then((user) => {
        user = [{ user: user.dataValues }];
        // check our DB for the user. IF they exist their with their games list,
        // then we display those in the browser with res.render("SteamUser");
        res.render("SteamUser", {
          user: user,
        });
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

  // app.get("/SteamUser/:twoUsers", function (req, res) {
  // SteamUser/sammysticks&dabigcheezey
  function getTwoUsers(userOne, userTwo, cb) {
    const userArray = [];
    db.SteamUser.findOne({
      where: {
        // BUT this is almost for sure not ID
        personaName: userOne,
      },
      include: [db.Game],
    }).then((res) => {
      const userOneObject = {
        user: res.dataValues,
      };
      userArray.push(userOneObject);
    });
    db.SteamUser.findOne({
      where: {
        personaName: userTwo,
      },
      include: [db.Game],
    }).then((res) => {
      const userTwoObject = {
        user: res.dataValues,
      };
      userArray.push(userTwoObject);
      cb(userArray);
    });
  }

  app.get("/SteamUsers/:usernameOne/:usernameTwo", function (req, res) {
    const userOne = req.params.usernameOne;
    const userTwo = req.params.usernameTwo;
    // const user = "dabigcheezey";
    //console.log("user in when 1st defined: ", user);
    // use sequelize to find the user in our DB

    getTwoUsers(userOne, userTwo, (response) => {
      const userObj = response;
      const userOneArray = [];
      const userTwoArray = [];
      const sharedGamesArray = [];
      for (var i = 0; i < userObj.length; i++) {
        let gamesArray = userObj[i].user.Games;
        for (var j = 0; j < gamesArray.length; j++) {
          if (i === 0) {
            userOneArray.push(gamesArray[j].name);
          } else {
            userTwoArray.push(gamesArray[j].name);
          }
        }
      }
      for (var i = 0; i < userOneArray.length; i++) {
        for (var j = 0; j < userTwoArray.length; j++) {
          if (userTwoArray[j] === userOneArray[i]) {
            sharedGamesArray.push({name: userTwoArray[j]});
          }
        }
      }
      // console.log("This is the userObj: ", userObj);
      res.render("SteamUser", {
        user: userObj,
        sharedGames: sharedGamesArray
      });
    });

    // check our DB for the user. IF they exist their with their games list,
    // then we display those in the browser with res.render("SteamUser");
    // console.log("user in .then: ", user);
    //   res.render("index", {
    //     userOne,
    //     userTwo,
    //     gamesOne: userOne.Games,
    //     //gamesTwo: userTwo.Games,
    //   });
    //   //{ user, legos: user.Legos }
    // })
    // .catch((err) => {
    //   console.log(err);
    //   // If they aren't in our DB, then we use a .catch()
    //   // that will need to use user-api-routes.js &
    //   // user-games-api-routes.js to do the necessary calls to Steam's API

    //   // pass in data
    //   // data passed to handlebars files comes through the html-routes file
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

// ****** PSEUDO CODE HERE:

// What do we need to do in this folder? Let's pseudo code that.

// This file will reference our models. We will need to require them.
// Also, we'll need to require expres & setup a router.

// To pull the data we need to display, we will almost certainly use the following code:
// ****** END PSEUDO CODE

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

const db = require("../models");

//add vanity URL to user model
//use it where needed

module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY;

  function getUserInfo(apiKey, user, cb) {
    const queryVanityUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${user}`;

    axios.get(queryVanityUrl).then(function (res) {
      let userId = res.data.response.steamid;
      const querySteamUserUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`;
      axios.get(querySteamUserUrl).then(function (res) {
        const vanityUrl = res.data.response.players[0].profileurl.split("/")[4];
        if (res.data.response.players.length > 0) {
          let steamUser = {
            personaName: res.data.response.players[0].personaname,
            steamId: res.data.response.players[0].steamid,
            profileUrl: res.data.response.players[0].profileurl,
            avatarUrl: res.data.response.players[0].avatarmedium,
            vanityUrl: vanityUrl
          };
          return cb(steamUser);
        } else {
          console.log("Couldn't find user!");
          res.status(500);
          res.end();
        }
      });
    });
  }

  app.post("/api/steamUsers", function (req, res) {
    db.SteamUser.findOne({
      where: {
        vanityUrl: req.body.user,
      },
    }).then((user) => {
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
    // use sequelize to find the user in our DB
    db.SteamUser.findOne({
      where: {
        vanityUrl: user,
      },
      include: [db.Game],
    })
      .then((user) => {
        user = [{ user: user.dataValues }];
        // check our DB for the user. IF they exist their with their games list,
        // then we display those in the browser with res.render("SteamUser");
        res.render("index", {
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
        vanityUrl: userOne,
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
        vanityUrl: userTwo,
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
      for (var k = 0; k < userOneArray.length; k++) {
        for (var l = 0; l < userTwoArray.length; l++) {
          if (userTwoArray[l] === userOneArray[k]) {
            sharedGamesArray.push({name: userTwoArray[l]});
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

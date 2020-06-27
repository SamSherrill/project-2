const db = require("../models");

//add vanity URL to user model
//use it where needed

module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY;

  app.get("/", function (req, res) {
    res.render("index");
  });

  function getUserInfo(apiKey, user, cb) {
    const queryVanityUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${user}`;
    console.log(`=============${queryVanityUrl}===============`);

    axios
      .get(queryVanityUrl)
      .then(function (res) {
        if (res.data.response.steamid === undefined) {
          return cb(undefined);
        }
        let userId = res.data.response.steamid;
        const querySteamUserUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${userId}`;
        axios
          .get(querySteamUserUrl)
          .then(function (res) {
            const vanityUrl = res.data.response.players[0].profileurl.split(
              "/"
            )[4];
            if (res.data.response.players.length > 0) {
              let steamUser = {
                personaName: res.data.response.players[0].personaname,
                steamId: res.data.response.players[0].steamid,
                profileUrl: res.data.response.players[0].profileurl,
                avatarUrl: res.data.response.players[0].avatarmedium,
                vanityUrl: vanityUrl,
              };
              return cb(steamUser);
            } else {
              console.log("Couldn't find user!");
            }
          })
          .catch(() => {
            console.log("Could not load user information");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  app.post("/api/steamUsers", async function (req, res) {
    const notFoundUsers = [];
    let userNotFound = false;
    await req.body.usersArray.forEach(async (user) => {
      await db.SteamUser.findOne({
        where: {
          vanityUrl: user,
        },
      }).then((dbUser) => {
        if (!dbUser) {
          getUserInfo(apiKey, user, async (newUser) => {
            if (newUser === undefined) {
              notFoundUsers.push(user);
              userNotFound = true;
            }
            await db.SteamUser.create(newUser).then(function (dbPost) {
              createdUsers.push(dbPost);
            });
          });
        } else {
          console.log("user already exists!");
        }
      });
    });
    setTimeout(() => {
      res.json({
        userNotFound: userNotFound,
        notFoundUsers: notFoundUsers,
      });
    }, 1000);
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
      });
  });

  async function getUsers(res, usersArray, cb) {
    let retrievedUserArray = [];
    for (let i = 0; i < usersArray.length; i++) {
      await db.SteamUser.findOne({
        where: {
          vanityUrl: usersArray[i],
        },
        include: [db.Game],
      })
        .then(async (res) => {
          if (res) {
            const userObject = {
              user: res.dataValues,
            };
            retrievedUserArray.push(userObject);
          }
        })
        .catch((er) => {
          console.log(er);
        });
    }
    await cb(retrievedUserArray);
  }

  app.post("/sharedGames", function (req, res) {
    getUsers(res, req.body.usersArray, (usersArray) => {
      let sharedGamesArray = usersArray[0].user.Games.map(
        (game) => game.dataValues.name
      );
      for (var i = 1; i < usersArray.length; i++) {
        let gamesArray = usersArray[i].user.Games.map(
          (game) => game.dataValues.name
        );
        sharedGamesArray = sharedGamesArray.filter((game) =>
          gamesArray.includes(game)
        );
      }
      res.render("partials/shared-games-block", {
        user: usersArray,
        sharedGames: sharedGamesArray,
      });
    });
  });
};

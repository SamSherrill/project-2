var db = require("../models");
module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY;

  //function that creates the row connecting the user to the games they own in the join table(SteamUserGames)
  async function createJoinRow(steamUserId, gameId) {
    db.SteamUserGames.create({
      steamUserId,
      gameId,
    })
      .then(() => console.log("success"))
      //console logs error type if there was any attempt to put in duplicate value
      .catch((err) => {
        console.log(err.original.code);
      });
  }

  //Just helps in getting the id from our database table to be used for later purposes
  async function getSteamUserIdBySteamId(steamId) {
    let id;
    await db.SteamUser.findOne({
      where: {
        steamId: steamId,
      },
    }).then((res) => {
      id = res.id;
    });
    return id;
  }

  app.post("/api/games", (req, res) => {
    db.SteamUser.findOne({
      where: {
        vanityUrl: req.body.user,
      },
    })
      .then((resForSteamId) => {
        const steamID = resForSteamId.steamId;
        const ownedGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamID}&format=json&include_appinfo=true`;

        axios
          .get(ownedGamesUrl)
          .then(async (response) => {
            let singleGame = {};
            //stores the database id for the user who's games are being found. Is used later to create join table rows(what games they own)
            let currentUserSteamId = await getSteamUserIdBySteamId(steamID);
            for (let i = 0; i < response.data.response.games.length; i++) {
              const gameFromDatabase = await db.Game.findOne({
                where: {
                  appId: response.data.response.games[i].appid,
                },
              });
              if (gameFromDatabase === null) {
                singleGame = await db.Game.create({
                  name: response.data.response.games[i].name,
                  appId: response.data.response.games[i].appid,
                });
              } else {
                singleGame = gameFromDatabase;
              }
              //function that creates the row connecting the user to the games they own in the join table(SteamUserGames)
              await createJoinRow(currentUserSteamId, singleGame.id);
            }
            await res.json({
              success: true,
            });
          })
          .catch((err) => {
            console.log(err);
            res.send("error");
          });
      })
      .catch((er) => {
        console.log(er);
        res.send('error')
      });
  });
};

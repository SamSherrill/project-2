//get owned games
//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=76561198071626037&format=json&include_appinfo=true

//get game details
//https://store.steampowered.com/api/appdetails?appids=7670
//"categories" {id: 1, description: "Multi-player"}



//pseudo code from David Saturday morning:
//Make API call to get games owned list: http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F83481CE586D90CD0924F6576AA13DEC&steamid=76561198071626037&format=json&include_appinfo=true
//loop through games
////Check if game is in database
////axios call for more game info: https://store.steampowered.com/api/appdetails?appids=7670
////Check if game is multiplayer
////save (post) info to database
// - need to get user ID #s dynamically

// PSEUDO CODE from Sam Saturday afternoon:
// Need to pull in user ID #s dynamically & use them with the const steamID below
// Then we need to post to our DB every owned game of that user
// and then make sure the many to many relationship is correct between the user & their games

var db = require("../models");
module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY;

  const steamID = "76561198035672130";
  // that steamID is hard coded for sammysticks' Steam ID #. ID numbers are required to hit the API.

  app.get("/api/games", ((req, res) => {
    // getGamesList(apiKey, steamID);
    const ownedGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamID}&format=json&include_appinfo=true`;

    axios.get(ownedGamesUrl).then(async (response) => {
      let singleGame = {};
      //stores the database id for the user who's games are being found. Is used later to create join table rows(what games they own)
      let currentUserSteamId = await getSteamUserIdBySteamId(steamID);
      for (let i = 0; i < response.data.response.games.length; i++) {
        const gameFromDatabase = await db.Game.findOne({
          where: {
            appId: response.data.response.games[i].appid
          }
        });
        if (gameFromDatabase === null) {
          // TODO: Make an API call,
          // wait for the call to complete,
          //  then update the db.Game.create to include that additional data
          singleGame = await db.Game.create({
            name: response.data.response.games[i].name,
            appId: response.data.response.games[i].appid
          });
        } else {
          singleGame = gameFromDatabase;
        }
        //function that creates the row connecting the user to the games they own in the join table(SteamUserGames)
        await createJoinRow(currentUserSteamId, singleGame.id);

      }
      await res.json({
        success: true
      });
    }).catch(err => {
      console.log(err);
    });
  }));

  //function that creates the row connecting the user to the games they own in the join table(SteamUserGames)
  async function createJoinRow(steamUserId, gameId){
    db.SteamUserGames
      .create({
        steamUserId,
        gameId
      })
      .then(() => console.log("success"))
      //console logs error type if there was ant attempt to put in duplicate value
      .catch(err=>console.log(err.original.code));
  }

  //Just helps in getting the id from our database table to be used for later purposes
  async function getSteamUserIdBySteamId(steamId){
      let id;
      await db.SteamUser.findOne({
          where: {
              steamId: steamId
          }
      }).then((res)=> {
          id = res.id;
      })
      return id;
  }

  // old code that Jonathan's code supercedes:
  // function getGamesList(apiKey, steamID) {
  //const ownedGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamID}&format=json&include_appinfo=true`;

  //axios.get(ownedGamesUrl).then((res) => {
  //   for (var i = 0; i < res.data.response.games.length; i++) {
  //     //check if in database
  //     const gameId = res.data.response.games[i].appid;
  //     db.Game.findOne({
  //       where: {
  //         name: res.data.response.games[i].name,
  //       },
  //     }).then((gameRes) => {
  //       if (!gameRes) {
  //         //axios call game info
  //         // console.log("Game ID: ", res.data.response.games[i]);
  //         const gameInfoUrl = `https://store.steampowered.com/api/appdetails?appids=${gameId}`;
  //         axios.get(gameInfoUrl).then(gameInfoRes => {
  //           console.log(gameInfoRes);
  //           //check if multiplayer
  //           //appid.data.categories

  //           // for(var i = 0; i < gameInfoRes.data.length; i++){
  //           //   var appId = gameInforRes.data[i];
  //           //   console.log(appId);
  //           // }
  //           // if(gameInfoRes.data);
  //           const banana = `gameInfoRes.data.${gameId}.data.categories[0]`;
  //           console.log(banana);
  //           //https://store.steampowered.com/api/appdetails?appids=440
  //         });
  //       } else {
  //         console.log("Game exists");
  //       }
  //     });
  //   }
  // });
  //}

};


// game.js model:
// module.exports = function (sequelize, DataTypes) {
//     const Game = sequelize.define("Game", {
//         name: DataTypes.STRING,
//         appId: DataTypes.STRING,
//         website: DataTypes.STRING,
//         headerImage: DataTypes.STRING,
//         windows: DataTypes.BOOLEAN,
//         mac: DataTypes.BOOLEAN,
//         linux: DataTypes.BOOLEAN
//     });

//     Game.associate = function (models) {
//         Game.belongsToMany(models.SteamUser, {
//             through: "SteamUserGames",
//             foreignKey: "gameId",
//         });
//     };

//     return Game;
// };
// // http://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{hash}.jpg

// // "platforms": {
// //     "windows": true,
// //     "mac": false,
// //     "linux": true
// //     },


// steamUserGames.js model:
// module.exports = function (sequelize, DataTypes) {
//     const SteamUserGames = sequelize.define(
//       "SteamUserGames",
//       {
//         steamUserId: DataTypes.INTEGER,
//         gameId: DataTypes.INTEGER,
//       },
//       { timestamps: false }
//     );

//     return SteamUserGames;
//   };
//get owned games
//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=76561198071626037&format=json&include_appinfo=true

//get game details
//https://store.steampowered.com/api/appdetails?appids=7670
//"categories" {id: 1, description: "Multi-player"}

var db = require("../models");
module.exports = function (app) {
    const axios = require("axios");
    const apiKey = process.env.API_KEY;

    const steamID = "76561198035672130";
    // that steamID is hard coded for sammysticks' Steam ID #. ID numbers are required to hit the API.

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

    app.get("/api/games", ((req, res) => {
        // getGamesList(apiKey, steamID);
        const ownedGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamID}&format=json&include_appinfo=true`;

        axios.get(ownedGamesUrl).then(async (response) => {
            console.log(response.data.response.games);
            // res.json(response.data.response.games);
            for (let i = 0; i < response.data.response.games.length; i++) {

                const newGame = await db.Game.create({
                    name: response.data.response.games[i].name,
                    appId: response.data.response.games[i].appid
                });
                await console.log(newGame);
                await console.log("created a game. Mayabe?");
            }
            await console.log("=============");
            await console.log("this should wait until the end");
            await res.json({
                success: true
            });
        }).catch(err => {
            console.log(err);
        });
    }));

};



//pseudo code:
//Make API call to get games owned list: http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F83481CE586D90CD0924F6576AA13DEC&steamid=76561198071626037&format=json&include_appinfo=true
//loop through games
////Check if game is in database
////axios call for more game info: https://store.steampowered.com/api/appdetails?appids=7670
////Check if game is multiplayer
////save (post) info to database
// - need to get user ID #s dynamically



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
//get owned games
//http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F83481CE586D90CD0924F6576AA13DEC&steamid=76561198071626037&format=json&include_appinfo=true

//get game details
//https://store.steampowered.com/api/appdetails?appids=7670
//"categories" {id: 1, description: "Multi-player"}

var db = require("../models");
module.exports = function (app) {
  const axios = require("axios");
  const apiKey = process.env.API_KEY || "58B845E0858DDB3A73B47D71B787198A";

  function getGamesList(){
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=76561198071626037&format=json&include_appinfo=true`;

    axios.get(url).then();
  }
}
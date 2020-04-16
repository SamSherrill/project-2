module.exports = function (sequelize, DataTypes) {
  const Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    appId: DataTypes.STRING,
    website: DataTypes.STRING,
    headerImage: DataTypes.STRING,
    windows: DataTypes.BOOLEAN,
    mac: DataTypes.BOOLEAN,
    linux: DataTypes.BOOLEAN
  });

  Game.associate = function (models) {
    Game.belongsToMany(models.SteamUser, {
      through: "SteamUserGames",
      foreignKey: "gameId",
    });
  };

  return Game;
};
// http://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{hash}.jpg

// "platforms": {
//     "windows": true,
//     "mac": false,
//     "linux": true
//     },
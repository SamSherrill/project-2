module.exports = function (sequelize, DataTypes) {
  const Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    appId: DataTypes.INTEGER,
    website: DataTypes.INTEGER,
    headerImage: DataTypes.INTEGER,
    price: DataTypes.STRING,
    windows: DataTypes.STRING,
    mac: DataTypes.STRING,
    linux: DataTypes.STRING
  });

  Game.associate = function (models) {
    Game.belongsToMany(models.SteamUser, {
      through: "steamUserGames",
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
module.exports = function (sequelize, DataTypes) {
  const SteamUserGames = sequelize.define(
    "SteamUserGames",
    {
      steamUserId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
    },
    { timestamps: false }
  );

  return SteamUserGames;
};
module.exports = function (sequelize, DataTypes) {
  const SteamUser = sequelize.define("SteamUser", {
    personaName: DataTypes.STRING,
    steamId: DataTypes.STRING,
    profileUrl: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    vanityUrl: DataTypes.STRING
  });

  SteamUser.associate = function (models) {
    SteamUser.belongsToMany(models.Game, {
      through: "SteamUserGames",
      foreignKey: "steamUserId",
    });
  };
  return SteamUser;
};

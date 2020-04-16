module.exports = function (sequelize, DataTypes) {
  const SteamUser = sequelize.define("SteamUser", {
    personaName: DataTypes.STRING,
    steamId: DataTypes.STRING,
    profileUrl: DataTypes.STRING,
    avatarUrl: DataTypes.STRING
  });

  SteamUser.associate = function (models) {
    SteamUser.belongsToMany(models.Game, {
      through: "steamUserGames",
      foreignKey: "steamUserId",
    });
  };
  return SteamUser;
};

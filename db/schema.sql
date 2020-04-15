DROP DATABASE IF EXISTS steam_db;
CREATE database steam_db;

USE steam_db;
-- get player URL
-- http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F83481CE586D90CD0924F6576AA13DEC&steamids=76561198071626037


-- owned games URL
-- http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F83481CE586D90CD0924F6576AA13DEC&steamid=76561198071626037&format=json&include_appinfo=true

-- Find user ID number--
-- http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=58B845E0858DDB3A73B47D71B787198A&vanityurl=sammysticks
-- {
--      "response": {
--          "steamid": "76561198114673031",
--          "success": 1
--      }
-- }
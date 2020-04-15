DROP DATABASE IF EXISTS steam_db;
CREATE database steam_db;

USE steam_db;

-- http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=F83481CE586D90CD0924F6576AA13DEC&steamids=76561198071626037
CREATE TABLE steamUser (
	steamid varchar(17) NOT NULL,
    communityvisibilitystate int,
    profilestate int,
    personaname varchar(255),
    profileurl varchar(255),
    avatar varchar(255),
    avatarmedium varchar(255),
    avatarfull varchar(255),
    lastlogoff int,
    personastate boolean,
    primaryclanid varchar(255),
    timecreated int,
    personastateflags boolean
);

INSERT INTO steamUser (steamid,
						communityvisibilitystate,
                        profilestate,
                        personaname,
                        profileurl,
                        avatar,
                        avatarmedium,
                        avatarfull,
                        lastlogoff,
                        personastate,
                        primaryclanid,
                        timecreated,
                        personastateflags)
VALUES ("76561198071626037",
		3,
        1,
        "MrMuscles3000",
        "https://steamcommunity.com/profiles/76561198071626037/",
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/1a/1a86d1821077b42998cdeaa2e7a7d8030d1e32ba.jpg",
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/1a/1a86d1821077b42998cdeaa2e7a7d8030d1e32ba_medium.jpg",
        "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/1a/1a86d1821077b42998cdeaa2e7a7d8030d1e32ba_full.jpg",
        1586886046,
        0,
        "103582791429521408",
        1347747613,
        0);

-- http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=F83481CE586D90CD0924F6576AA13DEC&steamid=76561198071626037&format=json&include_appinfo=true
CREATE TABLE steamGame (
	appid int NOT NULL,
    name varchar(255),
    playtime_forever int,
    img_icon_url varchar(255),
    img_logo_url varchar(255),
    has_community_visible_stats boolean,
    playtime_windows_forever int,
    playtime_mac_forever int,
    playtime_linux_forever int
);

INSERT INTO steamGame (appid,
						name,
                        playtime_forever,
                        img_icon_url,
                        img_logo_url,
                        has_community_visible_stats,
                        playtime_windows_forever,
                        playtime_mac_forever,
                        playtime_linux_forever)
VALUES (7670,
		"BioShock",
        0,
        "9a7c9f640a76e6a32592277dbbc36a0f6da05372",
        "4c2a7f97e6556a95319eb346aed7beff9fe0535c",
        true,
        0,
        0,
        0);

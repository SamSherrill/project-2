-- Insert Steamusers
INSERT INTO steamUsers (
    personaName,
    steamId,
    profileUrl,
    avatarUrl,
    createdAt,
    updatedAt)
VALUES (
    "MrMuscles3000",
    "76561198071626037",
    "https://steamcommunity.com/profiles/76561198071626037/",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/1a/1a86d1821077b42998cdeaa2e7a7d8030d1e32ba_medium.jpg",
    '9999-12-31 23:59:59',
    '9999-12-31 23:59:59'
),(
    "sammysticks",
    "76561198114673031",
    "https://steamcommunity.com/id/sammysticks/",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/b6/b6229ed253738a83041bc864b2748580190c4f91_medium.jpg",
    '9999-12-31 23:59:59',
    '9999-12-31 23:59:59'
),(
    "dabigcheezey",
    "76561198035672130",
    "https://steamcommunity.com/profiles/76561198035672130/",
    "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg",
    '9999-12-31 23:59:59',
    '9999-12-31 23:59:59'
);


-- Insert games
INSERT INTO games (
    name,
    appId,
    website,
    headerImage,
    windows,
    mac,
    linux,
    createdAt,
    updatedAt
)
VALUES (
		"BioShock",
        7670,
        "http://www.BioShockGame.com",
        "https://steamcdn-a.akamaihd.net/steam/apps/7670/header.jpg?t=1568739889",
        true,
        false,
        true,
        '9999-12-31 23:59:59',
        '9999-12-31 23:59:59'
),
(
		"Portal",
        400,
        "http://www.whatistheorangebox.com/",
        "https://steamcdn-a.akamaihd.net/steam/apps/400/header.jpg?t=1571756885",
        true,
        true,
        true,
        '9999-12-31 23:59:59',
        '9999-12-31 23:59:59'
),
(
		"The Elder Scrolls V: Skyrim",
        72850,
        "http://elderscrolls.com/",
        "https://steamcdn-a.akamaihd.net/steam/apps/72850/header.jpg?t=1567726185",
        true,
        false,
        true,
        '9999-12-31 23:59:59',
        '9999-12-31 23:59:59'
);


-- Junstion data
INSERT INTO steamusergames (
	gameId,
	steamUserId
) 
VALUES (1,1),
	(1,2),
	(2,1),
	(3,2);
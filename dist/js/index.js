$(document).ready(function () {
  console.log("ready!");
  let additionalUsers = 1;
  const usersToSearch = ["user1"];

  const addUser = () => {
    additionalUsers++;
    const newUserElementId = `user${additionalUsers}`;
    usersToSearch.push(newUserElementId);
    $("#additional-user-input").append(
      `<div class="field"><div class="control"><input class="input is-primary input-left" id="${newUserElementId}" type="text" placeholder="Another Steam Vanity URL"></div></div>`
    );
  };
  $("#add-user").on("click", addUser);

  $(".username-submit").on("click", async function (event) {
    event.preventDefault();
    $("#errors").empty();
    $("#shared-games-container").empty().append("<div class='loader'></div>");
    const usersArray = [];
    usersToSearch.forEach((user) => {
      if ($(`#${user}`).val().length > 0) {
        usersArray.push($(`#${user}`).val().trim());
      }
    });
    if (additionalUsers > 1) {
      //adds users to db
      await $.post("/api/steamUsers", {
        usersArray,
      }).then((res) => {
        console.log(res);
        if (res.userNotFound) {
          $("#errors").append(
            `<h1 class="error-type">Vanity URLs invalid for users: ${res.notFoundUsers}</h1><p class="error-message">Make sure to use the user's vanity URL: <a href="https://steamcommunity.com/discussions/forum/1/537402115094224389/">How to find Steam vanity URL</a></p>`
          );
        }
      });
      //adds users games to db
      await $.post("/api/games", {
        usersArray,
      });
      //compares games
      await $.post("/sharedGames", {
        usersArray,
      }).done((res) => {
        $("#shared-games-container").empty().append(res);
      });
    } else {
      $.post("/api/steamUsers", {
        usersArray,
      })
        .done((res) => {
          if (res.userNotFound) {
            $("#shared-games-container").empty();
            return $("#errors").append(
              `<h1 class="error-type">Vanity URLs invalid or privacy settings preventing access for users: ${res.notFoundUsers}</h1><p class="error-message">Make sure privacy settings are public for the Steam profile. Make sure to use the user's vanity URL: <a href="https://steamcommunity.com/discussions/forum/1/537402115094224389/">How to find Steam vanity URL</a> </p>`
            );
          }
          $.post("/api/games", {
            usersArray,
          })
            .done(() => {
              $.get("/SteamUser/" + usersArray[0], {
                userOne: usersArray[0],
              }).done(
                () => (window.location.href = "/SteamUser/" + usersArray[0])
              );
            })
            .catch((er) => console.log(er));
        })
        .catch((er) => console.log(er));
    }
  });
});

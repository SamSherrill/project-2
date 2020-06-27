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
    $("#shared-games-container").empty().append('<div class="loader"></div>');
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
      }).then(res=>{
        console.log(res);
        if(res.userNotFound){
          $("#errors").append(`<h1 class="error-type">Vanity URLs invalid for users: ${res.notFoundUsers}</h1><p class="error-message">Vanity URL is invalid.</p>`)
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
      // $.post("/api/steamUsers", {
      //   user: userOne,
      // })
      //   .done(
      //     $.get("/SteamUser/" + userOne, {
      //       userOne: userOne,
      //     })
      //       .done(() => {
      //         $.post("/api/games", {
      //           user: userOne,
      //         }).done(() => (window.location.href = "/SteamUser/" + userOne));
      //       })
      //       .catch((er) => console.log(er))
      //   )
      //   .catch((er) => console.log(er));
    }
  });
});

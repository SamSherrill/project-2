$(document).ready(function () {
  console.log("ready!");

  $(".username-submit").on("click", function (event) {
    event.preventDefault();
    if ($("#user-one").val().trim().length > 0) {
      var userOne = $("#user-one").val().trim();
    }
    if ($("#user-two").val().trim().length > 0) {
      var userTwo = $("#user-two").val().trim();
    }

    if (userOne && userTwo) {
      $.post("/api/steamUsers", {
        user: userOne,
        user: userTwo,
      })
        .done(
          $.get("/SteamUsers/" + userOne + "/" + userTwo, {
            userOne: userOne,
            userTwo: userTwo,
          })
            .done(() => {
              $.post("/api/games", {
                user: userOne,
              })
                .done(() => {
                  $.post("/api/games", {
                    user: userTwo,
                  }).done(
                    () =>
                      (window.location.href =
                        "/SteamUsers/" + userOne + "/" + userTwo)
                  );
                })
                .catch((er) => console.log(er));
            })
            .catch((er) => {
              console.log(er);
            })
        )
        .catch((er) => console.log(er));
    } else if (userOne) {
      $.post("/api/steamUsers", {
        user: userOne,
      })
        .done(
          $.get("/SteamUser/" + userOne, {
            userOne: userOne,
          })
            .done(() => {
              $.post("/api/games", {
                user: userOne,
              }).done(() => (window.location.href = "/SteamUser/" + userOne));
            })
            .catch((er) => console.log(er))
        )
        .catch((er) => console.log(er));
    }
  });
});

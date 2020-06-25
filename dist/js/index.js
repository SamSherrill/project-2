$(document).ready(function () {
  console.log("ready!");
  let additionalUsers = 1;
  const usersToSearch = ['user1'];

  const addUser = () => {
    additionalUsers ++;
    const newUserElementId = `user${additionalUsers}`;
    usersToSearch.push(newUserElementId);
    $("#primary-user-input").after(`<div class="field"><div class="control"><input class="input is-primary input-left" id="${newUserElementId}" type="text" placeholder="Another Steam Vanity URL"></div></div>`)
  }
  $('#add-user').on("click", addUser);

  $(".username-submit").on("click", function (event) {
    event.preventDefault();
    const usersArray = [];
    usersToSearch.forEach(user=>{
      if ($(`#${user}`).val().length > 0) {
        usersArray.push($(`#${user}`).val().trim());
      }
    })
    if (additionalUsers > 1) {
      //adds users to db
      $.post("/api/steamUsers", {
        usersArray
      })
        .then(()=>{
          $.post("/sharedGames", {
            usersArray
          }).done((res)=> $( "html" ).html( res ));
        }
            // .done(() => {
            //   $.post("/api/games", {
            //     user: userOne,
            //   })
            //     .done(() => {
            //       $.post("/api/games", {
            //         user: userTwo,
            //       }).done(
            //         () =>
            //           (window.location.href =
            //             "/SteamUsers/" + userOne + "/" + userTwo)
            //       );
            //     })
            //     .catch((er) => console.log(er));
            // })
            // .catch((er) => {
            //   console.log(er);
            // })
        )
        // .catch((er) => console.log(er));
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

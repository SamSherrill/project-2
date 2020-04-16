$(document).ready(function () {
    console.log("ready!");
    $(".username-submit").on("click", function (event) {
        event.preventDefault();
        var userOne = $("#user-one").val().trim();
        // var userTwo = $("#user-two").val().trim();
        console.log(userOne);
        // console.log(userTwo);

        // We need to save the usernames
        // Some other file is going to have to 1st check our DB for that user
        // 

        // Step 2 or beyond:
        // Then this other file is oging to need to go to the steam API
        // and get the user's ID #
        // then we'll need to use the user ID # to get the user's game's list
        // Steam API call this GetOwnedGames ---
    });
});





// cat.js example, which was the index.js for that activity:

// // Make sure we wait to attach our handlers until the DOM is fully loaded.
// $(function() {
//     $(".change-sleep").on("click", function(event) {
//       var id = $(this).data("id");
//       var newSleep = $(this).data("newsleep");

//       var newSleepState = {
//         sleepy: newSleep
//       };

//       // Send the PUT request.
//       $.ajax("/api/cats/" + id, {
//         type: "PUT",
//         data: newSleepState
//       }).then(
//         function() {
//           console.log("changed sleep to", newSleep);
//           // Reload the page to get the updated list
//           location.reload();
//         }
//       );
//     });

//     $(".create-form").on("submit", function(event) {
//       // Make sure to preventDefault on a submit event.
//       event.preventDefault();

//       var newCat = {
//         name: $("#ca").val().trim(),
//         sleepy: $("[name=sleepy]:checked").val().trim()
//       };

//       // Send the POST request.
//       $.ajax("/api/cats", {
//         type: "POST",
//         data: newCat
//       }).then(
//         function() {
//           console.log("created new cat");
//           // Reload the page to get the updated list
//           location.reload();
//         }
//       );
//     });

//     $(".delete-cat").on("click", function(event) {
//       var id = $(this).data("id");

//       // Send the DELETE request.
//       $.ajax("/api/cats/" + id, {
//         type: "DELETE"
//       }).then(
//         function() {
//           console.log("deleted cat", id);
//           // Reload the page to get the updated list
//           location.reload();
//         }
//       );
//     });
//   });
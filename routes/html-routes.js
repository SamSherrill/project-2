module.exports = function(app) {
  app.get("/", function (req, res) {
    res.render("index");
  });
};

// What do we use this file for? Is it only to render the index.handlerbars? think so
// Then let's consider this file done for now.
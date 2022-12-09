const kios = require("../controller/kios");
module.exports = function (app) {
  app.post("/createkios", kios.createKios);
  app.get("/getkios/:id", kios.getKios);
};

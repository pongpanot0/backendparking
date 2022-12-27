const estamp = require("../controller/estamp");
module.exports = function (app) {
  app.get("/estamp/get/:id", estamp.getEstamp);
  app.post("/estamp/created", estamp.creatEstamp);
};

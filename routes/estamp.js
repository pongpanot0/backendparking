const estamp = require("../controller/estamp");
module.exports = function (app) {
  app.get("/estamp/get/:id", estamp.getEstamp);
  app.post("/estamp/created", estamp.creatEstamp);
  app.get("/getEstampid/:id", estamp.getEstampid);
  app.post("/editEstamp/:id", estamp.editEstamp);
  app.post("/deleteestamp", estamp.delteEstamp);
  app.post("/useEstamp/:parking_uuids", estamp.useEstamp);
};

const chanel = require("../controller/chanel");

module.exports = function (app) {
  app.post("/chanel", chanel.createChanel);
  app.get("/getMasterChanel", chanel.getMasterChanel);
  app.get("/getpaymentsways/:id", chanel.getChanelPayments);
};

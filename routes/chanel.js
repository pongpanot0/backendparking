const chanel = require("../controller/chanel");

module.exports = function (app) {
  app.post("/chanel", chanel.createChanel);
  app.post("/editchanel", chanel.editChanel);
  app.get("/getMasterChanel", chanel.getMasterChanel);
  app.get("/getpaymentsways/:id", chanel.getChanelPayments);
  app.get("/getpaymentswaysid/:id", chanel.getChanelPaymentsid);
};

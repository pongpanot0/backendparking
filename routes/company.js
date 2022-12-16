const company = require("../controller/company");
const fs = require('fs')
module.exports = function (app) {
  app.get("/company/get/:id", company.get);
  app.post("/company/update/:id", company.update);
  app.post("/company/updatePic/:id", company.updatePic);
  app.get('/display/:id',company.display)
  
  }

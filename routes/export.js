const exportlogs = require("../controller/export");
const fs = require('fs')
module.exports = function (app) {
  app.get("/exportparking/:id", exportlogs.exportparking);
  app.post("/exportParkExcel/:id", exportlogs.exportParkExcel);
  
  }

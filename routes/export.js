const exportlogs = require("../controller/export");
const fs = require('fs')
module.exports = function (app) {
  app.get("/exportparking/:id", exportlogs.exportparking);
  app.post("/exportParkExcel/:id", exportlogs.exportParkExcel);
  app.post("/exportSelectDateParkExcel/:id", exportlogs.exportSelectDateParkExcel);
  app.post("/exportSelectTimeParkExcel/:id", exportlogs.exportSelectTimeParkExcel);
  app.get("/testpdf", exportlogs.testpdf);
  app.post("/ExportParksumcalculator/:id", exportlogs.ExportParksumcalculator);
  app.post("/ExportParksumcalculatorSelectMouth/:id", exportlogs.ExportParksumcalculatorSelectMouth);
}

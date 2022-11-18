const company = require("../controller/company");
const multer = require('multer');
const upload = multer();
module.exports = function (app) {
  app.get("/company/get/:id", company.get);
  app.post("/company/update/:id", company.update);
  app.get('/g',company.uploads)
};

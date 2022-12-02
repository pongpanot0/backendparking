const parking = require("../controller/parking");
module.exports = function (app) {
  app.get("/parkcalculate/:id/:parking_logs_id", parking.parkcalculate2);
  app.post("/createParkLog", parking.createParkLog);
  app.get("/getParklog", parking.getParklog);
  
};


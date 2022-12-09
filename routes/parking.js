const parking = require("../controller/parking");
module.exports = function (app) {
  app.get("/parkcalculate/:id/:parking_logs_id", parking.parkcalculate2);
  app.get("/parkcalculate2/:id/:parking_logs_id", parking.parkcalculateTest);
  app.post("/createParkLog", parking.createParkLog);
  app.get("/getParklog", parking.getParklog);
  app.get("/Parksumcalculator/:id", parking.Parksumcalculator);
  app.get("/Parkcountlogs/:id", parking.Parkcountlogs);
  app.post("/ParkLike/:id", parking.ParkLike);
  app.get("/ParkIn/:id", parking.ParkIn);
};

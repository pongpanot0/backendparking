const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.insert = async (req, res) => {
  let setting_hour = req.body.setting_hour;
  let company_id = req.body.company_id;
  const insert = `insert into setting (setting_hour,company_id) value ('${setting_hour}','${company_id}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
};

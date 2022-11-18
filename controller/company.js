const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.get = async (req, res) => {
  const id = req.params.id;
  const getdata = `select * from company where company_id = ${id}`;
  db.query(getdata, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result);
      res.send({
        status: 200,
        data: result,
      });
    }
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const company_name = req.body.company_name;
  const company_prayerid = req.body.company_prayerid;
  const getdata = `update company set company_name='${company_name}',company_prayerid='${company_prayerid}'  where company_id = ${id}`;
  db.query(getdata, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result);
      res.send({
        status: 200,
        data: result,
      });
    }
  });
};
exports.uploads = async (req, res) => {
  if (req.file) {
    res.json(req.file);
  } else throw "error";
};

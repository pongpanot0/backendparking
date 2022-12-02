const db = require("../db/db");
const fs = require("fs");
exports.get = async (req, res) => {
  const id = req.params.id;
  const getdata = `select * from company where company_id = ${id}`;
  db.query(getdata, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send({
        status: 200,
        data: result,
      });
    }
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const company_pic = req.body.company_pic;
  const company_name = req.body.company_name;

  const getdata = `update company set company_name='${company_name}',company_pic='${company_pic}'  where company_id = ${id}`;
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
exports.display = async (req, res) => {
  const id = req.params.id;
  fs.readFile(`./uploads/${id}`, function (err, data) {
    if (err) throw err; // Fail if the file can't be read.
    else {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(data); // Send the file data to the browser.
    }
  });
};

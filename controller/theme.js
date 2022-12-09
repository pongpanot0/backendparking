
const conn = require("../db/mongodb");
const moment = require("moment");
exports.createTheme = async (req, res) => {
  const event = {
    paimaryButton: req.body.paimaryButton,
    errorButton: req.body.errorButton,
    company_id: parseInt(req.body.company_id),
    inactive: 0,
    created_at: moment(new Date()).format("yyyy-MM-DD"),
    created_by: req.body.created_by,
    updated_at: moment(new Date()).format("yyyy-MM-DD"),
    updated_by: req.body.updated_by,
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("theme")
    .insertOne(event, async (err, result) => {
      if (err) {
        res.send({
          status: 400,
          data: err,
        });
      }
      if (result) {
        res.send({
          status: 200,
          data: result,
        });
      }
    });
};

exports.getTheme = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("theme")
    .find({ company_id: parseInt(id) })
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};

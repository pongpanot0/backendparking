const conn = require("../db/mongodb");
const moment = require("moment");
var shortid = require("shortid");

exports.creatEstamp = async (req, res) => {
  const event = {
    estamp_total: parseInt(req.body.estamp_total),
    estamp_uuid: shortid.generate(),
    expireAt: new Date(req.body.expire_date),
    expireDate: moment(req.body.expire_date).format("DD-MM-yyyy"),
    company_id: req.body.company_id,
    crated_at: moment(new Date()).format("yyyy-MM-DD"),
    crated_by: req.body.crated_by,
  };
  data = [];
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("estamp")
    .insertOne(event)
    .then((row) => {
      data.push(row);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(async (turn) => {
      await conn.connect();
      await conn
        .db("qrpaymnet")
        .collection("estamp_logs")
        .insertOne(event)
        .then((row) => {
          res.send({ data: row, success: data });
        });
    });
};
exports.getEstamp = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("estamp")
    .find({ company_id: id })
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

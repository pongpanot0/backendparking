const db = require("../db/db");
const conn = require("../db/mongodb");
exports.createChanel = async (req, res) => {
  const event = {
    chanel_payments_detail: req.body.chanel_payments_detail,
    chanel_payments_name: req.body.chanel_payments_name,
    chanel_payments_tax: req.body.chanel_payments_tax,
    chanel_id: req.body.chanel_id,
    company_id: parseInt(req.body.company_id),
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel_payments")
    .insertOne(event, async (err, result) => {
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
exports.getMasterChanel = async (req, res) => {
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel")
    .find()
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
exports.getChanelPayments = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel_payments")
    .aggregate([
      { $match: { company_id: parseInt(id) } },
      {
        $lookup: {
          from: "chanel",
          localField: "chanel_id",
          foreignField: "chanel_id",
          as: "chanel",
        },
      },
      { $unwind: "$chanel" },
    ])
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

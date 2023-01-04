const { ObjectId } = require("mongodb");
const conn = require("../db/mongodb");
exports.createChanel = async (req, res) => {
  const event = {
    chanel_payments_detail: req.body.chanel_payments_detail,
    chanel_payments_name: req.body.chanel_payments_name,
    chanel_payments_tax: req.body.chanel_payments_tax,
    chanel_id: req.body.chanel_id,
    company_id: req.body.company_id,
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
exports.editChanel = async (req, res) => {
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel_payments")
    .updateOne(
      { _id: ObjectId(req.body.id) },
      {
        $set: {
          chanel_payments_detail: req.body.chanel_payments_detail,
          chanel_payments_name: req.body.chanel_payments_name,
          chanel_payments_tax: req.body.chanel_payments_tax,
          chanel_id: req.body.chanel_id,
        },
      }
    )
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
  console.log(id);
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel_payments")
    .aggregate([
      { $match: { company_id: id } },
      {
        $lookup: {
          from: "chanel",
          let: { searchId: { $toObjectId: "$chanel_id" } },
          //search query with our [searchId] value
          pipeline: [
            //searching [searchId] value equals your field [_id]
            { $match: { $expr: { $eq: ["$_id", "$$searchId"] } } },

            //projecting only fields you reaaly need, otherwise you will store all - huge data loads
          ],
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

exports.getChanelPaymentsid = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("chanel_payments")
    .aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: "chanel",

          let: { searchId: { $toObjectId: "$chanel_id" } },
          //search query with our [searchId] value
          pipeline: [
            //searching [searchId] value equals your field [_id]
            { $match: { $expr: [{ $eq: ["$_id", "$$searchId"] }] } },
            //projecting only fields you reaaly need, otherwise you will store all - huge data loads
          ],

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

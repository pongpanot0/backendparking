const conn = require("../db/mongodb");
const moment = require("moment");
const { ObjectId } = require("mongodb");

exports.createShop = async (req, res) => {
  const event = {
    shopname: req.body.shopname,
    shopdetail: req.body.shopdetail,
    company_id: req.body.company_id,
    created_by: req.body.user_id,
    created_at: moment(new Date()).format("DD-MM-yyyy"),
    updated_by: req.body.user_id,
    updated_at: moment(new Date()).format("DD-MM-yyyy"),
    inactive: 0,
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shop")
    .insertOne(event, async (err, result) => {
      if (err) {
        throw err;
      }
      if (result) {
        res.send({
          status: 200,
          data: result,
        });
      }
    });
};
exports.getShop = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shop")
    .find({ company_id: id, inactive: 0 })
    .toArray()
    .then((row) => {
      res.send({
        status: 200,
        data: row,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getShopDetail = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shop")
    .find({ _id: ObjectId(id) })
    .toArray()
    .then((row) => {
      res.send({
        status: 200,
        data: row,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.deleteShop = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shop")
    .updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          inactive: 1,
        },
      }
    )
    .then((row) => {
      res.send({
        status: 200,
        data: row,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.Editshop = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  const log = await conn
    .db("qrpaymnet")
    .collection("shop")
    .updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          shopname: req.body.shopname,
          shopdetail: req.body.shopdetail,
          updated_by: req.body.user_id,
          updated_at: moment(new Date()).format("DD-MM-yyyy"),
        },
      }
    )
    .then((row) => {
      res.send({ status: 200, data: row });
    })
    .catch((err) => {
      console.log(err);
    });
};

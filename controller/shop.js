const conn = require("../db/mongodb");
const moment = require("moment");
const { ObjectId, ObjectID } = require("mongodb");

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
exports.getShopnull = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shop")
    .find({ company_id: id, inactive: 0, shopgroup: null })
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

exports.shopgroup = async (req, res) => {
  console.log(req.body);
  const event = {
    shopgroupname: req.body.shopgroupname,
    estampuuid: {
      id: req.body.targetKeys,
    },
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
    .collection("shopgroup")
    .insertOne(event, async (err, result) => {
      if (err) {
        throw err;
      }
      if (result) {
        const newObject = Object.assign({}, req.body.targetKeys);
        const objectArray = Object.entries(newObject);
        objectArray.forEach(async ([key, value]) => {
          const log = await conn
            .db("qrpaymnet")
            .collection("shop")
            .updateMany(
              { _id: ObjectId(value) },
              {
                $set: {
                  shopgroup: result.insertedId,
                },
              }
            )
            .then((rec) => {
              console.log(rec);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        res.send({
          status: 200,
          data: result,
        });
        return;
      }
    });
};
exports.getshopgroup = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shopgroup")
    .aggregate([
      { $match: { _id: ObjectID(id) } },
      {
        $lookup: {
          from: "estamp",
          localField: "estampuuid._id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $addFields: {
          productDetails: {
            $map: {
              input: "$productDetails",
              in: {
                _id: "$$this._id",
                name: "$$this.shopgroupname",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          "estampuuid": {
            $map: {
              input: "$estampuuid",
              as: "prod",
              in: {
                $mergeObjects: [
                  "$$prod",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$productDetails",
                          cond: { $eq: ["$$this._id", "$$prod._id"] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ])
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
exports.getshopgroupid = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("shopgroup")
    .aggregate([{ $match: { _id: ObjectID(id) } }])
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

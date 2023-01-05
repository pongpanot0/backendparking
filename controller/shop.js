const conn = require("../db/mongodb");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { ObjectId, ObjectID } = require("mongodb");
var shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
async function insertAuth(req, res) {
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("users")
    .find({ user_name: req.user.username })
    .count()
    .then(async (result) => {
      console.log(result);
      if (result > 0) {
        res.send({
          data: 400,
          result: "มีUsername อยุ่แล้ว",
        });
      }
      if (result <= 0) {
        bcrypt.hash(req.user.password, 10, async (err, hash) => {
          if (err) {
            console.log(err);
          }
          if (hash) {
            const event = {
              user_name: req.user.username,
              password: req.user.password,
              created_by: req.data.user_id,
              created_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
              company_id: req.data.company_id,
              user_password: hash,
              shopname: req.data.shopname,
              shopid: req.id,
            };

            await conn
              .db("qrpaymnet")
              .collection("users")
              .insertOne(event, async (err, result) => {
                if (err) {
                  console.log(err);
                }
                if (result) {
                  return {
                    status: 200,
                    data: result,
                  };
                }
              });
          }
        });
      }
    });
}
exports.createShop = async (req, res) => {
  const username = shortid.generate();
  const password = shortid.generate();
  const event = {
    username: username,
    password: password,
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
          resc: insertAuth({
            data: req.body,
            id: result.insertedId,
            user: { username, password },
          }),
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
  const event = {
    shopgroupname: req.body.shopgroupname,
    estampuuid: req.body.estampuuid,
    company_id: req.body.company_id,
    created_by: req.body.user_id,
    created_at: moment(new Date()).format("DD-MM-yyyy"),
    updated_by: req.body.user_id,
    updated_at: moment(new Date()).format("DD-MM-yyyy"),
    inactive: 0,
  };
  console.log(req.body);
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
              objectArray.forEach(async ([key, value]) => {
                const log = await conn
                  .db("qrpaymnet")
                  .collection("users")
                  .updateMany(
                    { shopid: ObjectId(value) },
                    {
                      $set: {
                        shop_group_id: result.insertedId,
                      },
                    }
                  )
                  .then((rec) => {
                    return;
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
        res.send({
          status: 200,
          data: result,
        });
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
      { $match: { company_id: id } },
      {
        $lookup: {
          from: "shop",
          localField: "_id",
          foreignField: "shopgroup",
          as: "shop",
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
    .find({ _id: ObjectID(id) })
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
exports.getshopgroupidJoint = async (req, res) => {
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
          estampuuid: {
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

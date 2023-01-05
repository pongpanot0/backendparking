const conn = require("../db/mongodb");
const moment = require("moment");
var shortid = require("shortid");
const { ObjectId, ObjectID } = require("mongodb");
exports.editEstamp = async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  data = [];
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("estamp")
    .updateOne(
      { _id: ObjectId(req.body.estamp_id) },
      {
        $set: {
          estamp_name: req.body.estamp_name,
          estamp_total: parseInt(req.body.estamp_total),
          expireAt: new Date(req.body.expire_date),
          expireDate: moment(req.body.expire_date).format("DD-MM-yyyy"),
        },
      }
    )
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
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              estamp_total: parseInt(req.body.estamp_total),
              expireAt: new Date(req.body.expire_date),
              expireDate: moment(req.body.expire_date).format("DD-MM-yyyy"),
              estamp_id: req.body.estamp_id,
              estamp_name: req.body.estamp_name,
            },
          }
        )
        .then((row) => {
          res.send({ data: row, success: data });
        });
    });
};
exports.creatEstamp = async (req, res) => {
  const event = {
    estamp_name: req.body.estamp_name,
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
      const event2 = {
        estamp_total: parseInt(req.body.estamp_total),
        estamp_uuid: shortid.generate(),
        expireAt: new Date(req.body.expire_date),
        expireDate: moment(req.body.expire_date).format("DD-MM-yyyy"),
        company_id: req.body.company_id,
        crated_at: moment(new Date()).format("yyyy-MM-DD"),
        crated_by: req.body.crated_by,
        estamp_id: data[0].insertedId,
        estamp_name: req.body.estamp_name,
        etamp_active: 1,
      };
      await conn.connect();
      await conn
        .db("qrpaymnet")
        .collection("estamp_logs")
        .insertOne(event2)
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
    .collection("estamp_logs")
    .find({ company_id: id, etamp_active: 1 })
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

exports.getEstampid = async (req, res) => {
  const id = req.params.id;

  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("estamp_logs")
    .updateMany(
      { _id: ObjectId(value) },
      {
        $set: {
          shopgroup: result.insertedId,
        },
      }
    )
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
exports.delteEstamp = async (req, res) => {
  const newObject = Object.assign({}, req.body.id);
  const objectArray = Object.entries(newObject);
  let data = [];
  objectArray.forEach(async ([key, value]) => {
    await conn.connect();
    await conn
      .db("qrpaymnet")
      .collection("estamp_logs")
      .updateMany(
        { _id: ObjectId(value) },
        {
          $set: {
            etamp_active: 0,
          },
        }
      )
      .then((rec) => {
        console.log(rec);
        data.push["200"];
      })
      .catch((err) => {
        console.log(err);
      });
  });
  res.send(data);
};
exports.useEstamp = async (req, res) => {
  const parking_uuids = req.body.parking_uuids;
  const estamp_id = req.body.estamp_id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({ parking_uuids: parking_uuids })
    .toArray()
    .then(async (rec) => {
      const total = rec[0].totalSum;
      await conn.connect();
      await conn
        .db("qrpaymnet")
        .collection("estamp")
        .find({ _id: ObjectID(estamp_id) })
        .toArray()
        .then(async (result) => {
          const estamptotal = result[0].estamp_total;
          const totalsum = total - estamptotal;
          await conn.connect();
          await conn
            .db("qrpaymnet")
            .collection("parkingLogs")
            .updateOne(
              { parking_uuids: parking_uuids },
              {
                $set: {
                  totalSum: totalsum,
                },
              }
            )
            .then((row) => {
              res.send({ data: row });
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

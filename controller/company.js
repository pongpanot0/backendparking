const fs = require("fs");
const { ObjectId } = require("mongodb");
const conn = require("../db/mongodb");
exports.get = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const log = await conn
    .db("qrpaymnet")
    .collection("company")
    .find({ _id: ObjectId(id)  })
    .toArray()
    .then(async (result) => {
      console.log(result);
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const company_name = req.body.company_name;
  const company_lots = req.body.company_lots;
  const timeReamain = parseInt(req.body.timeReamain);
  await conn.connect();
  const log = await conn
    .db("qrpaymnet")
    .collection("company")
    .updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          company_name: company_name,
          company_lots:  parseInt(company_lots),
          timeReamain: timeReamain,
        },
      }
    )
    .then(async (result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.updatePic = async (req, res) => {
  const id = req.params.id;
  const company_pic = req.body.company_pic;

  await conn.connect();
  const log = await conn
    .db("qrpaymnet")
    .collection("company")
    .updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          company_pic: company_pic,
        },
      }
    )
    .then(async (result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
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

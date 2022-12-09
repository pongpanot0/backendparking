
const conn = require("../db/mongodb");
exports.createcamera = async (req, res) => {
  const event = {
    camera_ip: req.body.camera_ip,
    company_id: parseInt(req.body.company_id),
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("camerasetting")
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
exports.getcamera = async (req, res) => {
  const id = req.params.id
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("camerasetting")
    .find({ company_id: parseInt(id) })
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
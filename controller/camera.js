
const conn = require("../db/mongodb");
const { v4: uuidv4 } = require("uuid");
exports.createcamera = async (req, res) => {
  const event = {
    camera_ip: req.body.camera_ip,
    company_id: req.body.company_id,
    wiegandID:req.body.wiegandID,
    in_out_type:req.body.in_out_type,
    doornum:req.body.doornum,
    camera_name:req.body.camera_name,
    camera_port:req.body.camera_port,
    camera_uuid:uuidv4()
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
    .find({ company_id: id })
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

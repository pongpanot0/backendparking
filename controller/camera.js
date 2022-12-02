const db = require("../db/db");

exports.createcamera = async (req, res) => {
  const camera_ip = req.body.camera_ip;
  const company_id = req.body.company_id;
  const insert = `insert into camera (camera_ip,company_id) value ('${camera_ip}','${company_id}')`;
  await db
    .promise()
    .query(insert)
    .then((row) => {
      console.log(row);
    })
    .catch((err) => {
      console.log(err);
    });
};

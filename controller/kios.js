const conn = require("../db/mongodb");
exports.createKios = async (req, res) => {
  const event = {
    kios_macaddress: req.body.kios_macaddress,
    company_id: parseInt(req.body.company_id),
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("kiossetting")
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
exports.getKios = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("kiossetting")
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

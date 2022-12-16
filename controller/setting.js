const db = require("../db/db");
const conn = require("../db/mongodb");
async function insertsettingpayment(req, res) {
  const event = {
    HFrom: req.payment_hourfist,
    MFrom: req.payment_minfirst,
    Hto: req.payment_hour,
    Mto: req.payment_min,
    ValueCharge: req.payment_free,
    IsForwordRate: req.payment_forward,
    company_id: req.company_id,
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("setting_payment")
    .insertOne(event, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        return {
          payment: result,
        };
      }
    });
}
exports.insert = async (req, res) => {
  const totalminfirst =
    parseInt(req.body.payment_minfirst) +
    parseInt(req.body.payment_hourfist) * 60;

  const totalmin =
    parseInt(req.body.payment_min) + parseInt(req.body.payment_hour) * 60;

  let payment_min = totalmin - totalminfirst;
  let company_id = req.body.company_id;
  let payment_free = req.body.payment_free;
  free = [];
  if (payment_free == 0) {
    free.push(1);
  } else {
    free.push(0);
  }

  payment_forward = [];
  if (req.body.payment_forward == true) {
    payment_forward.push(1);
  }
  if (req.body.payment_forward !== true) {
    payment_forward.push(0);
  }
  const event = {
    free: free[0],
    payment_min: payment_min,
    company_id: company_id,
    payment_free: payment_free,
    payment_forward: payment_forward[0],
  };
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("payment")
    .insertOne(event, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.send({
          status: 200,
          data: insertsettingpayment(req.body),
          result: result,
        });
      }
    });
};

exports.get = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("setting_payment")
    .find({ company_id: id})
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


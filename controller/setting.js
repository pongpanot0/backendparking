const { ObjectId } = require("mongodb");
const conn = require("../db/mongodb");
async function insertsettingpayment(req, res) {
  const event = {
    HFrom: req.data.payment_hourfist,
    MFrom: req.data.payment_minfirst,
    Hto: req.data.payment_hour,
    Mto: req.data.payment_min,
    ValueCharge: req.data.payment_free,
    IsForwordRate: req.data.payment_forward,
    company_id: req.data.company_id,
    payment_id : req.id.insertedId
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
async function editpayment(req, res) {
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("setting_payment")
    .updateOne(
      { _id: ObjectId(req.id) },
      {
        $set: {
          HFrom: req.payment_hourfist,
          MFrom: req.payment_minfirst,
          Hto: req.payment_hour,
          Mto: req.payment_min,
          ValueCharge: req.payment_free,
          IsForwordRate: req.payment_forward,
        },
      }
    )
    .then((result) => {
      return {
        payment: result,
      };
    })
    .catch((err) => {
      console.log(err);
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
          data: insertsettingpayment({ data: req.body, id:result }),
          result: result,
        });
      }
    });
};
exports.editdata = async (req, res) => {
  const id = req.body.id;
  const totalminfirst =
    parseInt(req.body.payment_minfirst) +
    parseInt(req.body.payment_hourfist) * 60;

  const totalmin =
    parseInt(req.body.payment_min) + parseInt(req.body.payment_hour) * 60;

  let payment_min = totalmin - totalminfirst;
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

  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("payment")
    .updateOne(
      { _id: ObjectId(req.body.payment_id) },
      {
        $set: {
          free: free[0],
          payment_min: payment_min,
          payment_free: payment_free,
          payment_forward: payment_forward[0],
        },
      }
    )
    .then((result) => {
      res.send({
        status: 200,
        data: editpayment(req.body),
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.get = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("setting_payment")
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

exports.getId = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("setting_payment")
    .find({ _id: ObjectId(id) })
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

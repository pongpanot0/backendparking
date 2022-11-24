const db = require("../db/db");
function insertsettingpayment(req, res) {
  const HFrom = req.payment_hourfist;
  const MFrom = req.payment_minfirst;
  const Hto = req.payment_hour;
  const Mto = req.payment_min;
  const ValueCharge = req.payment_free;
  const IsForwordRate = req.payment_forward;
  const company_id = req.company_id;

  const insert = `insert into setting_payment (HFrom,MFrom,Hto,Mto,ValueCharge,IsForwordRate,company_id) value ('${HFrom}','${MFrom}','${Hto}','${Mto}','${ValueCharge}','${IsForwordRate}','${company_id}')`;
  db.query(insert, (err, result) => {
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
  const insert = `insert into payment (free,payment_min,company_id,payment_free,payment_forward) value ('${
    free[0]
  }','${parseInt(payment_min)}','${company_id}','${payment_free}','${
    payment_forward[0]
  }')`;
  db.query(insert, (err, result) => {
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
  const get = `select * from setting_payment where company_id = '${id}'`;
  db.query(get, (err, result) => {
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

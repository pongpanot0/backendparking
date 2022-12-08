const db = require("../db/db");

exports.createChanel = async (req, res) => {
  const chanel_payments_detail = req.body.chanel_payments_detail;
  const chanel_payments_name = req.body.chanel_payments_name;
  const chanel_payments_tax = req.body.chanel_payments_tax;
  const chanel_id = req.body.chanel_id;
  const insert = `insert into chanel_payments (chanel_payments_detail,chanel_payments_name,chanel_payments_tax,chanel_id) value ('${chanel_payments_detail}','${chanel_payments_name}','${chanel_payments_tax}','${chanel_id}')`;
  await db
    .promise()
    .query(insert)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getMasterChanel = async (req, res) => {
  const get = `select * from chanel`;
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
exports.getChanelPayments = async (req, res) => {
  const id = req.params.id;
  const get = `select cp.*,c.* from chanel_payments cp left outer join chanel c ON (cp.chanel_id=c.chanel_id)  where cp.company_id = ${id} `;
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

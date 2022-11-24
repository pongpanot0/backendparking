const db = require("../db/db");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
exports.parking = async (req, res) => {
  const parking_logs_id = req.params.parking_logs_id;
  const getdata = `select * from parking_logs where parking_logs_id='${parking_logs_id}'`;
  db.query(getdata, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.send(result);
    }
  });
};

exports.calpark = async (req, res) => {
  const company_id = req.params.company_id;
  const getSet = `select * from setting_payment where company_id=${company_id}`;
  db.query(getSet, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(result);
    }
  });
};

const QRcode = require("qrcode");

function loopGetLadderTimeRate(ds, min2) {
  const min = Math.abs(min2);
  const hour = parseInt(min) / 60;
  const val0 = ds.filter((row) => row.payment_forward === 1);
  const val1 = ds.filter((row) => row.payment_forward === 0);
  const val3 = val1.filter((row) => row.free === 0);
  totalprice = [];
  timerem = [];

  for (let s = 0; s < val3.length; s++) {
    timerem.push(parseInt(min) - val3.slice(-1)[0].payment_min);
    let toDate = parseInt(min) - ds[s].payment_min;
    let todata = Math.max(toDate, 0) / 60;
    const tat = Math.ceil(todata);

    let val = Math.min(tat, 1) * parseInt(val3[s].payment_free);
    totalprice.push(val);
  }

  for (let i = 0; i < ds.length; i++) {
    if (parseInt(min) <= ds[0].payment_min && ds[i].free === 1) {
      totalprice.push(parseInt(hour) * ds[0].payment_free);

      break;
    }
    //หาวิธีทำค่า - เป็น 0 ค่า 0. เป็น +

    if (
      parseInt(min) > val1.slice(-1)[0].payment_min &&
      ds[i].payment_forward === 1
    ) {
      const timeremain = parseInt(timerem) / 60;
      const data = Math.ceil(timeremain);
      let val = data * parseInt(val0[0].payment_free);
      totalprice.push(val);
    }
  }
  const sum = totalprice.reduce((partialSum, a) => partialSum + a, 0);

  return sum;
}
const generatePayload = require("promptpay-qr");
exports.parkcalculate = async (req, res) => {
  const id = req.params.id;
  const parking_logs_id = req.params.parking_logs_id;

  const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
  const getlog = `select * from parking_logs where parking_uuids = '${parking_logs_id}'`;
  const getset = `select * from payment where company_id = '${id}'`;
  const updateSuccess = `update parking_logs set parking_end='${end}' where parking_uuids='${parking_logs_id}'`;
  db.query(updateSuccess, async (err, result) => {
    if (err) throw err;
    if (result) {
      db.query(getlog, async (err, result) => {
        if (err) throw err;
        if (result) {

          const resultdata = result;
          var start = resultdata.map((row) => row.parking_start);
          var end = resultdata.map((row) => row.parking_end);

          var duration = moment.duration(moment(start[0]).diff(moment(end[0])));

          var min = duration.asMinutes();

          db.query(getset, (err, result) => {
            if (err) throw err;
            if (result) {
              const data2 = loopGetLadderTimeRate(result, min);
              const amount = parseInt(data2);
              const value = parseInt(amount);
              const mobileNmber = "1104300111810";
              const payload = generatePayload(mobileNmber, { amount: value });
              const option = {
                color: {
                  dark: "#000",
                  light: "#fff",
                },
              };
              QRcode.toDataURL(payload, option, (err, url) => {
                if (err) throw err;
                if (url) {
                  res.send({
                    status: 200,
                    resbody: resultdata,
                    data: url,
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};
// Require the package

const url = require("url");
exports.createPark = async (req, res) => {
  const parking_start = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
  const parking_uuids = uuidv4();
  const company_id = req.body.company_id;
  const insert = `insert into parking_logs (parking_start,parking_uuids,company_id) value ('${parking_start}','${parking_uuids}','${company_id}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      const option = {
        color: {
          dark: "#000",
          light: "#fff",
        },
      };
      url.href = `${process.env.fronend_url}/payment/${parking_uuids}/${id}`;
      QRcode.toDataURL(url.href, option, (err, url) => {
        if (err) {
          console.log(err);
        }
        if (url) {
          const update = `update parking_logs set base64='${url}' where parking_logs_id =${result.insertId} `;
          db.query(update, (err, result) => {
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
        }
      });
    }
  });
};

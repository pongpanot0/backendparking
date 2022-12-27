const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
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

// Require the package

const url = require("url");

const conn = require("../db/mongodb");
exports.createParkLog = async (req, res) => {
  console.log(req.body[0]["SN"]);
  company_id = [];
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("kiossetting")
    .find({ kios_serailNum: "253203810" })
    .toArray()
    .then((result) => {
      company_id.push(result[0].company_id);
    });
  const event = {
    parking_start: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
    parking_uuids: uuidv4(),
    company_id: company_id[0],
    success: 0,
    totalSum: 0,
    parking_start_date: moment(new Date()).format("yyyy-MM-DD"),
    parking_start_mouth: moment(new Date()).format("yyyy-MM"),
  };

  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .insertOne(event, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        const id = result.insertedId;
        const option = {
          color: {
            dark: "#000",
            light: "#fff",
          },
        };
        url.href = `${process.env.fronend_url}/payment/${event.parking_uuids}/${event.company_id}`;
        QRcode.toDataURL(url.href, option, async (err, url) => {
          if (err) {
            console.log(err);
          }
          if (url) {
            await conn
              .db("qrpaymnet")
              .collection("parkingLogs")
              .updateOne(
                { _id: id },
                {
                  $set: { base64: url },
                }
              )
              .then((result) => {
                const data = {
                  jsonrpc: "2.0",
                  method: "远程开门",
                  params: [
                    {
                      设备序列号: req.body[0]["SN"],
                      门号: 1,
                    },
                  ],
                  id: 0,
                };
                axios({
                  url: `http://119.59.97.193:61080`, //your url
                  method: "POST",
                  data: data,
                }).then((res) => {
                  console.log(res.data);
                  return;
                });
                /*    res.send(result); */
              });
          }
        });
      }
    });
};
exports.parkcalculate2 = async (req, res) => {
  const id = req.params.id;
  const parking_logs_id = req.params.parking_logs_id;
  await conn.connect();
  const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");

  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .updateOne(
      { parking_uuids: parking_logs_id },
      {
        $set: {
          parking_end: end,
          parking_end_date: moment(end).format("yyyy-MM-DD"),
          parking_end_mouth: moment(end).format("yyyy-MM"),
          parking_end_year: moment(end).format("yyyy"),
        },
      }
    )
    .then(async (result) => {
      const log = await conn
        .db("qrpaymnet")
        .collection("parkingLogs")
        .find({ parking_uuids: parking_logs_id })
        .toArray()
        .then(async (result) => {
          const resultdata = result;
          var start = resultdata.map((row) => row.parking_start);
          var end = resultdata.map((row) => row.parking_end);
          var duration = moment.duration(moment(start[0]).diff(moment(end[0])));
          var min = duration.asMinutes();

          const log = await conn
            .db("qrpaymnet")
            .collection("payment")
            .find({ company_id: id })
            .toArray()
            .then((result) => {
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
                    sum: data2,
                    resbody: resultdata,
                    data: url,
                  });
                }
              });
            });
        });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally((es) => {
      setTimeout(async function () {
        const log = await conn
          .db("qrpaymnet")
          .collection("parkingLogs")
          .find({ parking_uuids: parking_logs_id })
          .toArray()
          .then(async (result) => {
            if (result[0].out == 0 && result[0].paid == 1) {
              const lineNotify = require("line-notify-nodejs")(
                "n7XJ8s06pxupAvKm5RpVtLQqPuYKnVtHb35iLOYzNSg"
              );

              lineNotify
                .notify({
                  message: "send test",
                })
                .then(() => {
                  console.log("send completed!");
                });
              console.log("update");
              const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
              const log = await conn
                .db("qrpaymnet")
                .collection("parkingLogs")
                .updateOne(
                  { parking_uuids: parking_logs_id },
                  {
                    $set: {
                      parking_end2: end,
                      totalSum: firstvalue[0],
                    },
                  },
                  {
                    $add: {
                      firstvalue: 50,
                    },
                  }
                )
                .then(async (result) => {})
                .catch((err) => {
                  console.log(err);
                });
            }
            if (result[0].out == 1 && result[0].paid == 1) {
              console.log("555");
              return;
            } else {
              return;
            }
          });
      }, time[0] * 60);
    });
};
exports.testgetpark = async (req, res) => {
  await conn.connect();
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find()
    .toArray();
  res.send({
    count: log,
  });
};
exports.getParklog = async (req, res) => {
  await conn.connect();
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find()
    .toArray();
  res.send({
    count: log,
  });
};
exports.parkcalculateTest = async (req, res) => {
  const id = req.params.id;
  const parking_logs_id = req.params.parking_logs_id;
  await conn.connect();
  const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
  const firstvalue = [];
  const sum = [];
  const getset = `select * from payment where company_id = '${id}'`;
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .updateOne(
      { parking_uuids: parking_logs_id },
      {
        $set: {
          parking_end: end,
          parking_end_date: moment(end).format("yyyy-MM-DD"),
          parking_end_mouth: moment(end).format("yyyy-MM"),
          parking_end_year: moment(end).format("yyyy"),
        },
      }
    )
    .then(async (result) => {
      const log = await conn
        .db("qrpaymnet")
        .collection("parkingLogs")
        .aggregate([
          { $match: { parking_uuids: parking_logs_id } },
          {
            $lookup: {
              from: "company",
              localField: "company_id",
              foreignField: "company_id",
              as: "company",
            },
          },
        ])

        .toArray()
        .then((result) => {
          time = [];
          const timeReamain = result[0].company[0].timeReamain;
          time.push(timeReamain);
          const firstvalue2 = result[0].firstvalue;
          const totalSum = result[0].totalSum;
          const resultdata = result;
          var start = resultdata.map((row) => row.parking_start);
          var end = resultdata.map((row) => row.parking_end);
          var duration = moment.duration(moment(start[0]).diff(moment(end[0])));
          var min = duration.asMinutes();
          db.query(getset, async (err, result) => {
            if (err) throw err;
            if (result) {
              const data2 = loopGetLadderTimeRate(result, min);
              firstvalue.push(data2);
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
              const log = await conn
                .db("qrpaymnet")
                .collection("parkingLogs")
                .updateOne(
                  { parking_uuids: parking_logs_id },
                  {
                    $set: {
                      parking_end: end[0],
                    },
                  }
                )
                .then(async (result) => {
                  QRcode.toDataURL(payload, option, (err, url) => {
                    if (err) throw err;
                    if (url) {
                      res.send({
                        status: 200,
                        sum: amount,
                        resbody: resultdata,
                        data: url,
                      });
                    }
                  });
                });
            }
          });
        });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally((es) => {
      setTimeout(async function () {
        const log = await conn
          .db("qrpaymnet")
          .collection("parkingLogs")
          .find({ parking_uuids: parking_logs_id })
          .toArray()
          .then(async (result) => {
            if (result[0].out == 0 && result[0].paid == 1) {
              const lineNotify = require("line-notify-nodejs")(
                "n7XJ8s06pxupAvKm5RpVtLQqPuYKnVtHb35iLOYzNSg"
              );

              lineNotify
                .notify({
                  message: "send test",
                })
                .then(() => {
                  console.log("send completed!");
                });
              console.log("update");
              const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
              const log = await conn
                .db("qrpaymnet")
                .collection("parkingLogs")
                .updateOne(
                  { parking_uuids: parking_logs_id },
                  {
                    $set: {
                      parking_end2: end,
                      totalSum: firstvalue[0],
                    },
                  },
                  {
                    $add: {
                      firstvalue: 50,
                    },
                  }
                )
                .then(async (result) => {})
                .catch((err) => {
                  console.log(err);
                });
            }
            if (result[0].out == 1 && result[0].paid == 1) {
              console.log("555");
              return;
            } else {
              return;
            }
          });
      }, time[0] * 60);
    });
};

exports.Parksumcalculator = async (req, res) => {
  const id = req.params.id;
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .aggregate([
      // First Stage
      {
        $match: { company_id: id },
      },
      {
        $group: {
          _id: "$parking_start_mouth",
          totalSaleAmount: { $sum: { $multiply: ["$totalSum"] } },
        },
      },
      { $sort: { _id: 1 } },
      // Second Stage
    ])
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};
exports.Parkcountlogs = async (req, res) => {
  const id = req.params.id;
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .aggregate([
      // First Stage
      {
        $match: { company_id: id },
      },
      {
        $group: {
          _id: "$parking_start_mouth",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      // Second Stage
    ])
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};
exports.ParkLike = async (req, res) => {
  const id = req.params.id;
  const lcplate = req.body.lcplate;
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({ lcplate: lcplate, company_id: id })
    .toArray()
    .then((result) => {
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};

exports.ParkIn = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const log = await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .aggregate([
      // First Stage
      {
        $match: { company_id: id, out: 0 },
      },
      {
        $group: {
          _id: "$out",
          count: { $sum: 1 },
        },
      },
      // Second Stage
    ])
    .toArray()
    .then((result) => {
      console.log(result);
      res.send({
        status: 200,
        data: result,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};

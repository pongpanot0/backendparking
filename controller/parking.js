const db = require("../db/db");
const moment = require("moment");


exports.parking = async (req, res) => {
  const parking_logs_id = req.params.parking_logs_id;
  const company_id = req.params.company_id;
  const getSet = `select * from setting_payment where company_id=${company_id}`;
  const getdata = `select * from parking_logs where parking_logs_id='${parking_logs_id}'`;
  db.query(getdata, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      const start = moment(new Date(result[0].parking_start));
      const end = moment(new Date()).format("yyyy-MM-DD HH:mm:ss");
      const updateSuccess = `update parking_logs set parking_end='${end}' where parking_logs_id='${parking_logs_id}'`;
      db.query(updateSuccess, (err, result) => {
        if (err) {
          res.send(err);
        }
        if (result) {
          var duration = moment.duration(moment(new Date()).diff(start));
          var hours = duration.asHours();
          var min = hours * 60;
          db.query(getSet, (err, result) => {
            if (err) {
              res.send(err);
            }
            if (result) {
              res.send({
                data: plusHour(min, result),
                hours: hours,
              });
            }
          });
        }
      });
    }
  });
};

function loopGetLadderTimeRate(ds, totalMinutes) {
  let totPrice = 0;

  const totMinutes = totalMinutes;
  const totMinutesCal = totalMinutes;

  if (ds.length != 0) {
    dt = ds;

    for (let i = 0; i <= dt.length - 1; i++) {
      {
        let hfrom = dt[i]["HFrom"];
        let mfrom = dt[i]["MFrom"];
        let sfrom = dt[i]["SFrom"];

        //string val = dt.Rows[i]["ValueCharge"].ToString();

        let chargeValue = dt[i]["ValueCharge"];

        let isForwordRate = dt[i]["IsForwordRate"];
        let totalMinTimeFrom = parseInt(hfrom) * 60 + parseInt(mfrom);

        if (isForwordRate == "false") {
          let hto = dt[i]["Hto"];
          let mto = dt[i]["Mto"];
          let sto = dt[i]["Sto"];

          let totalMinTimeTo = (parseInt(hto) * 60) + parseInt(mto);

          //if (totMinutes >= totalMinTimeFrom && totMinutes <= totalMinTimeTo)

          diffMinutes = parseInt(totalMinTimeTo) - parseInt(totalMinTimeFrom);

          if (hfrom + mfrom == 0) {
          } else {
            //totalMinTimeFrom -= 1; //ต้องการนาทีต้นด้วย
            diffMinutes += 1; //ต้องการนาทีต้นด้วย
          }

          if (totMinutes >= totalMinTimeFrom) {
            //int totPeriod = (totalMinTimeTo - totalMinTimeFrom);
            //totMinutesCal -= totPeriod;
            let totMinutesCal = 0;
            let totPrice = 0;
            totMinutesCal -= diffMinutes;
            totPrice += chargeValue;
            console.log(totPrice);
          }
        } else {
          let calRateBy = dt[i]["CalculateRateBy"];

          if (calRateBy == "H") {
            //คิดเวลาเป็นต้นไปเป็นชั่วโมง

            totHours = totMinutesCal / 60;

            rest = totMinutesCal % 60; // เอาเศษ

            totPrice += parseInt(totHours) * parseInt(chargeValue);
            if (rest > 0) {
              // มีเศษเหลือชั่วโมง
              totPrice += chargeValue;
            }
          } else if (calRateBy == "M") {
            //คิดเวลาเป็นต้นไปเป็นนาที
            totPrice += totMinutesCal * chargeValue;
          }
        }
      }
    }

    return { data: totPrice };
  }
}

exports.calpark = async (req, res) => {
  const company_id = req.params.company_id;
  const getSet = `select * from setting_payment where company_id=${company_id}`;
  db.query(getSet, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(loopGetLadderTimeRate(result, 60));
    }
  });
};

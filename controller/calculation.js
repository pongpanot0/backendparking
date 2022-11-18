const db = require("../db/db");
function plusHour(mm, func) {
  const db = func.map((row) => {
    return row.ValueCharge;
  });

  let hour = mm / 60;
  let miniunt = mm % 60;
  console.log(miniunt);
  if (miniunt > 1) {
    hour++;
  }
  cost = [];
  for (let i = 0; i < db.length; i++) {
    cost = parseInt(hour) * db[i];
  }

  return {
    data: cost,
    hour: hour,
    miniunt: miniunt,
  };
}

function loopGetLadderTimeRate(ds, totalMinutes) {
  const valcal = [
    {
      mindef: 30,
      val: 0,
      free: 1,
      forward: 0,
    },
    {
      mindef: 60,
      val: 10,
      free: 0,
      forward: 0,
    },
    {
      mindef: 120,
      val: 20,
      free: 0,
      forward: 0,
    },
    {
      mindef: 180,
      val: 30,
      free: 0,
      forward: 1,
    },
  ];
  let min = 181;
  let hour = min / 60;
  const val0 = valcal.filter((row) => row.forward === 1);
  let val1 = valcal.filter((row) => row.forward === 0);

  totalprice = [];
  timerem = [];
  for (let i = 0; i < valcal.length; i++) {
    if (min <= valcal[0].mindef && valcal[i].free === 1) {
      totalprice.push(parseInt(hour) * valcal[0].val);
      break;
    }
    if (min > valcal[0].mindef && valcal[i].forward === 0) {
      timerem.push(min - val1.slice(-1)[0].mindef);
      let val = 1 * parseInt(val1[i].val);
      totalprice.push(val);
    }
    if (min > val1.slice(-1)[0].mindef && valcal[i].forward === 1) {
      const timeremain = parseInt(timerem) / 60;
      const data = Math.ceil(timeremain);
      let val = data * parseInt(val0[0].val);
      totalprice.push(val);
    }

    // 6
    /* if (min > valcal[0].mindef && min <= valcal[i].mindef) {
      const timeremain = min - valcal[i].mindef;
      console.log(timeremain);
      totalprice.push(parseInt(hour) * valcal[i].val);
      break;
    }
    if (min == valcal[i].mindef) {
      const timeremain = (min -= valcal[i].mindef);
      console.log(timeremain);
      totalprice.push((parseInt(timeremain) * valcal[i].val) / 60);
    } */
  }
  const sum = totalprice.reduce((partialSum, a) => partialSum + a, 0);
  return {
    status: 200,
    data: sum,
  };
}

exports.calpark = async (req, res) => {
  const company_id = req.params.company_id;
  const getSet = `select * from setting_payment where company_id=${company_id}`;
  db.query(getSet, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.send(loopGetLadderTimeRate(30, result));
    }
  });
};

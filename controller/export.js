const db = require("../db/db");
const moment = require("moment");

const conn = require("../db/mongodb");
exports.exportparking = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({ company_id: parseInt(id) })
    .toArray()
    .then((row) => {
      res.send({
        status: 200,
        data: row,
      });
    })
    .catch((err) => {
      res.send({
        status: 400,
        data: err,
      });
    });
};

const XLSX = require("xlsx");
exports.exportParkExcel = async (req, res) => {
  let id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({ company_id: parseInt(id) })
    .toArray()
    .then((row) => {
      const data = [];
      for (let i = 0; i < row.length; i++) {
        const jsonData = [
          {
            parking_start: row[i].parking_start,
            parking_uuids: row[i].parking_uuids,
            parking_end: row[i].parking_end,
          },
        ];
        data.push(...jsonData);
      }
      const convertJsonToexcel2 = () => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "HouseData");
        //binary buffer
        XLSX.write(workBook, {
          bookType: "xlsx",
          type: "buffer",
        });
        //binary string
        const fs = require("fs");
        const filename = "users.xlsx";
        const wb_opts = { bookType: "xlsx", type: "binary" }; // workbook options
        XLSX.writeFile(workBook, filename, wb_opts); // write workbook file
        const stream = fs.createReadStream(filename); // create read stream
        stream.on("open", function () {
          // This just pipes the read stream to the response object (which goes to the client)
          stream.pipe(res);
        });
      };
      convertJsonToexcel2();
      return;
    });
  
};

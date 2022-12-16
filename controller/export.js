const moment = require("moment");

const conn = require("../db/mongodb");
exports.exportparking = async (req, res) => {
  const id = req.params.id;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({ company_id: id })
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
    .find({ company_id: id })
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
exports.exportSelectDateParkExcel = async (req, res) => {
  let id = req.params.id;
  const parking_start_date_first = moment(
    req.body.parking_start_date_first
  ).format("yyyy-MM-DD");
  const parking_start_date_end = moment(req.body.parking_start_date_end).format(
    "yyyy-MM-DD"
  );
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({
      parking_start_date: {
        $gte: `${parking_start_date_first}`,
        $lt: `${moment(`${parking_start_date_end}`).add(1, "days")}`,
      },
      company_id: id,
    })
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
exports.exportSelectTimeParkExcel = async (req, res) => {
  let id = req.params.id;
  console.log(req.body);
  const parking_start_date_first = moment(
    req.body.parking_start_date_first
  ).format("yyyy-MM-DD HH:mm:ss");
  const parking_start_date_end = moment(req.body.parking_start_date_end).format(
    "yyyy-MM-DD HH:mm:ss"
  );
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("parkingLogs")
    .find({
      parking_start: {
        $gte: `${parking_start_date_first}`,
        $lt: `${parking_start_date_end}`,
      },
      company_id: id,
    })
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
const ejs = require("ejs");
const fs = require("fs");
const htmlToPdf = require("html-pdf-node");
const getPrinters = require("pdf-to-printer");
exports.getPrinters = async (req, res) => {
  /*   getPrinters.getPrinters().then((result) => {
    res.send(result);
  }); */
};

exports.testpdf = async (req, res) => {
  const rows = [
    {
      Date: "2022-12-15 ",
      Time: "16:37:52",
      Qrcode:
        "https://images.unsplash.com/photo-1661961110144-12ac85918e40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    },
  ];
  const tableHtml = await ejs.renderFile(
    "./template/table.html.ejs",
    { rows: rows },
    { async: true }
  );
  const html = await ejs.renderFile(
    "./template/layout.html.ejs",
    { body: tableHtml },
    { async: true }
  );
  let options = {
    format: "A4",
    margin: { top: 15, left: 10, right: 10, bottom: 15 },
  };
  const options2 = {
    printer: "Microsoft Print to PDF",
  };
  let file = { content: html };
  htmlToPdf
    .generatePdf(file, options)
    .then((pdfBuffer) => {
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment",
        })
        .end(pdfBuffer);
      fs.writeFileSync("test.pdf", pdfBuffer);
      getPrinters.print(`./test.pdf`, options2, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          fs.unlink("./test.pdf", function (err) {
            if (err) return console.log(err);
            console.log("file deleted successfully");
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({ success: false, error: err });
    });

  /*  .catch((err) => {
      res.send({ success: false, err: err });
    }); */
};

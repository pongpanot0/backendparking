const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generatePayload = require("promptpay-qr");
const promptpay = require("promptpay-js");
const _ = require("lodash");
const QRcode = require("qrcode");

exports.create = async (req, res) => {
  const amount = parseFloat(_.get(req, ["body", "amount"]));
  const mobileNmber = "1104300111810";
  const payload = generatePayload(mobileNmber, { amount });
  const option = {
    color: {
      dark: "#000",
      light: "#fff",
    },
  };
  QRcode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log(err);
    }
    if (url) {
      res.send(url);
    }
  });
  const data = promptpay.parse(payload);
};

exports.qrcode = async (req, res) => {
  const payload = promptpay.generate({
    method: "QR_STATIC",
    application: "PROMPTPAY_CREDIT_TRANSFER",
    mobileNumber: "0985496936",
    currencyCode: "764",
    countryCode: "TH",
    amount: "500.00",
  });
  const option = {
    color: {
      dark: "#000",
      light: "#fff",
    },
  };
  QRcode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log(err);
    }
    if (url) {
      res.send(url);
    }
  });



};
const Omise = require("omise");
exports.omis = async (req, res) => {
  Omise.setPublicKey("skey_test_5towjiqkenkn0cjh1e5");

  Omise.createSource(
    "promptpay",
    {
      amount: 0.1,
      currency: "THB",
    },
    function (statusCode, response) {
      console.log(response);
    }
  );
};

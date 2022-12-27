
const bcrypt = require("bcryptjs");
const conn = require("../db/mongodb");
const jwt = require("jsonwebtoken");
const moment = require("moment");
exports.register = async (req, res) => {
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("users")
    .find({ user_name: req.body.user_name })
    .count()
    .then(async (result) => {
      console.log(result);
      if (result > 0) {
        res.send({
          data: 400,
          result: "มีUsername อยุ่แล้ว",
        });
      }
      if (result <= 0) {
        const event = {
          company_name: req.body.company_name,
          company_lots: req.body.company_lots,
          timeReamain: parseInt(req.body.timeReamain),
          company_pic: "1670813031869.png",
          created_by: req.body.created_by,
          created_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        };
        await conn
          .db("qrpaymnet")
          .collection("company")
          .insertOne(event, async (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              bcrypt.hash(req.body.user_password, 10, async (err, hash) => {
                if (err) {
                  console.log(err);
                }
                if (hash) {
                  const event = {
                    user_name: req.body.user_name,
                    created_by: req.body.created_by,
                    created_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
                    company_id: result.insertedId,
                    user_password: hash,
                  };

                  await conn
                    .db("qrpaymnet")
                    .collection("users")
                    .insertOne(event, async (err, result) => {
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
      }
    });
};
exports.login = async (req, res) => {
  console.log(1);
  let user_name = req.body.user_name;
  await conn.connect();
  await conn
    .db("qrpaymnet")
    .collection("users")
    .find({ user_name: user_name })
    .toArray()
    .then(async (result) => {
      console.log(result);
      if (result == [] || result == null || result == "") {
        res.send({
          data: 400,
          result: "ชื่อหรือรหัสผ่านผิด",
        })
        return;
      }
      if (result[0] == [] || result[0] == null || result[0] == "") {
        res.send({
          data: 400,
          result: "มีUsername อยุ่แล้ว",
        });
      }
      if (result[0] !== [] || result[0] !== null || result[0] !== '') {
        bcrypt.compare(
          req.body.user_password,
          result[0]["user_password"],
          (bErr, bResult) => {
            if (bErr) {
              return res.status(401).send({
                msg: "Email or password is incorrect!",
              });
            }
            if (bResult) {
              const token = jwt.sign(
                {
                  user_id: result[0]._id,
                  user_name: result[0].user_name,
                  company_id: result[0].company_id,
                },
                "zuHbAry/7IrrSQaynzj4c8i8n1iO+CCqzdyeXgRNlfDdQBUJcX9yrYGc98fqp169/ELDSLwtvzebeQ0nf6WkOiXUhOdStRMhPykd/nJwEdmENXThvX9Map7k1gwvXvciZ48DYVc7nntfN82k+ZXSRX2+rTN8YEK3S7tP/0csBYdQwB6OS5FzMHM1gQvK3VX4QAlC6nDbvLsYOBqZcYsDlvlL/Uglw57wNNpLfwjQQC+zXBFvGnROVNLh//yyBl1kB+YmIZXrnkrUkNbLm7QteW+6nXUWZ1gQOEatjCr9NnYxaY4Ve0QABq0sHzifZ65Bz4HVFptun97VS4LSTJmxeQ=="
              );

              res.send({
                status: 200,
                name: result[0].user_name,
                email: result[0].user_name,
                accessToken: token,
                user: result,
              });
            }
          }
        );
      }
    });
};
/* exports.login = async (req, res) => {
  let user_name = req.body.user_name;
  db.query(
    `select * from users  WHERE user_name = '${user_name}' and inactive = 0`,
    async (err, result) => {
      if (err) {
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
        return;
      }
      if (result[0] === null || result[0] === [] || result[0] === undefined) {
        console.log("1234");
        res.send({
          status: 400,
          message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
        });
        return;
      }
      if (result) {
        bcrypt.compare(
          req.body.user_password,
          result[0]["user_password"],
          (bErr, bResult) => {
            if (bErr) {
              return res.status(401).send({
                msg: "Email or password is incorrect!",
              });
            }
            if (bResult) {
              const token = jwt.sign(
                {
                  user_id: result[0].user_id,
                  user_firstname: result[0].user_firstname,
                  user_surname: result[0].user_surname,
                  email: result[0].email,
                  company_id: result[0].company_id,
                  organize_id: result[0].organize_id,
                  role: result[0].role,
                  product: result[0].product,
                  customer: result[0].customer,
                  Company_name: result[0].Company_name,
                },
                "zuHbAry/7IrrSQaynzj4c8i8n1iO+CCqzdyeXgRNlfDdQBUJcX9yrYGc98fqp169/ELDSLwtvzebeQ0nf6WkOiXUhOdStRMhPykd/nJwEdmENXThvX9Map7k1gwvXvciZ48DYVc7nntfN82k+ZXSRX2+rTN8YEK3S7tP/0csBYdQwB6OS5FzMHM1gQvK3VX4QAlC6nDbvLsYOBqZcYsDlvlL/Uglw57wNNpLfwjQQC+zXBFvGnROVNLh//yyBl1kB+YmIZXrnkrUkNbLm7QteW+6nXUWZ1gQOEatjCr9NnYxaY4Ve0QABq0sHzifZ65Bz4HVFptun97VS4LSTJmxeQ==",
                { expiresIn: "1h" }
              );
              res.send({
                status: 200,
                accessToken: token,
                user: result,
              });
            } else {
              return res.send({
                status: 400,
                message: "ชื่อหรือรหัสผ่านไม่ถูกต้อง",
              });
            }
          }
        );
      }
    }
  );
};
 */

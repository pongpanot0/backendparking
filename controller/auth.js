const db = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  let user_name = req.body.user_name;
  let created_by = req.body.created_by;
  let created_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  let updated_by = req.body.updated_by;
  let updated_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  let company_name = req.body.company_name;
  let count = `SELECT COUNT(user_name)  AS name2 FROM users WHERE user_name='${user_name}'`;
  db.query(count, async (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result[0].name2 >= 1) {
      res.send("มีUsername นี่อยู่แล้ว");
    }
    if (result[0].name2 == 0) {
      let createcompany = `insert into company (company_name,created_by,created_at,updated_by,updated_at) values('${company_name}','${created_by}','${created_at}','${updated_by}','${updated_at}')`;
      db.query(createcompany, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          let company_id = result.insertId;
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              console.log(err);
            }
            if (hash) {
              let create = `INSERT INTO users (user_name,user_password,created_by,created_at,updated_at,updated_by,company_id)  VALUES ('${user_name}','${hash}','${created_by}','${created_at}','${updated_by}','${updated_at}','${company_id}')`;
              db.query(create, (err, result) => {
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
        console.log('1234')
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

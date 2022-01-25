const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const conn = require("../dbConnection").promise();

exports.login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await conn.execute("SELECT * FROM `users` WHERE `email`=?", [
      req.body.email,
    ]);
    console.log("row:::", row);
    const passMatch = await bcrypt.compare(req.body.password, row[0].password);
    if (row.length === 0) {
      return res.status(422).json({
        message: "Invalid email address",
      });
    } else if (!passMatch) {
      return res.status(422).json({
        message: "Incorrect password",
      });
    } else if (row[0].is_verify === "false") {
      return res.status(422).json({
        message: "The E-mail is not verify please verify your email.......",
      });
    } else {
      const theToken = jwt.sign({ id: row[0].id }, "secret", {
        expiresIn: "7d",
      });
      return res.json({
        message: "login successfully !!!!!!",
        token: theToken,
      });
    }
  } catch (err) {
    next(err);
  }
};

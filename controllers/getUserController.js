var express = require("express");
const jwt = require("jsonwebtoken");
const conn = require("../dbConnection").promise();

exports.getUser = async (req, res) => {
  console.log("getUser", req.user);
  const [row] = await conn.execute("SELECT * FROM `users` WHERE `id`=?", [
    req.user.id,
  ]);
  if (row.length > 0) {
    return res.status(201).json({
      message: "user data get successfully !!!!",
      data: row[0],
    });
  } else {
    return res.status(201).json({
      message: "something Wrong here !!!!!",
    });
  }
};

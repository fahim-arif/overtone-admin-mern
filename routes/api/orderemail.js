const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

const mailRegister = (params, email) => {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false,
    auth: {
      user: "AKIA2DXTH734PPQZQMEN",
      pass: "BBkV+3lM6A14QKZ9O5L8QxW1uk3iL38+sC3MKwfKaZJK", // naturally, replace both with your real credentials or an application-specific password
    },
  });

  const mailOptions = {
    from: "overtone.demo@gmail.com",
    to: "overtone.demo@gmail.com",
    subject: "An order has been created",
    html: `<p>Hello, We have added an order in your accound. please click the link below to continue </p> <br/>
    <a href=${`http://localhost:5000/cart/${params}`}>Click Here</a>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

router.get("/", (req, res) => {
  res.send("Success");
});

router.post("/:id", (req, res, next) => {
  let qstring = [];
  const params = req.params.id;
  console.log(params);
  // let keyword = req.query.productId;
  // const userId = req.query.userId;

  // console.log(keyword.split("-").length);

  // const occur = keyword.split("-").length;

  // for (let i = 0; i < occur; i = i + 1) {
  //   keyword = keyword.split("-")[i];
  //   qstring.push({ keyword });
  // }
  const { email } = req.body;
  console.log(email);
  // console.log(qstring);
  // console.log(email);
  // console.log(keyword);
  mailRegister(params, email);
  res.send("Success");
});

module.exports = router;

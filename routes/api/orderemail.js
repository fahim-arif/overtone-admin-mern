const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

const mailRegister = (params, email, newUser = false, userInfo) => {
  // const transporter = nodemailer.createTransport({
  //   host: "email-smtp.us-east-1.amazonaws.com",
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: "AKIA2DXTH734PPQZQMEN",
  //     pass: "BBkV+3lM6A14QKZ9O5L8QxW1uk3iL38+sC3MKwfKaZJK", // naturally, replace both with your real credentials or an application-specific password
  //   },
  // });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "frstorebd@gmail.com",
      pass: "appleisred", // naturally, replace both with your real credentials or an application-specific password
    },
  });
console.log(newUser)
  let mailOptions = '';
  if (newUser) {
    console.log(userInfo)
    mailOptions = {
      from: "overtone.demo@gmail.com",
      to: "overtone.demo@gmail.com",
      subject: "An order has been created",
      html: `  <div>

    <img height=50 width=50 src="http://3.239.208.80:5000/static/1633059488logo.png" alt='logo'>
    <div>
      <p>We have added an order in your account. </p>
      <p>Your newly created email and password:</p>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>

          </tr>
        </thead>
        <tbody>

          <tr>
            <td>${userInfo.email}</td>
            <td>${userInfo.password}</td>

          </tr>
        </tbody>
      </table>
    </div>
    please click the link to continue shopping
    <a href=${`http://localhost:5000/cart/${params}`}>Click Here</a>
  </div>
      `,
    };
  } else {

    mailOptions = {
      from: "overtone.demo@gmail.com",
      to: "overtone.demo@gmail.com",
      subject: "An order has been created",
      html: `<p>Hello, We have added an order in your accound. please click the link below to continue </p> <br/>
      <a href=${`http://localhost:5000/cart/${params}`}>Click Here</a>
      `,
    };
  }

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
  // console.log(params);
  // let keyword = req.query.productId;
  // const userId = req.query.userId;

  // console.log(keyword.split("-").length);

  // const occur = keyword.split("-").length;

  // for (let i = 0; i < occur; i = i + 1) {
  //   keyword = keyword.split("-")[i];
  //   qstring.push({ keyword });
  // }
  const { email, newUser, userInfo } = req.body;
  console.log(userInfo);
  // console.log(qstring);
  // console.log(email);
  // console.log(keyword);
  mailRegister(params, email, newUser, userInfo);
  res.send("Success");
});

module.exports = router;

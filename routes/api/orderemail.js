const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer");

const mailRegister = (params, email, newUser = false, userInfo) => {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false,
    auth: {
      user: "AKIA2DXTH734PPQZQMEN",
      pass: "BBkV+3lM6A14QKZ9O5L8QxW1uk3iL38+sC3MKwfKaZJK", // naturally, replace both with your real credentials or an application-specific password
    },
  });
  // const transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: "frstorebd@gmail.com",
  //     pass: "appleisred", // naturally, replace both with your real credentials or an application-specific password
  //   },
  // });
  console.log(newUser)
  let mailOptions = '';
  if (newUser) {
    console.log(userInfo)
    mailOptions = {
      from: "overtone.demo@gmail.com",
      to: "overtone.demo@gmail.com",
      subject: "An order has been created",
      html: ` <div style="max-width:400px; margin: 0 auto; font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
   <div style='background:#000000; height: 57px;' >
      
    <img heigh=50 width=280 src="http://3.239.208.80:5000/static/1633059488logo.png" alt='logo'>
    </div>
  <div style="border: 1px solid #dbdbdb; padding: 20px">
   
    <div>
      <p style="font-size:24px; text-align:center">We have added an order in your account. </p>
      <p>Your newly created email and password:</p>
        <table style="width:100%;border-collapse: collapse;border: 1px solid black;">
        <thead>
          <tr>
            <th style="border: 1px solid black;">Email</th>
            <th style="border: 1px solid black;">Password</th>

          </tr>
        </thead>
        <tbody>

          <tr>
            <td style="border: 1px solid black;">${userInfo.email}</td>
            <td style="border: 1px solid black;">${userInfo.password}</td>

          </tr>
        </tbody>
      </table>
   
      <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center"> Use this account information to login. Please bear in mind that after loggin in, change your password as soon as possible.<div style="padding-top:32px;text-align:center"><a href="http://localhost:3001/cart/${params}" style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;line-height:16px;color:#ffffff;font-weight:500;text-decoration:none;font-size:13px;display:inline-block;padding:10px 24px;background-color:#524f4f;border-radius:5px;min-width:90px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://accounts.google.com/AccountChooser?Email%3Dovertone.demo@gmail.com%26continue%3Dhttps://myaccount.google.com/alert/nt/1634906931000?rfn%253D31%2526rfnc%253D1%2526eid%253D-7969835243991180896%2526et%253D0%2526anexp%253Dnret-fa&amp;source=gmail&amp;ust=1635273382397000&amp;usg=AFQjCNEx4qt293y8qL5-0BabzzAxZ0a4Tw">View My Order</a></div></div>
    </div>
    
    <a href=${`http://localhost:3001/cart/${params}`}></a>
  </div>
  </div>`,
    };
  } else {

    mailOptions = {
      from: "overtone.demo@gmail.com",
      to: "overtone.demo@gmail.com",
      subject: "An order has been created",
      html: `<div style="max-width:400px; margin: 0 auto; font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
   <div style='background:#000000;height: 57px;' >
      
    <img heigh=50 width=280 src="http://3.239.208.80:5000/static/1633059488logo.png" alt='logo'>
    </div>
  <div style="border: 1px solid #dbdbdb; padding: 20px">
   
    <div>
      <p style="font-size:24px; text-align:center">We have added an order in your account. </p>
      <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:center"> Use this account information to login. Please bear in mind that after loggin in, change your password as soon as possible.<div style="padding-top:32px;text-align:center"><a href="http://localhost:3001/cart/${params}" style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;line-height:16px;color:#ffffff;font-weight:500;text-decoration:none;font-size:13px;display:inline-block;padding:10px 24px;background-color:#524f4f;border-radius:5px;min-width:90px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://accounts.google.com/AccountChooser?Email%3Dovertone.demo@gmail.com%26continue%3Dhttps://myaccount.google.com/alert/nt/1634906931000?rfn%253D31%2526rfnc%253D1%2526eid%253D-7969835243991180896%2526et%253D0%2526anexp%253Dnret-fa&amp;source=gmail&amp;ust=1635273382397000&amp;usg=AFQjCNEx4qt293y8qL5-0BabzzAxZ0a4Tw">View My Order</a></div></div>
    </div>
    
    <a href=${`http://localhost:3001/cart/${params}`}></a>
  </div>
  </div>`,
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

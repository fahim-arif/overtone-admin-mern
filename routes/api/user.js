const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const SendOtp = require("sendotp");
const sendOtp = new SendOtp(
  "327370AYi7chNGe5ea51d09P1",
  "DLABS OTP for your account  {{otp}}"
);
const otpRegister = new SendOtp(
  "327370AYi7chNGe5ea51d09P1",
  "DLABS OTP for your account {{otp}}"
);

//Load input Validation
const validateRegisterInput = require("../../validation/User/register");
const validateEditInput = require("../../validation/User/edit");
const validateUserLoginInput = require("../../validation/User/login");
const validateUpdateInput = require("../../validation/User/updatepassword");
const validateForgetInput = require("../../validation/User/forget");
const validateverifyInput = require("../../validation/User/verify");
const validateUserInput = require("../../validation/User/UserValidation");

const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const appleSignin = require("apple-signin");

//Load User Model
const User = require("../../models/User");

const OAuthClient = require("intuit-oauth");
require("dotenv").load();

// @route GET  api/users/test
// @desc  Test users route
// @access public
router.get("/test", (req, res) => res.json({ msg: "Users Works!!" }));

router.post("/customer-create", async (req, res) => {
  var quickAuthToken;
  var getSetting = await Setting.findOne();
  if (getSetting) {
    quickAuthToken = JSON.parse(getSetting.quickBook);
  }
  let oauthClientOrder = new OAuthClient({
    clientId: "AB2T4UWnpedrpGq33wumOOGMzsG92cTzfytneE8xmJwwS1CtuP",
    clientSecret: "jMywcYPlGTGA9Fd1Lt1eWbLQXJ5Tx19JbL4VBRC0",
    environment: "sandbox",
    redirectUri:
      "http://ec2-3-238-89-147.compute-1.amazonaws.com:5000/admin/quickbook/callback",
    //redirectUri: 'http://localhost:3000/admin/quickbook/callback',
    token: quickAuthToken,
  });
  if (!oauthClientOrder.isAccessTokenValid()) {
    oauthClientOrder
      .refresh()
      .then(async function (authResponse) {
        oauthClientOrder = new OAuthClient({
          clientId: "AB2T4UWnpedrpGq33wumOOGMzsG92cTzfytneE8xmJwwS1CtuP",
          clientSecret: "jMywcYPlGTGA9Fd1Lt1eWbLQXJ5Tx19JbL4VBRC0",
          environment: "sandbox",
          redirectUri:
            "http://ec2-3-238-89-147.compute-1.amazonaws.com:5000/admin/quickbook/callback",
          //redirectUri: 'http://localhost:3000/admin/quickbook/callback',
          token: authResponse.token,
        });
      })
      .catch(function (e) { });
  }

  const PrimaryEmailAddr = {
    Address: req.body.email,
  };
  const PrimaryPhone = {
    FreeFormNumber: req.body.mobile,
  };
  const BillAddr = {
    CountrySubDivisionCode: "CA",
    City: "Mountain View",
    PostalCode: "94042",
    Line1: "123 Main Street",
    Country: "USA",
  };

  const insertdata = {
    FullyQualifiedName: req.body.name,
    PrimaryEmailAddr: PrimaryEmailAddr,
    PrimaryPhone: PrimaryPhone,
    Suffix: req.body.name,
    Title: req.body.name,
    MiddleName: req.body.name,
    Notes: req.body.name,
    FamilyName: req.body.name,
    BillAddr: BillAddr,
    CompanyName: req.body.name,

    GivenName: req.body.name,
  };

  oauthClientOrder
    .makeApiCall({
      url: "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365177497720/customer?minorversion=40",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insertdata),
    })
    .then(function (response) {
      console.log(response);

      var customerJSON = response.getJson();
      var quickBookCustomer = JSON.parse(customerJSON.Customer);
      res.json({
        qbid: quickBookCustomerID,
        id: quickBookCustomer.Id,
      });
      console.log("payload", customerJSON, quickBookCustomerID);
    })
    .catch(function (e) {
      res.status(400).json(e);
    });
});

router.get("/", (req, res) => {
  User.find()
    .then((user) => {
      res.json(user);
    })
    .catch((errors) => res.status(404).json(errors));
});

router.get(
  "/getuser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id })
      .then((user) => {
        res.json(user);
      })
      .catch((errors) => res.status(404).json(errors));
  }
);

router.post(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: req.body },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((err) => res.status(404).json({ error: "User Not Found" }));
  }
);




// basic user create without quickbook
router.post("/user-create", async (req, res) => {
  const { errors, isValid } = validateUserInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
    });

    // edited
    
        newUser
          .save()
          .then((user) => {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              userType: "user",
              mobile: user.mobile,
              password: req.body.password,
              // photo: user.photo,
              // quickbookID: user.quickbookID,
            }; //Create JWT Payload
            console.log("payload", payload);
            //Sign Token
            jwt.sign(payload, keys.secretOrKey, async (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                payload: payload,
              });
            });
          })
          .catch((err) => console.log(err));
      });
    })

  //   console.log(response);
  //   res.json(response.getJson())



router.post("/register", async (req, res) => {
  const { errors, isValid } = validateUserInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(async (user) => {
    if (user) {
      errors.email = "Email Already Exists";
      return res.status(400).json(errors);
    }
    //QUICK BOOK INTEGRATION PART
    // var quickAuthToken;
    // var getSetting = await Setting.findOne();
    // if (getSetting) {
    //   quickAuthToken = JSON.parse(getSetting.quickBook);
    // }
    // let oauthClientOrder = new OAuthClient({
    //   clientId: "AB2T4UWnpedrpGq33wumOOGMzsG92cTzfytneE8xmJwwS1CtuP",
    //   clientSecret: "jMywcYPlGTGA9Fd1Lt1eWbLQXJ5Tx19JbL4VBRC0",
    //   environment: "sandbox",
    //   redirectUri:
    //     "http://ec2-3-238-89-147.compute-1.amazonaws.com:5000/admin/quickbook/callback",
    //   //redirectUri: 'http://localhost:3000/admin/quickbook/callback',
    //   token: quickAuthToken,
    // });
    // if (!oauthClientOrder.isAccessTokenValid()) {
    //   oauthClientOrder
    //     .refresh()
    //     .then(async function (authResponse) {
    //       oauthClientOrder = new OAuthClient({
    //         clientId: "AB2T4UWnpedrpGq33wumOOGMzsG92cTzfytneE8xmJwwS1CtuP",
    //         clientSecret: "jMywcYPlGTGA9Fd1Lt1eWbLQXJ5Tx19JbL4VBRC0",
    //         environment: "sandbox",
    //         redirectUri:
    //           "http://ec2-3-238-89-147.compute-1.amazonaws.com:5000/admin/quickbook/callback",
    //         //redirectUri: 'http://localhost:3000/admin/quickbook/callback',
    //         token: authResponse.token,
    //       });
    //     })
    //     .catch(function (e) {
    //       errors.email = "Error Occured in Server Contact Admin";
    //       return res.status(400).json(errors);
    //     });
    // }

    // const PrimaryEmailAddr = {
    //   Address: req.body.email,
    // };
    // const PrimaryPhone = {
    //   FreeFormNumber: req.body.mobile,
    // };
    // const BillAddr = {
    //   CountrySubDivisionCode: "CA",
    //   City: "Mountain View",
    //   PostalCode: "94042",
    //   Line1: "123 Main Street",
    //   Country: "USA",
    // };

    // const insertdata = {
    //   FullyQualifiedName: req.body.name,
    //   PrimaryEmailAddr: PrimaryEmailAddr,
    //   PrimaryPhone: PrimaryPhone,
    //   Suffix: req.body.name,
    //   Title: req.body.name,
    //   MiddleName: req.body.name,
    //   Notes: req.body.name,
    //   FamilyName: req.body.name,
    //   BillAddr: BillAddr,
    //   CompanyName: req.body.name,

    //   GivenName: req.body.name,
    // };

    // oauthClientOrder
    //   .makeApiCall({
    //     url: "https://sandbox-quickbooks.api.intuit.com/v3/company/4620816365177497720/customer?minorversion=40",
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(insertdata),
    //   })
    //   .then(function (response) {
    //     var customerJSON = response.getJson();
    //     var quickBookCustomerID = customerJSON.Customer;
    //     console.log("payload", customerJSON, quickBookCustomerID);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      // photo: req.body.photo,
      // origin: "local",
      // quickbookID: quickBookCustomerID.Id,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then((user) => {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              userType: "user",
              mobile: user.mobile,
              // photo: user.photo,
              // quickbookID: user.quickbookID,
            }; //Create JWT Payload
            console.log("payload", payload);
            //Sign Token
            jwt.sign(payload, keys.secretOrKey, async (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token,
                payload: payload,
              });
            });
          })
          .catch((err) => console.log(err));
      });
    });
    //   console.log(response);
    //   res.json(response.getJson())
  })
    .catch(function (e) {
      errors.email = "Error Occured in Server Contact Admin";
      return res.status(400).json(errors);
    });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateUserLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.emailLogin;
  const password = req.body.passwordLogin;

  //Find the user by email
  User.findOne({ $or: [{ email }, { name: email }] }).then((user) => {
    //Check for user
    if (!user) {
      errors.emailLogin = "User Not Found";
      return res.status(404).json(errors);
    }
    //Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User matched
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: "user",
          mobile: user.mobile,
          photo: user.photo,
          quickbookID: user.quickbookID,
        }; //Create JWT Payload
        //Sign Token
        jwt.sign(payload, keys.secretOrKey, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            payload: payload,
          });
        });
      } else {
        errors.passwordLogin = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post("/googlelogin", async (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: "user",
        mobile: user.mobile,
        photo: user.photo,
      }; //Create JWT Payload
      //Sign Token
      jwt.sign(payload, keys.secretOrKey, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
          payload: payload,
        });
      });
    } else {
      const newUser = new User({
        name: req.body.displayName,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.id,
        photo: req.body.photoUrl,
        origin: "google",
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: "user",
                mobile: user.mobile,
                photo: user.photo,
              }; //Create JWT Payload
              //Sign Token
              jwt.sign(payload, keys.secretOrKey, async (err, token) => {
                //let testAccount = await nodemailer.createTestAccount();
                //   let transporter = nodemailer.createTransport({
                //       host: "smtp.gmail.com",
                //       port: 587,
                //       secure: false, // true for 465, false for other ports
                //       service: 'gmail',
                //       auth: {
                //         user:'tekycodz@gmail.com', // generated ethereal user
                //         pass: 'codz$321teky' // generated ethereal password
                //       }
                //     });

                //     // send mail with defined transport object
                //     let info = await transporter.sendMail({
                //       from: '"SMEJ" <info@smej.com>', // sender address
                //       to: req.body.email, // list of receivers
                //       subject: "OTP for Your Account", // Subject line
                //       text: `${req.body.otp} is OTP for Registered Account`, // plain text body
                //     });
                res.json({
                  success: true,
                  token: "Bearer " + token,
                  payload: payload,
                });
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
router.post("/applelogin", async (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: "user",
        mobile: user.mobile,
        photo: user.photo,
      }; //Create JWT Payload
      //Sign Token
      jwt.sign(payload, keys.secretOrKey, (err, token) => {
        res.json({
          success: true,
          token: "Bearer " + token,
          payload: payload,
        });
      });
    } else {
      const newUser = new User({
        name: req.body.displayName,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.id,
        photo: req.body.photoUrl,
        origin: "apple",
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: "user",
                mobile: user.mobile,
                photo: user.photo,
              }; //Create JWT Payload
              //Sign Token
              jwt.sign(payload, keys.secretOrKey, async (err, token) => {
                //let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  service: "gmail",
                  auth: {
                    user: "tekycodz@gmail.com", // generated ethereal user
                    pass: "codz$321teky", // generated ethereal password
                  },
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: '"SMEJ" <info@smej.com>', // sender address
                  to: req.body.email, // list of receivers
                  subject: "OTP for Your Account", // Subject line
                  text: `${req.body.otp} is OTP for Registered Account`, // plain text body
                });
                res.json({
                  success: true,
                  token: "Bearer " + token,
                  payload: payload,
                });
              });
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route GET  api/user/current
// @desc  Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      userType: req.user.userType,
    });
  }
);
//update password

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateUpdateInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) throw err;
        newpassword = hash;
        User.findByIdAndUpdate(req.user.id, { password: newpassword })
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      });
    });
  }
);

//forgot password
router.post("/forgot", (req, res) => {
  const { errors, isValid } = validateForgetInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  var secval = Math.floor(1000 + Math.random() * 9000);
  console.log("secval", secval);
  const newUser = new User({
    password: secval,
    mobile: req.body.mobile,
  });
  const mobileno = req.body.mobile;
  User.findOne({ mobile: mobileno }).then((user) => {
    //Check for user
    if (!user) {
      errors.mobile = "Mobile Number not found";
      return res.status(404).json(errors);
    }
    const truncate = mobileno.substring(1).replace(/ /g, "");
    console.log("remove" + truncate);
    sendOtp.send(truncate, "DLABSM", secval, function (error, data) {
      if (data.type == "success") {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            console.log("newuser password", newUser.password);
            if (err) throw err;
            newpassword = hash;
            User.findOneAndUpdate(
              { mobile: newUser.mobile },
              { $set: { password: newpassword } }
            )
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
        console.log("success", data);
      } else {
        if (data.type == "error") {
          return res.status(404).json(error);
        }
      }
      return data;
    });
  });
});

router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEditInput(req.body);
    //Check Validation
    if (!isValid) {
      //if Any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // const editdata = {
    //     name   :   req.body.name,
    //     description :   req.body.description,
    //     image :   req.body.image,
    //     cost :   req.body.cost,
    // };

    User.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body },
      { new: true }
    )
      .then((agents) => {
        if (!agents) {
          errors.agents = "User not found";
          return res.status(404).json(errors);
        }
        res.json(agents);
      })
      .catch((err) => res.status(404).json({ error: "User Not Found" }));
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.remove({ _id: req.body.id })
      .then((agent) => {
        if (!agent) {
          errors.agent = "User not found to delete";
          return res.status(404).json(errors);
        }
        res.json(agent);
      })
      .catch((err) => res.status(404).json({ error: "User Not Found" }));
  }
);

// @route GET api/users/search
// @desc  search users route
// @access private

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("it worked");
    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const response = await User.find({ ...keyword });
    // res.json({ msg: "hi" });
    res.json(response);
  }
);

module.exports = router;

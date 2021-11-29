const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const mongoose = require('mongoose');
const fs = require('fs');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('7f7707b84eee87b7ac79', 'd442b22760a00cc32377624db6028a59f58079c8e511378e715f4e9576cba95e');
//====================== Bigchain-db Connection ===============================

const driver = require('bigchaindb-driver');
const API_PATH = 'https://test.ipdb.io/api/v1/';
const conn = new driver.Connection(API_PATH);
const md5 = require('md5');
//===============================================================================
const date = require('date-and-time');

// Load User model
const User = require("../../models/User");

router.post("/verify_unique", (req, res) => {  
    // console.log(req);
    var unique = true;
    conn.searchAssets("table domain owner")
    .then( assets => {
        assets.forEach(item => {
           if (item.data.domainhashcode == md5(req.body.domain)){            
              unique = false;
           }
        });
        return res.json({
           status: "Verify Domain Unique",
           uniqueFlag: unique,
           success: true
        })
    })
    .catch(err => {
        console.log(err);
       return res.status(400).json({
           success: false
        })
    });  
});

router.post("/create_ipfs", (req, res) => {
  var content = "";
  content += "<html>";
  content += "<body>";
  content += "<p>";
  content += "This is domain for sale";
  content += "</p>";
  content += "<p>";
  content += "Domain : " + req.body.domain;
  content += "</p>";
  content += "<p>";
  content += "Price : " + req.body.price + " JIN";
  content += "</p>";
  content += "<p>";
  content += "QR Code: "
  content += "</p>";
  content += "<img id='qrcode' src = '" + req.body.qrcode + "' title = 'QR Code' width = '150' height = '150' />";
  content += "<p>";
  content += "Updated On : " + new Date();
  content += "</p>";
  content += "</body>";
  content += "</html>"
  
  var filename = req.body.domain + ".html";
  
  fs.writeFile(filename, content, function (err) {
    if (err) return console.log(err);    
  });
  const readableStreamForFile = fs.createReadStream('./' + filename);        
        const options = {
            pinataMetadata: {
                name: "Domain " + req.body.domain,
                keyvalues: {
                    customKey: 'customValue',
                    customKey2: 'customValue2'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
            //handle results here
            console.log(result);
            res.json({
               state: "Create IPFS Page",
               success: true,
               CID: result.IpfsHash
            });
        }).catch((err) => {
            //handle error here
            console.log(err);
        });      
})

router.post("/insert_owner_login", (req, res) => {
     const alice = new driver.Ed25519Keypair();
     const loginAsset = {
        type: "table owner login",
        walletaddress: req.body.wallet,
        password: md5(req.body.password),
        recovery: md5(req.body.recovery)
        // recoverphase: "foam,pumpkin,road,educate,valley,gain,unique,guess,nurse,small,doctor,return"
     }
     const tx1 = driver.Transaction.makeCreateTransaction(          
        loginAsset,
        { what: 'table owner login' },
        // A transaction needs an output
        [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(alice.publicKey))
        ],
        alice.publicKey
     );
     const txSigned1 = driver.Transaction.signTransaction(tx1, alice.privateKey);
     conn.postTransactionCommit(txSigned1)
    .then(result => {
        // const elem = document.getElementById('lastTransaction')
        // elem.href = API_PATH + 'transactions/' + txSigned.id
        // elem.innerText = txSigned.id
        console.log('Transaction', txSigned1.id, 'accepted');
        res.json({
            success: true
        })
     });
});

router.post("/insert_owner_domain", (req, res) => {
  console.log(req.body);
  const alice = new driver.Ed25519Keypair();
  const domainAsset = {
     type: "table domain owner",
     walletaddress: req.body.wallet,
     domain: req.body.domain,
     domainhashcode: md5(req.body.domain),
     ipfshash: req.body.ipfshash,
     price: req.body.price,
     created: Date.now(),
     updated: Date.now()
     // recoverphase: "foam,pumpkin,road,educate,valley,gain,unique,guess,nurse,small,doctor,return"
  }
  const tx1 = driver.Transaction.makeCreateTransaction(          
     domainAsset,
     { what: 'table domain owner' },
     // A transaction needs an output
     [ driver.Transaction.makeOutput(
         driver.Transaction.makeEd25519Condition(alice.publicKey))
     ],
     alice.publicKey
  );
  const txSigned1 = driver.Transaction.signTransaction(tx1, alice.privateKey);
  conn.postTransactionCommit(txSigned1)
 .then(result => {
     // const elem = document.getElementById('lastTransaction')
     // elem.href = API_PATH + 'transactions/' + txSigned.id
     // elem.innerText = txSigned.id
     console.log('Transaction', txSigned1, 'accepted');
     res.json({
         status: "Domain Register",
         success: true
     })
  });
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  
  var matchFlag = false;

  const wallet = req.body.wallet;
  const password = req.body.password;
  console.log(wallet);
  console.log(md5(password));
  conn.searchAssets("table owner login").then(async assets => {
      await assets.forEach(item => {            
          console.log(item.data);
          if (item.data.walletaddress == req.body.wallet){
            if (item.data.password == md5(req.body.password)){
                matchFlag = true;
              }
            }
          });                              
      }).then(() => {
        if (matchFlag){
          const payload = {
              // id: new mongoose.Types.ObjectId(),
              wallet: req.body.wallet
          };
          const token = jwt.sign(
              payload,
              keys.secretOrKey,
              {
                  expiresIn: 31556926 // 1 year in seconds
              }
          );
          
          return res.status(200).send({
              state: "login",
              msg: "Login Success!",
              success: true,
              token: "Bearer " + token
          });
          
        } else {
          return res.status(200).send({
            state: "login",
            msg: "Invalid Wallet or Password!",
            success: false,            
          });
        }
      })
});

module.exports = router;
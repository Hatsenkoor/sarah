const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const mongoose = require('mongoose');

const Whitelists = require("../../models/Whitelists");

router.post("/add_whitelist", (req, res) => {
    console.log(req.body);
    Whitelists.findOne({wallet: req.body.wallet}).then(data => {
        if (data) {
            return res.json({status: "add whitelist", success: false, msg: "wallet already exists"});
        } else {
            const newWhiteList = new Whitelists({
                wallet: req.body.wallet,
                email: req.body.email,
                confirmed: 0,
                opt_out: ""
            });
            newWhiteList.save();
        }
    })
})

module.exports = router;
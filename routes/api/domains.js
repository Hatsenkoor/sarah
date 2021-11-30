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

const Assets = require("../../models/Assets");

router.post("/get_domains_owner", (req, res) => {    
    var searchword = (req.body.searchword)? req.body.searchword: '';
    Assets.find({"data.type" : "table domain owner", "data.domain": { $regex: '.*' + searchword + '.*' }})
    .then(data => {
        res.json({
            status: "Get Domains Owner",
            success: true,
            domains: data
        }) 
    })
});

router.post("/modify_price", (req, res) => {
    console.log(req.body);
    const filter = {
        "data.type" : "table domain owner",
        "data.domain": req.body.domain
    }
    var update = {};
    var status = "";
    if (req.body.price){
        update = {
            "data.price": req.body.price
        }
        status = "Modify Price"
    }
    if (req.body.ipfshash){
        update = {
            "data.ipfshash": req.body.ipfshash
        }
        status = "Modify IPFS";
    }
    
    Assets.updateOne(filter, update).then(result =>{
        console.log(result);
        if (!result){
            return res.json({
                status: status,
                success: false
            });
        }   else {
            return res.json({
                status: status,
                success: true
            });
        }
    })
})

function retrieveTransaction(transactionId) {
    return new Promise(function (resolve, reject) {
        conn.searchAssets(transactionId).then(retrievedTransaction => {
            var data = {};
            data.asset = retrievedTransaction[0];
            getSortedTransactions(transactionId).then(metadata => {
                if (isArray(metadata)){
                    data.metadata = metadata[0].metadata;
                } else {
                    data.metadata = metadata;
                }
                resolve(data);
            });
        }).catch(err => {
            reject(new Error(err));
        });
    });
}

function isArray(what) {
    return Object.prototype.toString.call(what) === '[object Array]';
}

function getSortedTransactions(assetId) {
    var metadata = {};
    return conn.listTransactions(assetId)
    .then((txList) => {
        if (txList.length <= 1) {
            return txList;
        }
        const inputTransactions = [];
        txList.forEach((tx) => {
            for (var key in tx.metadata) {
                metadata[key] = tx.metadata[key];
            }
        })
        return metadata;
    })    
}

module.exports = router;
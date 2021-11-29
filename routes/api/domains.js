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

router.post("/get_domains_owner", (req, res) => {
    console.log(req.body.searchword);
    conn.searchAssets("table domain owner")
    .then( assets => {
        var temp = [];
        var h;        
             assets.forEach(item => {
                if (item.data.domain){
                    if (req.body.searchword){
                        let str = item.data.domain; 
                        if (str.indexOf(req.body.searchword) != -1){
                            temp.push(item);
                            h = 1;
                        }
                    } else {
                        temp.push(item);
                        h = 2;
                    }                                     
                }
            })
            console.log(temp)
            // .then(() => {
                res.json({
                    status: "Get Domains Owner",
                    success: true,
                    domains: temp
                })    
            // });
        });
});

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
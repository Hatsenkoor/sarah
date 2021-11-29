const driver = require('bigchaindb-driver');
const API_PATH = 'https://test.ipdb.io/api/v1/';
const conn = new driver.Connection(API_PATH);
const md5 = require('md5');
//===============================================================================
const date = require('date-and-time');

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
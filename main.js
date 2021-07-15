const express = require('express');
const crawler = require('./src/js/crawler');
const DNSUtils = require('./src/js/dns-utils');
var sslCertificate = require("get-ssl-certificate")
var mongoUtil = require('./src/js/mongoUtil');

mongoUtil.connectToServer(function(err, client) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        start();
    }
});


function insertIntoDB(data) {
    console.log("insertIntoDB called...");
    try {
        var db = mongoUtil.getDb();
        const headers = db.collection('headers');

        headers.find({ ip: data.ip }).toArray(function(err, results) {
            if (err) throw err;

            if (results.length == 0) {
                headers.insertOne(data, function(err, res) {
                    if (err) throw err;
                    console.log(data.ip + " Inserted into DB");
                });
            } else {
                headers.replaceOne({ ip: data.ip }, data, function(err, res) {
                    if (err) throw err;
                    console.log(data.ip + " Inserted into DB");
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function start() {

    var ips = ["44.240.209.207"];

    ips.forEach(ip => {

        new Promise((resolve, reject) => {

            let eachIp = {};
            eachIp["ip"] = ip;

            DNSUtils.reverseLookup(ip, function(err, domain, address, family) {
                eachIp["domain"] = domain;

                if (err == null) {
                    sslCertificate.get(domain).then(function(certificate) {

                        eachIp["certificate"] = certificate;

                        // var http = require('http');
                        // var options = { method: 'HEAD', host: domain, port: 80, path: '/' };
                        // var req = http.request(options, function(res) {
                        //     console.log(res.headers);
                        // });
                        // req.end();

                        crawler.crawl("https://" + certificate.subject.CN, function(data) {
                            eachIp["crawler"] = data;
                            resolve(eachIp);
                        });

                    });
                }
            });
        }).then(
            function(value) {
                insertIntoDB(value);
            },
            function(error) {
                console.log(error);
            }
        );
    });
}


/*
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});
*/

function gracefulShutdown() {
    mongoUtil.close();
}

function gracefulShutdownException() {
    console.log("uncaughtException");
    mongoUtil.close();
}

// This will handle process.exit():
process.on('exit', gracefulShutdown);

// This will handle kill commands, such as CTRL+C:
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGKILL', gracefulShutdown);

// This will prevent dirty exit on code-fault crashes:
process.on('uncaughtException', gracefulShutdownException);
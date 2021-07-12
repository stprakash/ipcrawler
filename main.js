//const express = require('express');
const crawler = require('./src/js/crawler');
const DNSUtils = require('./src/js/dns-utils');
var sslCertificate = require("get-ssl-certificate")

//const app = express();
//const port = 8000;

let ip = "44.240.209.207";
DNSUtils.reverseLookup(ip, function(err, domain, address, family) {
    if (err == null) {
        console.log("domain:" + domain);
        console.log("address:" + address);

        sslCertificate.get(domain).then(function(certificate) {
            console.log(certificate)
                // certificate is a JavaScript object

            console.log(certificate.issuer)

            console.log(certificate.subject)
            console.log(certificate.subject.CN)
            console.log(certificate.valid_from)
            console.log(certificate.valid_to)

            // var http = require('http');
            // var options = { method: 'HEAD', host: domain, port: 80, path: '/' };
            // var req = http.request(options, function(res) {
            //     console.log(res.headers);
            // });
            // req.end();

            crawler.crawl("https://" + certificate.subject.CN, function(data) {
                console.log("response came")
                console.log(data);
                process.exit(1);
            });

        });




    }

});





// app.get('/', (req, res) => {

//     //let url = "https://saner.secpod.com/";


//     // crawler.crawl(url, function(data) {
//     //     res.send("Hello" + data);
//     // });

// });

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`)
// });
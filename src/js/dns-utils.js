var dns = require('dns');

var DNSUtils = {
    reverseLookup: function(ip, callback) {
        console.log("ip:" + ip);
        dns.reverse(ip, function(err, domains) {
            if (err != null) callback(err);

            domains.forEach(function(domain) {
                dns.lookup(domain, function(err, address, family) {
                    callback(err, domain, address, family);
                });
            });
        });
    }
}

module.exports = DNSUtils
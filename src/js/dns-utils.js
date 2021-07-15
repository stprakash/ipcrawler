var dns = require('dns');

var DNSUtils = {
    reverseLookup: function(ip, callback) {
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
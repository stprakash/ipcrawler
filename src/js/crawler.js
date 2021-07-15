var Crawler = require("simplecrawler");
const utils = require("./utils");

var extractHeaders = (data, callback) => {
    if (data != undefined) {
        let responseJson = utils.safeStringify(data);
        let json = JSON.parse(responseJson);

        callback({
            servername: json.socket.servername,
            _host: json.socket._host,
            _httpMessage: {
                method: json.socket._httpMessage.method,
                path: json.socket._httpMessage.path,
                host: json.socket._httpMessage.host,
                protocol: json.socket._httpMessage.protocol,
            },
            httpVersion: json.httpVersion,
            headers: json.headers,
            url: json.url,
            method: json.method,
            statusCode: json.statusCode,
            statusMessage: json.statusMessage
        });
    }
}

module.exports = {

    crawl: function(url, callback) {

        var crawler = new Crawler(url);

        crawler.initialProtocol = "https";
        crawler.interval = 10000; // Ten seconds
        crawler.maxConcurrency = 3;
        crawler.maxDepth = 1;
        crawler.ignoreInvalidSSL = false;
        crawler.respectRobotsTxt = true;

        crawler.on("crawlstart", function() {
            //console.log("crawlstart");
        });

        crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
            //console.log("I just received %s (%d bytes)", queueItem.url, responseBuffer.length);
            //console.log("It was a resource of type %s", response.headers['content-type']);

            extractHeaders(response, function(data) {
                callback(data);
            });
        });

        crawler.on("fetch404", function(queueItem, response) {
            console.log("fetch404", queueItem.url, response.statusCode);
        });

        crawler.on("fetcherror", function(queueItem, response) {
            console.log("fetcherror", queueItem.url, response.statusCode);
        });

        crawler.on("fetchclienterror", function(queueItem, errorData) {
            console.log("fetcherror", queueItem.url, errorData);
        });

        crawler.on("complete", function(queueItem, responseBuffer, response) {
            //console.log("complete");
        });

        // For Debugging Pupose
        /*var originalEmit = crawler.emit;
        crawler.emit = function(evtName, queueItem) {
            crawler.queue.countItems({ fetched: true }, function(err, completeCount) {
                if (err) {
                    throw err;
                }

                crawler.queue.getLength(function(err, length) {
                    if (err) {
                        throw err;
                    }

                    console.log("fetched %d of %d — %d open requests, %d open listeners",
                        completeCount,
                        length,
                        crawler._openRequests.length,
                        crawler._openListeners);
                });
            });

            console.log(evtName, queueItem ? queueItem.url ? queueItem.url : queueItem : null);
            originalEmit.apply(crawler, arguments);
        };*/

        crawler.start();
    },

};
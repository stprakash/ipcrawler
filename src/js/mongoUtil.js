const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../../config/database.config');

var _db;
var _client;

module.exports = {

    connectToServer: function(callback) {
        MongoClient.connect(dbConfig.url, { useNewUrlParser: true }, function(err, client) {
            if (!err) {
                console.log('Successfully connected to MongoDB on port 27017');
                _client = client;
                _db = client.db(dbConfig.mainDatabase);
            }
            return callback(err);
        });
    },

    getDb: function() {
        return _db;
    },

    close: function() {
        _client.close(false, () => {
            console.log('MongoDb connection closed');
            process.exit(1);
        });
    }

}
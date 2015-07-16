var http = require("http");
var httpex = function () {
    var me = this;
    me.get = function (url, callback, callbackErr) {
        http.get(url, function (r) {
            var body = '';
            r.on('data', function (dat) {
                body += dat;
            });
            r.on('end', function () {
                if (callback instanceof Function)
                    callback(body);
            });
        }).on("error", callbackErr);
    }
}
module.exports = new httpex();
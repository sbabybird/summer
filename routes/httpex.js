var http = require("http");
var urlProc = require("url");
var httpex = function () {
    var me = this;
    // get/delete
    me.__accessA = function (name, url, callback, callbackErr) {
        console.log(name);
        http[name](url, function (r) {
            var body = '';
            r.on('data', function (dat) {
                body += dat;
            });
            r.on('end', function () {
                if (callback instanceof Function)
                    callback(body);
            });
        }).on("error", function (e) {
            console.log(e);
            if (callbackErr instanceof Function)
                callbackErr(e);
        });
    }
    // post/put
    me.__accessB = function (name, url, data, callback, callbackErr) {
        var dat = data;
        if (typeof (dat) != "string")
            dat = JSON.stringify(dat);
        var u = urlProc.parse(url);
        var options = {
            hostname: u.host,
            path: u.path,
            method: name,
            headers: {
                'version': '1.0',
                'x-requested-with': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Content-Length': dat.length
            }
        };
        var req = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = "";
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                if (callback instanceof Function ) {
                    callback(body);
                }
            });
        });
        req.on('error', function (e) {
            if (callbackErr instanceof Function ) {
                callbackErr(e);
            }
        });
        req.write(dat);
        req.end();
    }
    // get方法
    me.get = function (url, callback, callbackErr) {
        me.__accessA("get", url, callback, callbackErr);
    }
    // delete方法
    me.delete = function (url, callback, callbackErr) {
        me.__accessA("delete", url, callback, callbackErr);
    }
    // post方法
    me.post = function (url, data, callback, callbackErr) {
        me.__accessB("post", url, data, callback, callbackErr);
    }
    // put方法
    me.put = function (url, data, callback, callbackErr) {
        me.__accessB("put", url, data, callback, callbackErr);
    }
}
module.exports = new httpex();
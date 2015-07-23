var http = require("http");
var urlProc = require("url");
var Busboy = require('Busboy');
var httpex = function () {
    var me = this;
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
    // 转发文件
    me.transmitFile = function (url, req, callback, callbackErr) {
        var busboy = new Busboy({
            headers:req.headers
        });
        var v = {};
        busboy.on("field", function (key, value) {
            v[key] = value;
        })
        busboy.on('file', function (fieldname, fileStream, filename, encoding, mimetype) {
            var MultipartStream = require('multipart-form-stream');
            var stream = new MultipartStream({
                boundary: 'WebKitFormBoundaryb5Hn2xzCYq7V6wAS'
            });
            for (var a in v) {
                stream.addField(a, v[a]);
            }
            stream.addStream("file", filename, mimetype, fileStream);


            var u = urlProc.parse(url);
            u.method = "POST";
            u.headers = {
                'Content-Type': 'multipart/form-data; boundary=' + stream.getBoundary()
            }
            var rss = me.getRequest(u, callback, callbackErr);
            stream.on("data", function (dt) {
                //console.log(dt);
                rss.write(dt);
            });
            stream.on("end", function (dt) {
                rss.end();
            })
        });
        // busboy.on('finish', function () {
        // });
        req.pipe(busboy);
    }
    
    // get/delete
    me.__accessA = function (name, url, callback, callbackErr) {
        console.log(name);
        http[name](url, function (r) {
            r.setEncoding('utf8');
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
    me.getRequest = function (option, callback, callbackErr) {
        var req = http.request(option, function (res) {
            // console.log('STATUS: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = "";
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                if (callback instanceof Function) {
                    callback(body);
                }
            });
        });
        req.on('error', function (e) {
            if (callbackErr instanceof Function) {
                callbackErr(e);
            }
        });
        return req;
    }
    me.__accessB = function (name, url, data, callback, callbackErr) {
        var dat = data;
        if (typeof (dat) != "string")
            dat = JSON.stringify(dat);
        var u = url;
        if (typeof u === 'string') {
            u = urlProc.parse(url);
            u.headers = {
                'version': '1.0',
                'x-requested-with': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Content-Length': dat.length
            };
        }
        u.method = name;
        var req = http.request(u, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = "";
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                if (callback instanceof Function) {
                    callback(body);
                }
            });
        });
        req.on('error', function (e) {
            if (callbackErr instanceof Function) {
                callbackErr(e);
            }
        });
        req.write(dat);
        req.end();
    }
}
module.exports = new httpex();
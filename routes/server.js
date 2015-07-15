var ser = function () {
    var express = require("express");
    var me = this;
    me.router = express.Router();

    // 统一资源的配置
    me.config = {
        resUrl: ""
    };
    // 登录
    var http = require("http");
    me.router.get("/login", function (req, res) {
        //console.log(req.session);
        var url = me.config.resUrl + "?loginName=" + req.query.loginName + "&password=" + req.query.password;
        if (req.query.appCode != undefined && req.query.appCode != "")
            url += "&appCode=" + req.query.appCode;
        console.log(url);
        http.get(url, function (r) {
            var body = '';
            r.on('data', function (dat) {
                body += dat;
            });
            r.on('end', function () {
                req.session.user = JSON.parse(body);
                res.send(body);
            });
        });
    });

    // 判断是否登录，如果没登录，则统一返回错误
    me.__login = function (req, res) {
        if (req.session == undefined || req.session.user == undefined ||
            req.session.user.sessionid == undefined || req.session.user.sessionid == "") {
            var err = {};
            err.status = 500;
            err.message = "请先登录！";
            res.send(err);
            return false;
        }
        return true;
    }

    // 其它路由网址
    me.router.get("/*", function (req, res) {
        if (!me.__login(req, res))
            return;

        var url = req.session.user.appInfo.url + "/" + req.path + ";jsessionid=" + req.session.user.sessionid;
        var params = "";
        for (var p in req.query) {
            if (params != "") {
                params += "&";
            }
            params += p + "=" + req.query[p];
        }
        if (params != "")
            url += "?" + params;

        console.log(url);
        //return;
        http.get(url, function (r) {
            var body = '';
            r.on('data', function (dat) {
                body += dat;
            });
            r.on('end', function () {
                res.send(body);
            });
        });
    });
    return me;
};
module.exports = new ser();
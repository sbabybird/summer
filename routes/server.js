module.exports = function (router) {
    var fresource = require("./fresource");
    var me = this;
    me.router = router;
    me.loader = require("./loader");
    
    // 配置
    me.config = {
        // 统一资源网址
        resUrl: "",
        // 是否为调试模式
        debug: true
    };
    
    // 登录对外接口post/get
    me.router.post("/userlogin", function (req, res) {
        me.__login(req, res, req.body.loginName, req.body.password, req.body.appCode, req.body.frCode);
    }).get("/userlogin", function (req, res) {
        me.__login(req, res, req.query.loginName, req.query.password, req.query.appCode, req.query.frCode);
    });
    
    // 取得导航配置
    me.router.get("/nav", function (req, res) { me.__getNav(req, res); });
    // 其它路由网址get
    me.router.get("/*", function (req, res) {
        me.router.__accessA("get", req, res);
    });
    // 其它路由网址delete
    me.router.delete("/*", function (req, res) {
        me.router.__accessA("delete", req, res);
    });
    // 其它路由网址post
    me.router.post("/*", function (req, res) {
        if (req.headers["content-type"].indexOf("multipart") !== -1) {
            // 验证是否登录
            if (!me.__loginVerify(req, res))
                return;
            // 合成网址
            //var url = "http://192.168.1.181:8080/fwebruntime/plugin/upload;jsessionid=DD96DB369D32AB1E7AC9423EB73A5DF9";
            var url = req.session.user.appInfo.url + req.path + ";jsessionid=" + req.session.user.sessionid;
            url = me.__urlAddParam(url, req.query);
            console.log(url);
            me.__http.transmitFile(url, req, function (body) {
                console.log(body);
                res.send(body);
                res.end();
            }, function (err) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            });
            return;
        }
        me.router.__accessB("post", req, res);
    });
    // 其它路由网址put
    me.router.put("/*", function (req, res) {
        me.router.__accessB("put", req, res);
    });

    // 打印日志
    me.log = function (msg) {
        if (me.config.debug) {
            console.log(msg);
        }
    }
    
    // 取得导航信息
    me.__getNav = function (req, res) {
        if (!me.__loginVerify(req, res) || req.session.fresource == undefined)
            return;
        me.log(req.session.fresource);
        var nav = new fresource(req.session.fresource);
        var dat = nav.toNav(function (item) {
            var index = me.loader.findIndex(item.id);
            if (-1 == index)
                return true;
            var v = me.loader.plugins[index].plugin;
            if (v.text != undefined && v.text != "")
                item.text = v.text;
            item.icon = v.icon;
            item.url = v.url;

            return false;
        });
        me.log(dat);
        res.send(dat);
        res.end();
    }
    // 参数合并到网址上
    me.__urlAddParam = function (url, params) {
        if (params == undefined || params == null)
            return url;
        var pms = "";
        for (var p in params) {
            if (pms != "") {
                pms += "&";
            }
            pms += p + "=";
            if (params[p] != undefined)
                pms += params[p];
        }
        if (pms != "") {
            if (url.indexOf("?") != -1)
                url += "&";
            else
                url += "?"
            url += pms;
        }

        return url;
    }
    // 自动添加session的网址
    me.__urlWithSession = function (base, path, params, session) {
        var url = base + "/" + path + ";jsessionid=" + session;
        url = me.__urlAddParam(url, params);
        return url;
    }
    // http
    me.__http = require("./httpex");
    // 登录
    me.__login = function (req, res, user, password, appCode, frCode) {
        // 合成网址
        var url = me.__urlAddParam(me.config.resUrl, { loginName: user, password: password, appCode: appCode });
        me.log(url);
        
        // 登录到java后端
        me.__http.get(url, function (body) {
            var ret = JSON.parse(body);
            if (ret.state != undefined && ret.state == "error") {
                res.send(500, ret);
                res.end();
                return;
            }
            req.session.user = ret;
            var u = ret.appInfo.url;
            if (u[u.length - 1] == "/") {
                req.session.user.appInfo.url.length = u.length - 1;
            }
            console.log(req.session.user.appInfo.url);
            // 获取统一资源的权限
            url = me.__urlWithSession(req.session.user.appInfo.url, "fresource/api/resource", { parentCode: frCode }, req.session.user.sessionid);
            me.log(url);
            me.__http.get(url, function (dat) {
                try {
                    var fr = JSON.parse(dat);
                    req.session.fresource = fr;
                    me.log(dat);
                }
                catch (e) {
                    console.log(e);
                }
                if (me.config.debug)
                    res.send({ success: true, data: req.session.user, fresource: req.session.fresource });
                else
                    res.send({ success: true, data: req.session.user });
                res.end();
            });
        });
    }

    // 判断是否登录，如果没登录，则统一返回错误
    me.__loginVerify = function (req, res) {
        if (req.session == undefined || req.session.user == undefined ||
            req.session.user.sessionid == undefined || req.session.user.sessionid == "") {
            var err = {};
            err.status = 401;
            err.message = "请先登录！";
            res.status(401).send(err);
            res.end();
            return false;
        }
        return true;
    }

    // get/delete
    me.router.__accessA = function (name, req, res) {
        if (!me.__loginVerify(req, res))
            return;

        var url = req.session.user.appInfo.url + req.path + ";jsessionid=" + req.session.user.sessionid;
        url = me.__urlAddParam(url, req.query);
        me.log(url);

        me.__http[name](url, function (body) {
            res.send(body);
            res.end();
        }, function (err) {
            res.status(500).send(err);
            res.end();
        });
    }
    // 其它路由网址post   
    me.router.__accessB = function (name, req, res) {
        // 验证是否登录
        if (!me.__loginVerify(req, res))
            return;

        // 合成网址
        var url = req.session.user.appInfo.url + req.path + ";jsessionid=" + req.session.user.sessionid;
        console.log(url);
        console.log(req.body);
        // 发送数据到服务器
        me.__http[name](url, req.body, function (body) {
            console.log(body);
            res.send(body);
            res.end();
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
            res.end();
        });
    }
    return me;
};
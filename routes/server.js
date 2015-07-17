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

    me.log = function (msg) {
        if (me.config.debug) {
            console.log(msg);
        }
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
            req.session.user = JSON.parse(body);
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
    // 登录对外接口post/get
    me.router.post("/userlogin", function (req, res) {
        me.__login(req, res, req.body.loginName, req.body.password, req.body.appCode, req.body.frCode);
    }).get("/userlogin", function (req, res) {
        me.__login(req, res, req.query.loginName, req.query.password, req.query.appCode, req.query.frCode);
    });
    
    // 取得导航配置
    me.router.get("/nav", function (req, res) {
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
    });

    // 判断是否登录，如果没登录，则统一返回错误
    me.__loginVerify = function (req, res) {
        if (req.session == undefined || req.session.user == undefined ||
            req.session.user.sessionid == undefined || req.session.user.sessionid == "") {
            var err = {};
            err.status = 401;
            err.message = "请先登录！";
            res.send(401, err);
            res.end();
            return false;
        }
        return true;
    }

    // 其它路由网址get
    me.router.get("/*", function (req, res) {
        if (!me.__loginVerify(req, res))
            return;

        var url = req.session.user.appInfo.url + "/" + req.path + ";jsessionid=" + req.session.user.sessionid;
        url = me.__urlAddParam(url, req.query);
        me.log(url);

        me.__http.get(url, function (body) {
            res.send(body);
            res.end();
        });
    });
    
    // 其它路由网址post    
    me.router.post("/*", function (req, res) {

        console.log(req.files);

        res.end();
        // var formidable = require('formidable');
        // var form = new formidable.IncomingForm();   //创建上传表单
        // form.encoding = 'utf-8';		//设置编辑
        // form.uploadDir = './';	 //设置上传目录
        // form.keepExtensions = true;	 //保留后缀
        // form.maxFieldsSize = 2 * 1024 * 1024*1024;   //文件大小

        // form.parse(req, function (err, fields, files) {
        //     console.log(err);
        //     res.end();
        // });
        // if (!me.__loginVerify(req, res))
        //     return;
        // for( var a in req ){
        //     if ( req[a] instanceof Function )
        //     continue;
        //     console.log(a+req[a]);
        // }
        // req.on('data', function (dat) {
        //     console.log("dat"+dat);
        // });
        // req.on('end', function () {
        //     console.log("end");
        //     res.end();
        // });
        // var url = req.session.user.appInfo.url + "/" + req.path + ";jsessionid=" + req.session.user.sessionid;
        // url = me.__urlAddParam(url, req.query);
        // me.log(url);

        // me.__http.get(url, function (body) {
        //     res.send(body);
        //     res.end();
        // });
    });
    return me;
};

var loader = function () {
  var me = this;
  var path = require("path");
  var fs = require("fs");
  
  // 已加载的模块信息
  me.plugins = [];
  // 配置
  me.config = {};
  // 加载插件的路径
  me.config.paths = [path.join(__dirname, "../plugin/")];

  // 内部遍历加载模块
  me.__loaddir = function (cur, callback) {
    // 结束时要调用回调函数
    if (cur < 0 || cur >= me.config.paths.length) {
      if (callback instanceof Function)
        callback();
      return;
    }
    
    // 遍历当前目录
    var dir = me.config.paths[cur];
    fs.readdir(dir, function (err, files) {
      console.log(files);
      // 加载每个文件夹中的index.js
      for (var i in files) {
        var filePath = path.join(dir, files[i] + "/index.json");
        console.log(filePath);
        
        // 保存模块信息
        var plg = {};
        plg.dir = dir + files[i] + "/";
        plg.file = "index.json";
        
        // 文件存在时，载入，否则为undefined
        if (fs.existsSync(filePath)) {
          // 读文件解析
          try {
            var content = fs.readFileSync(filePath);
            plg.plugin = JSON.parse(content);
            console.log(plg.plugin);
          }
          catch (e) {
            console.log(e);
          }
        }

        me.plugins.push(plg);
      }
      me.__loaddir(cur + 1, callback);
    });
  }
  // 加载插件,默认一级目录下的index.json
  me.load = function (callback) {
    me.plugins.length = 0;
    me.__loaddir(0, callback);
  }

  // 根据id查找插件所在数组下标
  me.findIndex = function (id) {
    for (var i = 0; i < me.plugins.length; ++i) {
      if (me.plugins[i].plugin != undefined && me.plugins[i].plugin.id == id)
        return i;
    }
    return -1;
  }
}

module.exports = new loader();
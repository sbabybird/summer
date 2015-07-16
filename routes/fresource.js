module.exports = function (fresource) {
    var me = this;
    me.fresource = fresource;

    // 遍历
    me.foreach = function (callback, parent) {
        if (parent == undefined)
            parent = me.fresource;
        callback(parent);
        for (var i = 0; i < parent.children.length; ++i) {
            me.foreach(callback, parent.children[i]);
        }
    }
    
    // 生成导航所需要的对象 bool jumpCall(dat);用此函数判断是否跳过某节点
    me.toNav = function (jumpCall) {
        if (me.fresource == undefined)
            return [];
        var nav = [];
        
        // 获取第一层级
        var first = me.fresource[0].children;
        for (var i = 0; i < first.length; ++i) {
            var v = first[i];

            var item = {};
            item.id = v.code;
            item.name = v.title;
            item.icon = "";
            item.fn = [];
            
            // 获取第二层级
            var second = v.children;
            for (var j = 0; j < second.length; ++j) {
                var citem = second[j];
                var sub = {};
                sub.id = citem.code;
                sub.text = citem.title;
                sub.icon = "";
                sub.url = "";
                if (jumpCall instanceof Function && jumpCall(sub))
                    continue;

                item.fn.push(sub);
            }

            nav.push(item);
        }
        return nav;
    }
};
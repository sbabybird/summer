Ext.BLANK_IMAGE_URL = 'images/white.gif'; //定义空白图片（防止没有联网，图标出不来）

Summer = {}; //定义全局变量，承载全局函数

var westPanel = Ext.create('Ext.tab.Panel', {
  region: 'west',
  collapsible: true,
  width: 220,
  split: true,
  tabBarHeaderPosition: 1,
  tabBar: {
    flex: 20
  },
  items: [
    Ext.create('Summer.view.Navigation', {
      title: '功能导航',
      loadurl: 'test/nav.json'
    })
  ]
});

Ext.define('Summer.view.Widget', {
  extend: 'Ext.panel.Panel',
  xtype: 's-widget',
  loader: {
    renderer: 'component',
  },
  initComponent: function () {
    this.callParent();
        this.getLoader().load({
          url: this.loadurl,
        });
  }
});

Ext.define('Summer.view.Center', {
  extend: 'Ext.tab.Panel',
  dashboard: Ext.create('Ext.dashboard.Dashboard', {
    title: '工作台',
    stateful: false,
  }),
  initComponent: function () {
    this.callParent();
    this.add(this.dashboard);
    this.getLoader().load({
      url: this.loadurl
    });
  },
  loader: {
    renderer: function (loader, res, act) {
      var widgets = Ext.JSON.decode(res.responseText);
      var me = loader.getTarget();
      Ext.each(widgets, function (widget) {
        me.dashboard.add({
          xtype: 's-widget',
          collapsible: true,
          title: widget.name,
          hieght: widget.height,
          icon: widget.icon,
          columnWidth: widget.columnWidth,
          loadurl: widget.url,
        });
      });
      return true;
    }
  }
});

var centerPanel = Ext.create('Summer.view.Center', {
  region: 'center',
  activeTab: 0,
  loadurl: 'test/widget.json',
});

Summer.addTabs = function (id, name, url, icon) {
  if (Ext.getCmp(id)) {
    centerPanel.setActiveTab(id);
    return;
  }
  var tab = Ext.create('Ext.panel.Panel', {
    id: id,
    title: name,
    icon: icon,
    closable: true,
    loader: {
      url: url,
      autoLoad: true,
      renderer: 'component'
    }
  });
  centerPanel.add(tab).show();
};

Ext.onReady(function () {
  Ext.create('Ext.container.Viewport', {
    layout: 'border',
    items: [
      Ext.create('Summer.view.TitleBar', {
        region: 'north',
        logourl: 'test/logo.json', //从后台框架获取logo图片和title等信息的地址
        userurl: 'test/user.json',  //从后台框架获取用户头像和名称等信息的地址
      }),
      westPanel,
      {
        region: 'south',
        title: 'South Panel',
        collapsible: true,
        html: 'Information goes here',
        split: true,
        height: 100,
        minHeight: 100
      },
      {
        region: 'east',
        title: 'East Panel',
        collapsible: true,
        split: true,
        width: 150
      },
      centerPanel,
    ]
  });
});

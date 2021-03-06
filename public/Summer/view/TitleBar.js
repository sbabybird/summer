Summer.TAB_SETTINGS = 999;
Summer.TAB_USERCENTER = 1000;

Ext.define('Summer.view.LogoTitle', {
  extend: 'Ext.container.Container',
  xtype: 'logotitle',
  layout: 'column',
  height: '100%',
  autoEl: {
    tag: 'a',
    href: '#'
  },
  initComponent: function () {
    this.callParent();
    if (this.loadurl) {
      this.getLoader().load({url: this.loadurl});
    } else {
      console.error('Init LogoTitle Error! Please give me the logourl property!');
    }
  },
  loader: {
    renderer: function (loader, response, active) {
      var logo = Ext.JSON.decode(response.responseText);
      var img = Ext.create('Ext.Img', {
        src: logo.url,
        cls: 'logo',
      });
      loader.getTarget().add(img);
      var title = Ext.create('Ext.Component', {
        html: logo.title,
        cls: 'title',
      });
      loader.getTarget().add(title);
      loader.getTarget().getEl().dom.href = logo.href;
      return true;
    }
  }
});

Ext.define('Summer.view.UserInfo', {
  extend: 'Ext.button.Button',
  xtype: 'userinfo',
  cls: 'user_info',
  iconCls: 'user_photo',
  scale: 'medium',
  userMenu: [
    {
      cls: 'menu_list',
      text: '个人中心',
      handler: function() {
        Summer.addTab(Summer.TAB_USERCENTER, '个人中心', 'Summer/UserCenter.js', '');
      }
    },
    {
      cls: 'menu_list',
      icon: '',
      text: '设置中心',
      handler: function() {
        Summer.addTab(Summer.TAB_SETTINGS, '设置中心', 'Summer/Settings.js', '');
      }
    },
    {
      cls: 'menu_list',
      icon: '',
      text: '退出系统',
      handler: function () {
        Ext.MessageBox.confirm('系统提示', '您确定要退出吗？',
          function (a) {
            if (a == 'yes') {
              window.location = '/logout';
            }
          });
      }
    }
  ],
  initComponent: function () {
    this.callParent();
    if (this.loadurl) {
      this.getLoader().load({url: this.loadurl});
    } else {
      console.error('Init UserInfo Error! Please give the userurl property!');
    }
  },
  loader: {
    renderer: function (loader, response, active) {
      var user = Ext.JSON.decode(response.responseText);
      var me = loader.getTarget();
      me.setIcon(user.photo);
      me.setText(user.name);
      me.setMenu(me.userMenu);
      return true;
    }
  }
});

Ext.define('Summer.view.TitleBar', {
  extend: 'Ext.panel.Panel',
  xtype: 'titlebar',
  layout: 'border',
  region: 'north',
  border: 0,
  height: 46,
  bodyStyle: 'background: #438EB9',
  initComponent: function () {
    this.callParent();
    this.add({
      xtype: 'logotitle',
      region: 'west',
      loadurl: this.logoUrl,
    });
    this.add({
      xtype: 'userinfo',
      region: 'east',
      loadurl: this.userUrl,
    });
  }
});

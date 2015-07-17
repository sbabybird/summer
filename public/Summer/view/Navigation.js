/* global Summer */
/* global Ext */
Ext.define('Summer.view.Navigation', {
  extend: 'Ext.panel.Panel',
  xtype: 'navtree',
  layout: 'accordion',
  id:'Navigation',
  initComponent: function () {
    this.callParent();
    this.getLoader().load({
      url: this.loadurl,
      loadMask: true
    });
  },
  loader: {
    renderer: function (loader, res, act) {
      var navs = Ext.JSON.decode(res.responseText);
      var me = loader.getTarget();
      Ext.each(navs, function (nav) {
        var tree = Ext.create('Ext.tree.Panel', {
          title: nav.name,
          rootVisible: false,
          listeners: {
            itemclick: function (a, node) {
              var d = node.data;
              if (d.leaf == true) {
                Summer.addTabs(d.id, d.text, d.url, d.icon);
              }
            }
          }
        });
        Ext.each(nav.fn, function (fn) {
          tree.getStore().add({
            id: fn.id,
            text: fn.text,
            icon: fn.icon,
            url: fn.url,
            leaf: true,
          });
        });
        me.add(tree);
      });
      return true;
    }
  }
});

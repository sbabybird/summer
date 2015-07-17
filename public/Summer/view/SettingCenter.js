Ext.define('Summer.view.SettingCenter', {
	extend: 'Ext.panel.Panel',
	bodyBorder: false,
	scrollable: true,
	autoScroll: true,
	initComponent: function () {
		var me = this;
		var syssets = [];
		Ext.Ajax.request({
			async: false,
			url: '/mainFrame/sysset',
			success: function (response) {
				var items = Ext.JSON.decode(response.responseText);
				Ext.each(items, function (sysSet) {
					var item = {
						xtype: 's-widget',
						collapsible: true,
						title: sysSet.name,
						columnWidth: 1,
						loadurl: sysSet.url,
						icon: sysSet.icon
					};
					syssets.push(item);
				});
			}
		});
		me.items = syssets;
        me.callParent();
   	}
})
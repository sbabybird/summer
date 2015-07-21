Ext.define('Summer.view.SettingCenter', {
	extend: 'Ext.container.Container',
	layout: 'auto',
	height: 699,
	scrollable: true,
	initComponent: function () {
		var me = this;
		me.callParent();
		this.getLoader().load({
			url: this.loadurl
		});
   	},
	loader: {
		renderer: function (loader, res, act) {
			var widgets = Ext.JSON.decode(res.responseText);
			var me = loader.getTarget();
			Ext.each(widgets, function (widget) {
				me.add({
					xtype: 's-widget',
					title: widget.name,
					icon: widget.icon,
					loadurl: widget.url,
					columnWidth: 1,
				});
			});
			return true;
		}
	}
})
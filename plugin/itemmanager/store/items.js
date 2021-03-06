Ext.define('itemmanager.store.items', {
	extend: 'Ext.data.Store',
	model: 'itemmanager.model.items',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'cdp/item/all',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
        },
		sortParam: "sortField",
		pageSize: 10,
		directionParam: "sortOrder"
	}
})
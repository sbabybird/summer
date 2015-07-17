Ext.define('Summer.store.DataGrid', {
	extend: 'Ext.data.Store',
	model: 'Summer.model.DataGrid',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'api/hr/employees/address-list',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
        },
		pageParam: "pageIndex",
		limitParam: "pageSize",
		sortParam: "sortField",
		pageSize: 25,
		directionParam: "sortOrder"
	}
})
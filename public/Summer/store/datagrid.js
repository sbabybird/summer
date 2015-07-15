Ext.define('Summer.store.DataGrid', {
	extend: 'Ext.data.Store',
	model: 'Summer.model.DataGrid',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'Test/grid.json',
		reader: {
          type: 'json',
          root: 'data',
          totalProperty: 'total'
        }
	}
})
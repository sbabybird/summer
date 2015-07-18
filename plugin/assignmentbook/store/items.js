Ext.define('assignmentbook.store.items', {
	extend: 'Ext.data.Store',
	model: 'assignmentbook.model.items',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: 'cdp/taskBook/treeList',
		reader: {
			type: 'array'
        },
		sortParam: "sortField",
		pageSize: 10,
		directionParam: "sortOrder"
	}
})
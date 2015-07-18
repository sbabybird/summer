Ext.define('assignmentbook.view.items', {
	extend: 'Ext.grid.Panel',
	store: Ext.create('assignmentbook.store.items'),
	tbar: [
		{ xtype: "textfield", emptyText: "项目名称/简称/委托单位/项目类型" },
		{ xtype: "button", text: "搜索" }, "->",
		{ xtype: "button", text: "新增项目" }
	],
	columns: [
		{
			xtype: 'rownumberer', header: '序号', align: 'center', width: 60
		},
		{
			xtype: 'treecolumn', text: '年度', sortable: true, dataIndex: 'annual'
		},
		{
			text: '项目名称/任务书名称', dataIndex: 'name', sortable: true, width: 160
		},
		{
			text: '简称', dataIndex: 'shrot', sortable: true
		},
		{
			text: '项目编号/任务编号', dataIndex: 'code', sortable: true, width: 160
		},
		{
			text: '项目类型', dataIndex: 'type', sortable: true
		},
		{
			text: '项目属地', dataIndex: 'region', sortable: true
		},
		{
			text: '委托单位', dataIndex: 'client', sortable: true
		},
		{
			text: '委托阶段/现设计阶段', dataIndex: 'clientDesignPhase', sortable: true, width: 180
		},
		{
			text: '设总或项目负责人', dataIndex: 'clientLeader', sortable: true, width: 160
		}
	]
})
Ext.define('itemmanager.view.items', {
	extend: 'Ext.grid.Panel',
	store: Ext.create('itemmanager.store.items'),
	initComponent: function () {
		var me = this;
		this.initPagingBar(me);
		this.callParent();
	},
	tbar: [
		{ xtype: "textfield", emptyText: "项目名称/简称/委托单位/项目类型" },
		{ xtype: "button", text: "搜索" }, "->",
		{ xtype: "button", text: "新增项目" }
	],
	initPagingBar: function (me) {
		me.bbar = Ext.create('Ext.PagingToolbar', {
			store: me.store,
			displayInfo: true,
			displayMsg: '显示第{0} - {1}条记录 / 共{2}记录',
			emptyMsg: "没有记录",
		});
	},
	columns: [
		{
			xtype: "rownumberer",
			header: '序号',
			align: 'center',
			width: 50
		},
		{
			header: '年度',
			dataIndex: 'annual',
			align: 'center'
		},
		{
			header: '项目名称',
			dataIndex: 'name',
			align: 'center',
			tdCls: 'fc_669999'
		},
		{
			header: '简称',
			dataIndex: 'shrot',
			align: 'center'
		},

		{
			header: '项目类型',
			dataIndex: 'typeNameCN',
			align: 'center'
		},
		{
			header: '项目编号',
			dataIndex: 'code',
			align: 'center'
		},
		{
			header: '项目状态',
			dataIndex: 'statusNameCN',
			align: 'center'
		},
		{
			header: '项目属地',
			dataIndex: 'regionNameCN',
			align: 'center'
		},
		{
			header: '合作单位',
			dataIndex: 'cooperationUnit',
			align: 'center'
		},
		{
			header: '委托单位',
			dataIndex: 'client',
			align: 'center'
		},
		{
			header: '委托阶段',
			dataIndex: 'clientDesignPhaseNameCN',
			align: 'center'
		}
	]
})
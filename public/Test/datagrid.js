Ext.create('Summer.view.DataGrid', {
	sdata: Ext.create('Summer.data.Data', {
    dataUrl: 'plugin/all',
    buffered: true,
    pageSize: 20,
    fields: ['id', {name:'name', type: 'string'}, 'pluginVersion', 'sortNum', 'describe', 'isActive']
  }),
  columns: [
    {
      xtype: 'rownumberer',
      header: '序号',
      align: 'center',
      width: 60
    },
    {
      header: '插件名称',
      dataIndex: 'name',
      menuDisabled: false,
      width: 150
    },
    {
      header: '插件版本',
      dataIndex: 'pluginVersion',
      menuDisabled: false,
      editor: 'textfield',
      width: 130
    },
    {
        header: '排序号',
        dataIndex: 'sortNum',
        align: 'center',
        menuDisabled: false,
        width: 80
    },
    {
        header: '插件描述',
        dataIndex: 'describe',
        align: 'center',
        menuDisabled: true,
        flex:1
     },
    {
      header: '启动',
      dataIndex: 'isActive',
      align: 'center',
      menuDisabled: false,
      width: 100,
      sortable : false,
      renderer : function(value) {
		return "<input id='start' type='button' "+(value?"disabled='true'":"")+" value='启动'/>";
      },
    },
    {
      header: '停止',
      dataIndex: 'isActive',
      align: 'center',
      menuDisabled: true,
      sortable : false,
      renderer : function(value) {
		return "<input id='stop' type='button' "+(!value?"disabled='true'":"")+" value='停止'/>";
      },
    },
    {
        header: '刷新',
        dataIndex: 'update',
        align: 'center',
        menuDisabled: true,
		sortable : false,
		renderer : function() {
			return "<input id='update' type='button' value='刷新'/>";
		},
      }
  ]
})

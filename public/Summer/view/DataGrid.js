Ext.define('Summer.view.DataGrid', {
  extend: 'Ext.grid.Panel',
  columns: [
    {
      text: '姓名',
      dataIndex: 'userName'
    },
    {
      text: 'sex',
      dataIndex: 'sex'
    },
    {
      text: 'mobile',
      dataIndex: 'mobile'
    }
  ],
  initComponent: function () {
    var me = this;
    this.initStore(me);
    this.initPagingBar(me);
    this.callParent();
  },
  initStore: function (me) {
    me.store = Ext.create('Summer.store.DataGrid');
  },
  initPagingBar: function (me) {
    me.bbar = Ext.create('Ext.PagingToolbar', {
      store: me.store,
      displayInfo: true,
      displayMsg: '显示第{0} - {1}条记录 / 共{2}记录',
      emptyMsg: "没有记录",
    });
  },
});

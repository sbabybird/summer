Ext.define('Summer.controller.DataGrid', {
	extend: 'Ext.app.ViewController',
	init: function () {
		console.log('hello');
	},
	render: function () {
		console.log('hello2');
				},
				itemclick: function (td, cellIndex) {
		console.log(td);
				}
})
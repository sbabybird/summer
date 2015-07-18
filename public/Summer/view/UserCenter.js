Ext.define('Summer.view.UserCenter', {
    extend: 'Ext.container.Container',
    layout: 'column',
	padding:'10 20 10 10',
   defaults: {
        columnWidth: .5,
        height: 240,
        margin: '0 5 10 0',
        autoScroll: true,
        xtype: "panel",
    },

    initComponent: function() {
    	var me = this;
        var my ={
				layout: "column",
				columnWidth:1,
				defaults: {
						
						margin:'0 5 0 0',
						border: false,
						autoScroll: true
					},
		
				items: [{
					style:'text-align:center;',
					width:250,
					height:220,
                    html: '<img src=shared/images/head.jpg class="myhead" />',
					
				},
				{
					columnWidth: 1,
					border:false,
					 items:[{
							layout:'column',
							border:false,
							padding:30,
                            defaults:{
								layout: 'form',
								border:false,
								labelAlign: 'right',
        						labelWidth: 300,
								columnWidth:.5,
								anchor:'99%',
								style:'text-align:left;',
								padding:'0 5',				
																
							},
                            items:[
                                {items: [{xtype: 'displayfield',fieldLabel:'帐号',value:''}]},
                                {items: [{xtype: 'displayfield',fieldLabel:'姓名',value:''}]},
                                {items: [{xtype: 'displayfield',fieldLabel:'手机',value:''}]},
                                {items: [{xtype: 'displayfield',fieldLabel:'邮箱',value:''}]}
                                ]
                                }
                        ]
		
				}]
        };
        Ext.Ajax.request({
	    	async:false,
			url: 'fresource/api/userInfo',
			success: function(response){
				var user = Ext.JSON.decode(response.responseText);
				my ={
						layout: "column",
						columnWidth:1,
						defaults: {
								
								margin:'0 5 0 0',
								border: false,
								autoScroll: true
							},
				
						items: [{
							style:'text-align:center;',
							width:250,
							height:210,
		                    html: '<img src=shared/images/head.jpg class="myhead" />',
							
						},
						{
							columnWidth: 1,
							border:false,
							 items:[{
									layout:'column',
									border:false,
									padding:30,
		                            defaults:{
										layout: 'form',
										border:false,
										labelAlign: 'right',
		        						labelWidth: 300,
										columnWidth:.5,
										anchor:'99%',
										style:'text-align:left;',
										padding:'0 5',				
																		
									},
		                            items:[
		                                {items: [{xtype: 'displayfield',fieldLabel:'帐号',value:user.loginName}]},
		                                {items: [{xtype: 'displayfield',fieldLabel:'姓名',value:user.realName}]},
		                                {items: [{xtype: 'displayfield',fieldLabel:'手机',value:user.mobilePhone}]},
		                                {items: [{xtype: 'displayfield',fieldLabel:'邮箱',value:user.email}]},
		                                {items: [{xtype: 'textfield',inputType: 'password',fieldLabel:'原始密码',value:'',name:'pwd'}]},
		                                {items: [{xtype: 'textfield',inputType: 'password',fieldLabel:'新密码',value:'',name:'newpwd'}]},
		                                {items: [{xtype: 'textfield',inputType: 'password',fieldLabel:'确认密码',value:'',name:'repwd'}]}]},
		                                {columnWidth:1,height:30,width:90,style:'text-align:center;margin-left: 250px;',xtype: 'button',text:'确定',formBind: true,icon:'images/save.gif',handler:function(){
		                                	var pwd = document.getElementsByName('pwd');
		                                	var newpwd = document.getElementsByName('newpwd');
		                                	var repwd = document.getElementsByName('repwd');
		                                	if(newpwd[0].value != repwd[0].value){
		                                		Ext.Msg.alert('提示', '新密码与确认密码不一致！');
		                                		return false;
		                                	}
		                                	console.log({"newPass":repwd[0].value,"oldPass":pwd[0].value});
		                                	console.log(JSON.stringify({"newPass":repwd[0].value,"oldPass":pwd[0].value}));
		    								Ext.Ajax.request({           
		    								     url: 'fresource/api/updatePassword',    //请求地址   
		    								     method:"PUT",
		    								     jsonData:{"newPass":pwd[0].value,"oldPass":pwd[0].value},
		    								     params:{"newPass":repwd[0].value,"oldPass":pwd[0].value},
		    								     //成功时回调      
		    								     success: function(response, options) { 
		    								    	 Ext.Msg.alert('提示', '修改成功！');
		    								    },
		    								    failure:function(f,o){
		    								    	Ext.Msg.alert('错误', '修改失败！');
		    									}
		    								});  
		    							}}
		                        ]
				
						}]
		        };
			}
		});
        var syssets = [];
	    Ext.Ajax.request({
	    	async:false,
			url: 'mainFrame/mycenter',
			success: function(response){
				var items = Ext.JSON.decode(response.responseText);
				Ext.each(items, function(sysSet){
					var item = {
				            xtype: 's-widget',
				            collapsible: true,
				            title: sysSet.name,
				            columnWidth: 1,
				            loadurl: sysSet.url,
				            icon: sysSet.icon
				          };
					syssets.push(item);
				});
			}
		});
	    me.items = syssets;
	    me.items.unshift(my); 
        this.callParent();
    }
});
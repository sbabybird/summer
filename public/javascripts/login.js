Ext.onReady(function () {
    var form = Ext.create('Ext.form.Panel', {
        xtype: 'form-login',
        title: '登录',
        frame: true,
        width: '30%',
        bodyPadding: 10,
        layout: 'form',
        region: 'center',
        defaultType: 'textfield',
        url: '/api/login',
        items: [
            {
                xtype: 'textfield',
                fieldLabel: '用户名',
                name: 'loginName',
                emptyText: '0005'
            },
            {
                xtype: 'textfield',
                fieldLabel: '密码',
                name: 'password',
                emptyText: '123456',
                inputType: 'password'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'APPCODE',
                name: 'appCode',
                emptyText: 'cdp'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'FRCODE',
                name: 'frCode',
                emptyText: 'root'
            }
        ],
        login: function () {
            var form = this.getForm();
            form.submit({
                success: function (form, action) {
                    window.location = '/';
                },
                failure: function (form, action) {
                    Ext.Msg.alert('登录失败', action.result ? action.result.message : 'No response');
                }
            });
        },
        buttons: [
            {
                text: '登录',
                handler: function() {
                    this.up('form').login();
                }
            }
        ],
        listeners: {
            afterRender: function (thisForm, options) {
                this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                    enter: thisForm.login,
                    scope: this
                });
            }
        }

    });

    Ext.create('Ext.Viewport', {
        layout: 'center',
        padding: 0,
        items: [
            form
        ]
    });
});
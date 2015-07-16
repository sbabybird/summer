Ext.onReady(function () {
    var form = Ext.create('Ext.form.Panel', {
        xtype: 'form-login',
        title: 'Login',
        frame: true,
        width: 320,
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
                emptyText: 'user id'
            },
            {
                xtype: 'textfield',
                fieldLabel: '密码',
                name: 'password',
                emptyText: 'password',
                inputType: 'password'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'APPCODE',
                name: 'appCode'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'FRCODE',
                name: 'frCode',
                emptyText: 'webERP'
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
        layout: 'border',
        padding: 0,
        items: [
            form
        ]
    });
});
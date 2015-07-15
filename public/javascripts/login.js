Ext.onReady(function () {
    var form = Ext.create('Ext.form.Panel',{
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
                fieldLabel: 'UserID',
                name: 'loginName',
                emptyText: 'user id'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Password',
                name: 'password',
                emptyText: 'password',
                inputType: 'password'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'APICODE',
                name: 'appCode',
                emptyText: 'APPCODE'
            }
        ],
        buttons: [
            {
                text: 'Submit',
                handler: function () {
                    var form = this.up('form').getForm();
                    form.submit( {
                        success: function (form, action) {
                            window.location = '/';
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                        }
                    });
                }
            }
        ]

    });

    Ext.create('Ext.Viewport', {
        layout: 'border',
        padding: 0,
        items: [
            form
        ]
    });
});
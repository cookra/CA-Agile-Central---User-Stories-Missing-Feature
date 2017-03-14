Ext.define('App.Layout', {
    _create: function (o) {
        if (o.type === 'btn') {
            console.log(o);
            var object = Ext.create('Ext.button.Button', {
                text: o.text,
                margin: o.margin,
                cls: o.cls,
                style: {
                    backgroundColor: o.color,
                },
                listeners: {
                    afterrender: function (v) {
                        v.el.on('click', function () {
                            console.log('[' + o.type + '] Clicked');
                            Ext.create('App.Emailer')._emailer(MySharedData.supportArray, a_context_User, a_context_Project, a_context_Workspace);
                        });
                    },
                    scope: this
                },
            });
            return object;
        } else if (o.type === 'con') {
            console.log('CONTAINER ',o);
            var object = Ext.create('Ext.container.Container', {
                layout: o.layout,
                align: o.align,
                height: o.height,
                width: o.height,
                border: o.border,
                id: o.id,
                itemId: o.itemId,
                margin: o.margin,
                padding: o.padding,
                html: o.html,
                cls: o.cls,
                style: {
                    background: o.bg_color,
                },
                layoutConfig: {
                    align: o.align,
                },
            });
            return object;
        } else if (o.type === 'pan') {
            console.log(o);
            var object = Ext.create('Ext.panel.Panel', {
                layout: o.layout,
                align: o.align,
                height: o.height,
                width: o.width,
                border: o.border,
                id: o.id,
                itemId: o.itemId,
                margin: o.margin,
                padding: o.padding,
                html: o.html,
                bodyPadding: o.bodyPadding,
                cls: o.cls,
                flex: o.flex,
                style: {
                    background: o.color,
                },
            });
            return object;
        } else if (o.type === 'udd') {
            console.log(o);
            var object = Ext.create('Rally.ui.combobox.UserSearchComboBox', {
                storeConfig: {
                    model: o.model
                },
                fieldLabel: o.fieldLabel,
                project: o.project,
                itemId: o.itemId,
                id: o.id,
                margin: o.margin,
                noEntryText: '-- All --',
                defaultSelectionPosition: 'first',
                listeners: {
                    select: function () {
                        console.log('clicked');
                        this._mask('myInfoPanel');
                        this._kickoff('User');
                    },
                    scope: this
                }
            });
            return object;
        } else if (o.type === 'idd') {
            console.log(o);
            var object = Ext.create('Rally.ui.combobox.PortfolioItemTypeComboBox', {

                itemId: o.itemId,
                fieldLabel: o.fieldLabel,
                labelAlign: o.labelAlign,
                id: o.id,
                margin: o.margin,
                listeners: {
                    select: function () {
                        console.log('clicked');
                        this._mask('myInfoPanel');
                        this._kickoff('User');
                    },
                    scope: this
                }
            });
            return object;
        } else if (o.type === 'ser') {
            console.log(o);
            var object = Ext.create('Rally.ui.combobox.SearchComboBox', {
                storeConfig: {
                    model: o.model
                },
                itemId: o.itemId,
                fieldLabel: o.fieldLabel,
                labelAlign: o.labelAlign,
                id: o.id,
                margin: o.margin,
                width: o.width,
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() === e.ENTER) {
                            console.log('enter');
                            this._mask('myInfoPanel');
                            this._kickoff('Search');
                        }
                    },
                    select: function () {
                        console.log('select');
                        this._mask('myInfoPanel');
                        this._kickoff('Search');
                    },
                    scope: this
                }
            });
            return object;
        }else if (o.type === 'box') {
            console.log(o);
            var object = Ext.create('Ext.Component', {
                height: o.height,
                width: o.width,
                id: o.id,
                margin: o.margin,
                autoEl: {
                    tag: 'div',
                    cls: 'myInfoPanel',
                    html: "",
                },
                flex:1,
            });
            return object;
        }
    }
});
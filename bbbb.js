
Cyber Sec Risks
Plan
Track
Quality
Portfolio
Reports
User Actions
*** Risks LogSHARED

RISKS LOG




CA Agile Central|About|Support|Legal
          
SOURCE CODE: RISKS LOG

<!DOCTYPE html>
<html>
<head>
    <title>Risk Submit Form</title>
    <!--  (c) 2015 Rally Software Development Corp.  All Rights Reserved. -->
    <!--  Build Date: Mon Feb 13 2017 17:36:59 GMT+0000 (GMT) -->
    
    <script type="text/javascript">
        var APP_BUILD_DATE = "Mon Feb 13 2017 17:36:59 GMT+0000 (GMT)";
        var CHECKSUM = 97503528511;
    </script>
    
    <script type="text/javascript" src="/apps/2.1/sdk-debug.js"></script>

    <script type="text/javascript">
        Rally.onReady(function() {
             
/**
 * A link that pops up a version dialog box
 */

Ext.define('Rally.technicalservices.InfoLink',{
    extend: 'Rally.ui.dialog.Dialog',
    alias: 'widget.tsinfolink',
    
    /**
     * @cfg {String} informationHtml
     * Additional text to be displayed on the popup dialog (for exmaple,
     * to add a description of the app's use or functionality)
     */
    informationHtml: null,
    
    /**
     * 
     * cfg {String} title
     * The title for the dialog box
     */
    title: "Build Information",
    
    defaults: { padding: 5, margin: 5 },

    closable: true,
     
    draggable: true,

    autoShow: true,
   
    width: 350, 
    
    initComponent: function() {
        var id = Ext.id(this);
        this.title =  "<span class='icon-help'> </span>" + this.title;
        this.callParent(arguments);
    },
    
    _generateChecksum: function(string){
        var chk = 0x12345678,
            i;
        string = string.replace(/var CHECKSUM = .*;/,"");
        string = string.replace(/\s/g,"");  //Remove all whitespace from the string.
        
        for (i = 0; i < string.length; i++) {
            chk += (string.charCodeAt(i) * i);
        }
    
        return chk;
    },
    
    _checkChecksum: function(container) {
        var deferred = Ext.create('Deft.Deferred');
        var me = this;
        
        Ext.Ajax.request({
            url: document.URL,
            params: {
                id: 1
            },
            success: function (response) {
                text = response.responseText;
                if ( CHECKSUM ) {
                    if ( CHECKSUM !== me._generateChecksum(text) ) {
                        deferred.resolve(false);
                        return;
                    }
                }
                deferred.resolve(true);
            }
        });
        
        return deferred.promise;
    },
    
    afterRender: function() {
        var app = Rally.getApp();
        
        if (! app.isExternal() ) {
                
            this._checkChecksum(app).then({
                scope: this,
                success: function(result){
                    if ( !result ) {
                        this.addDocked({
                            xtype:'container',
                            cls: 'build-info',
                            padding: 2,
                            html:'<span class="icon-warning"> </span>Checksums do not match'
                        });
                    }
                }
            });
        } else {
            this.addDocked({
                xtype:'container',
                cls: 'build-info',
                padding: 2,
                html:'... Running externally'
            });
        }
        this.callParent(arguments);
    },
    
    beforeRender: function() {
        var me = this;
        this.callParent(arguments);

        if (this.informationHtml) {
            this.addDocked({
                xtype: 'component',
                componentCls: 'intro-panel',
                padding: 2,
                html: this.informationHtml
            });
        }
        
        this.addDocked({
            xtype:'container',
            cls: 'build-info',
            padding: 2,
            html:"This app was created by the Rally Technical Services Team."
        });
        
        if ( APP_BUILD_DATE ) {
            this.addDocked({
                xtype:'container',
                cls: 'build-info',
                padding: 2,
                html:'Build date/time: ' + APP_BUILD_DATE
            });
        }
    }
});

/*
 */
Ext.define('Rally.technicalservices.Logger',{
    constructor: function(config){
        Ext.apply(this,config);
    },
    log: function(args){
        var timestamp = "[ " + Ext.util.Format.date(new Date(), "Y-m-d H:i:s.u") + " ]";
        //var output_args = arguments;
        //output_args.unshift( [ "[ " + timestamp + " ]" ] );
        //output_args = Ext.Array.push(output_args,arguments);
        
        var output_args = [];
        output_args = Ext.Array.push(output_args,[timestamp]);
        output_args = Ext.Array.push(output_args, Ext.Array.slice(arguments,0));

        window.console && console.log.apply(console,output_args);
    }

});

Ext.define('Rally.technicalservices.AttachmentEditor',{
    extend: 'Ext.panel.Panel',
    alias: 'widget.tsattachmenteditor',
    height: 200,
    width: '100%',
    record: undefined,

    constructor: function (config) {
        this.mergeConfig(config);
        this.callParent([this.config]);
    },
    initComponent: function(){
        this.callParent(arguments);

        this._store = Ext.create('Ext.data.Store',{
            fields: ['filename','content','description','contentType'],
            data: []
        });

        this.add({
            xtype: 'rallygrid',
            columnCfgs: this._getColumnCfgs(),
            showPagingToolbar: false,
            showRowActionsColumn: false,
            store: this._store,
            emptyText: 'No Attachments',
            hideHeaders: true
        });

        this.add({
            xtype: 'filebutton',
            text: 'Upload',
            margin: 10,
            cls: 'secondary rly-small',
            listeners: {
                change: this.addFile,
                scope: this

            }
        });


    },
    addFile: function(e, value, filepath){
        //var formData = new FormData();
        //formData.append('file', e.fileInputEl.dom.files[0]);
        //console.log('formData', formData, 'file', e.fileInputEl.dom.files[0]);
        //
        var me = this;
        var f = e.fileInputEl.dom.files[0];
        var filename = f.name || filepath.split(/\/|\\/).pop(),
            contentType = (f.type && f.type.length > 0) ? f.type : "text/plain";
        var reader = new FileReader();
        console.log('readAsBinaryString', e, f);
        reader.onload = function(fi){
            console.log('f onload', reader.result);
            var content64 = window.btoa(((reader.result)));
            console.log('f onload', content64);
            me._store.add({filename: filename, description: '', content: content64, contentType: contentType});
        }
        reader.readAsBinaryString(f);


    },
    removeFile: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        this._store.remove(rec);
    },
    _getColumnCfgs: function(){
        var me = this;
        return [{
            xtype:'actioncolumn',
            width:40,
            items: [{
                icon: '/slm/js-lib/rui/builds/rui/resources/css/images/trash-icon.png',
                tooltip: 'Remove file',
                scope: me,
                handler: me.removeFile
            }]
        },{
            dataIndex: 'filename',
            text: 'File',
            flex: 1,
            editor: {
                xtype: 'filefield',
                buttonConfig: {
                    cls: 'rly-small secondary'
                }
            },
            renderer: function(v,m,r){
                if (v == null){
                    return 'Click to Add...'
                }
                return v;
            }
        },{
            dataIndex: 'name',
            text: 'Name'
        },{
            dataIndex: 'description',
            text: 'Description'
        }];
    },
    getValue: function(){
        return this._store.data.items;
    }

});

(function () {
    var Ext = window.Ext4 || window.Ext;

    var userSearchComboBox = function(field, record, initToContextUser) {
        var project = Rally.data.util.Record.getProject(record);
        var currentUser = record.get(field.name);
        if (_.isObject(currentUser)) {
            currentUser = currentUser._ref;
        }
        if (initToContextUser && record.phantom && !currentUser) {
            currentUser = Rally.environment.getContext().getUser()._ref;
            record.set(field.name, currentUser);
        }

        return Ext.create('Rally.ui.combobox.UserSearchComboBox', {
            project: project,
            name: field.name,
            value: currentUser,
            bubbleEvents: ['select'],
            triggerWrapCls: 'fullwidth',
            plugins: [
                {
                    xclass: 'Rally.ui.detail.plugins.LoadingMonitor'
                }
            ]
        });
    };

    var buildNumberField = function(field, record) {
        var value = Number(record.get(field.name)) || 0;
        return Ext.create('Rally.ui.NumberField', {
            name: field.name,
            displayName: field.displayName,
            value: value,
            labelAlign: 'right',
            height: getDefaultHeight(),
            field: field,
            hideTrigger: true,
            clientMetrics: {
                event: 'blur',
                description: 'field blur'
            }
        });
    };

    var buildPercentDoneBy = function(percentDoneTemplateName, field, record) {
        var tpl = Ext.create(percentDoneTemplateName);
        return Ext.create('Ext.Component', {
            data: record.data,
            tpl: tpl,
            maskOnDisable: false,
            cls: 'percent-done',
            listeners: {
                afterrender: function() {
                    var el = this.getEl();
                    el.on('click', function() {
                        Ext.create('Rally.ui.popover.PercentDonePopover', {
                            target: el,
                            percentDoneData: Ext.applyIf({
                                Notes: "",                                      // Empty string so that NOTES section will not display
                                Release: record.get('Release') || {},           // Avoid fetching release
                                PortfolioItemTypeOrdinal: record.self.ordinal   // Ditto
                            }, record.data),
                            percentDoneName: field.name
                        });
                    });
                }
            }
        });
    };

    var buildDisplayColorField = function (field, record) {
        return Ext.create('Rally.ui.detail.view.DisplayColorField', {
            field: field,
            record: record,
            editable: Rally.ui.detail.DetailHelper.isDetailPageFieldEditable(field, record)
        });
    };

    var buildStateField = function (field, record) {
        return Ext.create('Rally.ui.detail.view.StateField', {
            field: field,
            record: record
        });
    };

    var buildTargetProjectEditor = function(field, record) {
        var project = record.get(field.name);
        if (record.phantom && project === "") {
            project = Rally.environment.getContext().getProject();
        }
        return Ext.create('Rally.ui.detail.view.TargetProjectField', {
            name: field.name,
            milestoneRecord: record,
            value: Rally.util.Ref.getRelativeUri(project),
            editable: Rally.ui.MilestoneTargetProjectPermissionsHelper.canEdit(record)
        });
    };

    var defaultAllowNoEntry = function(field, record) {
        return !field.required || !record.get(field.name);
    };

    function constrainedComboBox(field, record, config) {
        return Ext.widget(Ext.apply({
            xtype: 'rallyfieldvaluecombobox',
            name: field.name,
            value: record.get(field.name),
            field: field,
            labelAlign: 'right',
            labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
            labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
            width: '75%',
            minWidth: 200,
            editable: false,
            allowNoEntry: defaultAllowNoEntry(field, record),
            useNullForNoEntryValue: true,
            plugins: [
                {
                    xclass: 'Rally.ui.detail.plugins.LoadingMonitor'
                }
            ]
        }, config));
    }
    function buildTimeboxFilter(timebox) {
        var filter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'State',
            operator: '!=',
            value: 'Accepted'
        });
        if (timebox && _.isString(timebox._refObjectName)) {
            filter = filter.or(Ext.create('Rally.data.wsapi.Filter', {
                property: 'Name',
                operator: '=',
                value: timebox._refObjectName
            }));
        }
        return filter;
    }
    function milestoneField(field, record, readOnly) {
        return Ext.create('Rally.ui.detail.view.MilestonesField', {
            field: field,
            record: record,
            readOnly: readOnly
        });
    }
    function getDefaultHeight(){
        return 25;
    }

    /**
     * @private
     */
    Ext.define('Rally.technicalservices.DetailEditorFactory', {
        requires: [
            'Rally.data.util.Record',
            'Rally.data.wsapi.Filter',
            'Rally.ui.combobox.FieldValueComboBox',
            'Rally.ui.detail.DetailHelper',
            'Rally.ui.detail.view.DetailWebLinkField',
            'Rally.ui.detail.view.DetailNumberField',
            'Rally.ui.detail.view.StateField',
            'Rally.ui.detail.view.DetailReadOnlyRefreshingField',
            'Rally.ui.detail.view.ReadyButton',
            'Rally.ui.renderer.template.progressbar.PercentDoneByStoryCountTemplate',
            'Rally.ui.renderer.template.progressbar.PercentDoneByStoryPlanEstimateTemplate',
            'Rally.ui.popover.PercentDonePopover',
            'Rally.ui.detail.view.MilestonesField',
            'Rally.util.Ref',
            'Rally.ui.combobox.ProjectComboBox'
        ],

        singleton: true,

        labelWidth: 150,
        labelCls: 'tslabel',
        controlWidth: '90%',
        padding: 0,

        getEditor: function (field, record, item_id, margin, field_label) {
            var editor;
            if (this.fieldEditors[field.name]) {
                editor = this.fieldEditors[field.name](field, record);
            } else if (field.attributeDefinition && this.typeEditors[field.attributeDefinition.AttributeType.toLowerCase()]) {
                editor = this.getEditorByType(field, record);
            } else {
                editor = this.defaultRenderer(field, record);
            }

            editor.addCls('detailFieldEditor');
            editor.itemId = item_id;
            editor.fieldLabel = field_label;
            editor.margin = margin;
            editor.labelAlign = 'right';

            return editor;
        },

        getEditorByType: function (field, record) {
            return this.typeEditors[field.attributeDefinition.AttributeType.toLowerCase()](field, record);
        },

        defaultRenderer: function (field, record) {
            return this.typeEditors['string'](field, record);
        },

        fieldEditors: {

            Attachments: function(field, record){

                return Ext.create('Rally.technicalservices.AttachmentEditor',{
                    record: record,
                    title: field.displayName
                });
            },

            Iteration: function (field, record) {

                var currentIteration = record.get(field.name);

                return Ext.create('Rally.ui.combobox.IterationComboBox', {
                    name: field.name,
                    value: currentIteration,
                    allowNoEntry: defaultAllowNoEntry(field, record),
                    showArrows: false,
                    defaultSelectionToFirst: true,
                    defaultToCurrentTimebox: false,
                    labelAlign: 'right',
                    storeConfig: {
                        remoteFilter: true,
                        filters: [
                            buildTimeboxFilter(currentIteration)
                        ],
                        context: {
                            project: Rally.data.util.Record.getProject(record),
                            projectScopeUp: false,
                            projectScopeDown: false
                        }
                    },
                    plugins: [
                        {
                            xclass: 'Rally.ui.detail.plugins.LoadingMonitor'
                        }
                    ]
                });
            },

            Milestones: function(field, record) {
                var readOnly = !Rally.ui.detail.DetailHelper.isDetailPageFieldEditable(field, record);
                return milestoneField(field, record, readOnly);
            },

            Owner: function(field, record) {
                return userSearchComboBox(field, record, record.isUserStory());
            },

            Release: function (field, record) {
                var currentRelease = record.get(field.name);
                return Ext.create('Rally.ui.combobox.ReleaseComboBox', {
                    name: field.name,
                    value: currentRelease,
                    allowNoEntry: defaultAllowNoEntry(field, record),
                    showArrows: false,
                    defaultSelectionPosition: 'first',
                    defaultToCurrentTimebox: false,
                    labelAlign: 'right',
                    storeConfig: {
                        remoteFilter: true,
                        filters: [
                            buildTimeboxFilter(currentRelease)
                        ],
                        context: {
                            project: Rally.data.util.Record.getProject(record),
                            projectScopeUp: false,
                            projectScopeDown: false
                        }
                    },
                    plugins: [
                        {
                            xclass: 'Rally.ui.detail.plugins.LoadingMonitor'
                        }
                    ]
                });
            },
        },

        typeEditors: {

            'boolean': function (field, record) {
                var choices = Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {value: true, display: 'Yes'},
                        {value: false, display: 'No'}
                    ]
                });

                return Ext.create('Rally.ui.combobox.ComboBox', {
                    name: field.displayName,
                    store: choices,
                    queryMode: 'local',
                    displayField: 'display',
                    valueField: 'value',
                    width: '25%',
                    minWidth: 200,
                    labelAlign: 'right',
                    labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                    labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                    value: record.get(field.name),
                    defaultSelectionPosition: 'last'
                });
            },
            date: function (field, record) {

                return Ext.create('Rally.ui.DateField', {
                    format: Rally.util.DateTime.getUserExtDateFormat(),
                    validateOnChange: false,
                    name: field.displayName,
                    value: record.get(field.name),
                    width: '25%',
                    minWidth: 200,
                    labelAlign: 'right',
                    labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                    labelCls: Rally.technicalservices.DetailEditorFactory.labelCls
                });
            },
            'decimal': function (field, record) {
                var value = Number(record.get(field.name)) || 0;
                return Ext.create('Rally.ui.NumberField', {
                    name: field.displayName,
                    displayName: field.displayName,
                    value: value,
                    labelAlign: 'right',
                    height: getDefaultHeight(),
                    field: field,
                    hideTrigger: true,
                    width: '25%',
                    labelSeparator: "",
                    minWidth: 200,
                    labelAlign: 'right',
                    labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                    labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                    padding: Rally.technicalservices.DetailEditorFactory.padding
                });
            },
            'integer': function (field, record) {

                var value = Number(record.get(field.name)) || 0;
                return Ext.create('Rally.ui.NumberField', {
                    name: field.displayName,
                    displayName: field.displayName,
                    value: value,
                    labelAlign: 'right',
                    height: getDefaultHeight(),
                    field: field,
                    hideTrigger: true,
                    width: '25%',
                    labelSeparator: "",
                    minWidth: 200,
                    labelAlign: 'right',
                    labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                    labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                    padding: Rally.technicalservices.DetailEditorFactory.padding
                });

            },
            'object': function (field, record) {
                if (field.attributeDefinition.Constrained) {
                    return Ext.create('Rally.ui.combobox.ComboBox', {
                        name: field.displayName,
                        value: record.get(field.name),
                        editable: false,
                        labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                        labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                        labelAlign: 'right',
                        storeConfig: {
                            autoLoad: true,
                            model: field.attributeDefinition.SchemaType,
                            initialValue: record.get(field.name) ? record.get(field.name)._refObjectName : ''
                        },
                        allowNoEntry: defaultAllowNoEntry(field, record)
                    });

                } else {
                    return Ext.create('Rally.ui.TextField', {
                        name: field.displayName,
                        value: record.get(field.name),
                        labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                        labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                        padding: Rally.technicalservices.DetailEditorFactory.padding,
                        labelAlign: 'right'

                    });
                }
            },
            quantity: function (field, record) {
                var value = Number(record.get(field.name)) || 0;
                return Ext.create('Rally.ui.NumberField', {
                    name: field.displayName,
                    displayName: field.displayName,
                    value: value,
                    labelAlign: 'right',
                    height: getDefaultHeight(),
                    field: field,
                    width: '25%',
                    labelSeparator: "",
                    minWidth: 200,
                    labelAlign: 'right',
                    labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                    labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                    padding: Rally.technicalservices.DetailEditorFactory.padding
                });
            },
            rating: function (field, record) {
                if (field.attributeDefinition.Constrained) {
                    return constrainedComboBox(field, record, {
                        allowNoEntry: !field.required || record.get(field.name) === 'None',
                        ratingNoEntryString: '-- No Entry --',
                        noEntryValue: 'None',
                        labelAlign: 'right',
                        useNullForNoEntryValue: false
                    });
                } else {
                    return Ext.create('Rally.ui.TextField', {
                        name: field.displayName,
                        value: record.get(field.name),
                        width: '25%',
                        minWidth: 200,
                        labelAlign: 'right',
                        labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                        labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                        padding: Rally.technicalservices.DetailEditorFactory.padding
                    });
                }
            },
            string: function (field, record) {
                if (field.attributeDefinition.Constrained) {
                    return constrainedComboBox(field, record);
                } else {
                    return Ext.create('Rally.ui.TextField', {
                        name: field.name,
                        value: record.get(field.name),
                        height: getDefaultHeight(),
                        minWidth: 200,
                        labelSeparator: "",
                        labelWidth: Rally.technicalservices.DetailEditorFactory.labelWidth,
                        labelCls: Rally.technicalservices.DetailEditorFactory.labelCls,
                        width: Rally.technicalservices.DetailEditorFactory.controlWidth,
                        padding: Rally.technicalservices.DetailEditorFactory.padding
                    });
                }
            },
            text: function (field, record) {
                var isEditable = Rally.ui.detail.DetailHelper.isDetailPageFieldEditable(field, record),
                    editor;

                if (isEditable) {
                    editor = Ext.create('Rally.technicalservices.RichTextEditor',{
                        field: field,
                        record: record,
                        labelAlign: 'right',
                        padding: Rally.technicalservices.DetailEditorFactory.padding
                    });
                } else {
                    editor = Ext.create('Rally.ui.richtext.RichTextEditorReadOnly', {
                        html: record.get(field.name)
                    });
                }

                if (Rally.ui.detail.DetailHelper.getController()) {
                    Rally.ui.detail.DetailHelper.getController().on('recordupdate', function(record) {
                        editor.setValue(record.get(field.name));
                    });
                }

                return editor;
            },
            web_link: function (field, record) {
                return Ext.create('Rally.ui.detail.view.DetailWebLinkField', {
                    field: field,
                    record: record
                });
            }
        }
    });

})();
Ext.define('Rally.technicalservices.RichTextEditor', {
    extend: 'Ext.Container',
    layout: {type: 'hbox'},
    width: Rally.technicalservices.DetailEditorFactory.controlWidth,
    alias: 'widget.tsrichtexteditor',
    height: 200,

    constructor: function (config) {
        this.mergeConfig(config);
        this.callParent([this.config]);
    },

    initComponent: function(){
        this.callParent(arguments);

        var record = this.record,
            field = this.field;

        this.add({
            xtype: 'container',
            html: Ext.String.format('<div class="tslabel">{0}</div>',field.displayName),
            width: Rally.technicalservices.DetailEditorFactory.labelWidth,
            padding: 5
        });
        var editor = Ext.create('Rally.ui.richtext.RichTextEditor', {
                field: field,
                record: record,
                title: field.name,
                itemId: 'rt-editor',
                margin: 5,
                name: field.name,
                value: record.get(field.name),
                growToFitContent: true,
                allowImageUpload: true,
                renderTpl: '<div class="richTextToolbar"></div><div class="richTextContent"></div>',
                EDITOR_MIN_HEIGHT: 110,
                toolbarAlwaysEnabled: false,
                showUndoButton: true,
                disableUndoButtonWithToolbar: false,
                indicatorFoldUnder: true,
                useLinkBubble: true,
                flex: 1,
                listeners: {
                    focus: function () {
                        var focusedField = Ext.ComponentQuery.query('rallydetailfieldcontaineredpcomplete[focused=true]')[0];

                        if (focusedField) {
                            var editor = focusedField.editor;
                            if (editor !== this) {
                                focusedField.clearSelection();
                                editor.hasFocus = false;
                                editor.fireEvent('blur');
                                if (editor.collapse) {
                                    editor.collapse();
                                }
                            }
                        }
                    },
                    blur: function () {
                        var fields = Ext.ComponentQuery.query('rallydetailfieldcontaineredpcomplete');
                        var previouslyFocusedField = _.find(fields, function (field) {
                            if (field.editor) {
                                return field.editor.hasFocus;
                            }
                        }, this);
                        if (previouslyFocusedField) {
                            previouslyFocusedField.focusField();
                        }
                    },
                    imageuploaded: function(imageInfo) {
                        var controller = Rally.ui.detail.DetailHelper.getController();
                        if(controller) {
                            controller._handleImageUpload(imageInfo);
                        }
                    }
                }
            });

        editor.on('boxready', this._resize, this);
        if (Rally.ui.detail.DetailHelper.getController()) {
            Rally.ui.detail.DetailHelper.getController().on('recordupdate', function(record) {
                editor.setValue(record.get(field.name));
            });
        }
        this.add(editor);
    },
    _resize: function(){
        this.down('#rt-editor').setHeight(this.height);
    },
    getValue: function(){
        return this.down('#rt-editor').getValue();
    },
    validator: function(value){
        return true;
    },
    validate: function(){
        var validation = this.validator(this.down('#rt-editor').getValue());
        if (validation === true){
            return true;
        }
        Ext.create('Rally.ui.tooltip.ToolTip', {
            target : this.down('#rt-editor').getEl(),
            html: '<div class="tsinvalid">' + validation + '</div>',
            autoShow: true,
            destroyAfterHide: true
        });
        return false;
    }
});

Ext.define('Rally.technicalservices.DynamicCellEditor', {
    extend: 'Rally.ui.dialog.Dialog',
    alias: 'widget.tsdynamiceditor',
    autoShow: true,
    draggable: true,
    closable: true,
    modal: true,
    title: 'Dialog Example',
    items: [],

    cls: 'bulk-edit-dialog',

    width: 300,

    config: {
        /**
         * @cfg {[Rally.data.Model]} records (required)
         * The records to bulk edit
         */
        record: null
    },

    initComponent: function() {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @param Rally.ui.dialog.BulkEditDialog the dialog
             * @param Rally.data.wsapi.Field field the field being edited
             * @param {String|Number} the new value
             */
            'edit'
        );
        //console.log('initcomponent', this.record);

        var editor = this._getEditor(this.record);
        if (this.record.get('defaultValue') && this.record.get('defaultValue').length > 0){
            editor.value = this.record.get('defaultValue') || null;
        }
        //console.log('editor',editor, this.record);
        this.add(editor);

        this.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            padding: '0 0 10 0',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            ui: 'footer',
            items: [
                {
                    xtype: 'rallybutton',
                    itemId: 'applyButton',
                    text: 'Apply',
                    cls: 'primary rly-small',
                   // disabled: true,
                    handler:  this._onApplyClicked,
                    scope: this
                },
                {
                    xtype: 'rallybutton',
                    text: 'Cancel',
                    cls: 'secondary rly-small',
                    handler: function() {
                        this.close();
                    },
                    scope: this
                }
            ]
        });
    },
    _getEditor: function(record){

        var fieldName = record.get('fieldName');

        this.title = 'Default Value for ' + record.get('displayName');


        var field = record.get('fieldObj');
        var config = {
            xtype: 'textarea',
            itemId: 'default',
            style: {
                width: '95%',
                float: 'center'
            }
        };
        if (field && field.attributeDefinition){
            if (field.attributeDefinition.AttributeType === 'STRING' && field.attributeDefinition.Constrained === true ){
                config.xtype = 'rallyfieldvaluecombobox';
                config.model = 'PortfolioItem/Feature';
                config.field = fieldName;
            }
            if (field.attributeDefinition.AttributeType === 'BOOLEAN'){
                var editor = field.editor;
                editor.itemId = 'default';
                return editor
            }
            if (field.attributeDefinition.AttributeType === 'QUANTITY'){
                config.xtype = 'rallynumberfield';
                config.minValue = 0;
            }
            if (field.attributeDefinition.AttributeType === 'OBJECT'){
               config.xtype = field.editor.field.xtype;
            }
        }

        return config;

    },
    _onApplyClicked: function() {
        var valueField = this.down('#default');
     //   console.log('_onApplyClicked', valueField, valueField.getValue());
        if (this.record.get('defaultValue') !== valueField.getValue()){
            this.record.set('defaultValue', valueField.getValue());
            if (valueField.displayField && valueField.getRecord()){
                this.record.set('defaultDisplayValue', valueField.getRecord().get(valueField.displayField) || valueField.getValue());
            } else {
                this.record.set('defaultDisplayValue', valueField.getValue());
            }
        }

        this.close();
    }
});

Ext.define('Rally.technicalservices.BooleanFieldComboBox',{
    extend: 'Rally.ui.combobox.FieldComboBox',
    alias: 'widget.tsbooleanfieldcombobox',

    _isNotHidden: function(field) {
        return (!field.hidden && field.attributeDefinition && field.attributeDefinition.AttributeType == 'BOOLEAN');
    }
});

Ext.define('Rally.technicalservices.settings.FormConfiguration',{
    extend: 'Ext.form.field.Base',
    alias: 'widget.tsformconfigsettings',
    logger: new Rally.technicalservices.Logger(),
    config: {
        value: undefined,
        fields: undefined,
        decodedValue: {}
    },

    fieldSubTpl: '<div id="{id}" class="settings-grid"></div>',
    noDefaultValue: ['Attachments'],

    width: '100%',
    cls: 'column-settings',

    onDestroy: function() {
        if (this._grid) {
            this._grid.destroy();
            delete this._grid;
        }
        this.callParent(arguments);
    },

//    saveFieldSettings: function(a, b) {
//
//        if (this.hasOwnProperty('_store')) {
//            //this.logger.log('saveFieldSettings', this.value, this._store.data.items)
//
//            var form = this;
//            var order = 1;
//            var newFieldList = _.map(this._store.data.items, function(record) {
//                //reorder the store
//                record.order = order++;
//                //Find the records in the field list
//                return _.find(form.fields, { 'name': record.get('fieldName')});
//            });
//            this.config.fields = newFieldList;
//            this.fields = newFieldList;
//            //this.logger.log('saveFieldSettings out', this.fields);
//
//
//            this._store.filter();   //Fire re-sort
//        }
//    },

    onRender: function() {

    //this.logger.log('onRender in', this.value);

        var decodedValue = {};
        if (this.value && !_.isEmpty(this.value)){
            decodedValue = Ext.JSON.decode(this.value);
        }
        this.callParent(arguments);

        var data = [];
        var formData = [];

        _.each(this.fields, function(f){
                data.push({order: f.order, fieldName: f.fieldName, displayName: f.displayName, display: f.display, defaultValue: f.defaultValue, required: f.required });
        }, this);

        this._store = Ext.create('Ext.data.Store', {
            fields: ['order', 'fieldName', 'displayName', 'display', 'defaultValue','required','fieldObj'],
            data: data,
            sortOnFilter: false,
            sortOnLoad: true,
            sorters: [{
                property: 'order',
                value: 'ASC'
            }]
        });

        //this.logger.log('formConfigSetting', this._store);
        this._grid = Ext.create('Rally.ui.grid.Grid', {
            autoWidth: true,
            renderTo: this.inputEl,
            columnCfgs: this._getColumnCfgs(),
            showPagingToolbar: false,
            showRowActionsColumn: false,
            store: this._store,
            height: 400,
            width: this.getWidth() * 0.90,
            editingConfig: {
                publishMessages: false
            },
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragText: 'Drag and drop to reorder'
                }
//                },
//                listeners: {
//                    scope: this,
//                    drop: this.saveFieldSettings
//                }
            }
        });
      //  this.fireEvent('ready');
    },

    _getColumnCfgs: function() {
        var me = this;

        var columns = [
            {
                text: 'Field',
                dataIndex: 'displayName',
                flex: 1
            },
            {
                text: 'Show',
                dataIndex: 'display',
                renderer: function (value) {
                    return value === true ? 'Yes' : 'No';
                },
                editor: {
                    xtype: 'rallycombobox',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    storeType: 'Ext.data.Store',
                    storeConfig: {
                        remoteFilter: false,
                        fields: ['name', 'value'],
                        data: [
                            {'name': 'Yes', 'value': true},
                            {'name': 'No', 'value': false}
                        ]
                    }
                }
            },
            {
                text: 'Required',
                dataIndex: 'required',
                renderer: function (value) {
                    return value === true ? 'Yes' : 'No';
                },
                editor: {
                    xtype: 'rallycombobox',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    storeType: 'Ext.data.Store',
                    storeConfig: {
                        remoteFilter: false,
                        fields: ['name', 'value'],
                        data: [
                            {'name': 'Yes', 'value': true},
                            {'name': 'No', 'value': false}
                        ]
                    }
                }
            }, {
                text: 'Default Value',
                flex: 3,
                xtype: 'actioncolumn',
                sortable: false,
                menuDisabled: true,
                renderer: function(v,m,r){
                    var val= '<i>Default Values not Supported</i>',
                        color = "gray";
                    if (me._isAllowedDefaultValue(r)) {
                        val = r.get('defaultValue') || '';
                        color = "black";
                    }
                    return Ext.String.format('<span style="display: inline; font-size: 11px; padding-left:50px;line-height:15px;color:{0};">{1}</span>',color,val);


                },
                items: [{
                    //iconCls: "picto icon-edit",
                    icon: '/slm/images/icon_edit_view.gif',
                    tooltip: 'Edit',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        me.showEditor(rec);
                    },
                    isDisabled: function(grid, row, col, item, record){
                        return !me._isAllowedDefaultValue(record);
                    }
                }, {
                    icon:  '/slm/images/icon_delete.gif',
                    tooltip: 'Delete',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        rec.set('defaultValue', null);
                    },
                    isDisabled: function(grid, row, col, item, record){
                        return !me._isAllowedDefaultValue(record);
                    }
                }]
            }

        ];
        return columns;
    },
    _isAllowedDefaultValue: function(record){

        var noDefaultValue = ['Attachments'];
        if (Ext.Array.contains(noDefaultValue, record.get('fieldName'))){
            return false;
        }
        return true;
    },
    showEditor: function(record){
        Ext.create('Rally.technicalservices.DynamicCellEditor',{
            record: record,
            context: Rally.getApp().getContext()
        });
    },
    /**
     * When a form asks for the data this field represents,
     * give it the name of this field and the ref of the selected project (or an empty string).
     * Used when persisting the value of this field.
     * @return {Object}
     */
    getSubmitData: function() {
        var data = {};

        data[this.name] = Ext.JSON.encode(this._buildSettingValue());
    //this.logger.log('getSubmitData out', data);
        return data;
    },
    _buildSettingValue: function() {
        var mappings = {};

        var order = 0;
        this._store.each(function(record) {
                mappings[record.get('fieldName')] = {
                    display: record.get('display'),
                    displayName: record.get('displayName'),
                    fieldName: record.get('fieldName'),
                    defaultValue: record.get('defaultValue'),
                    required: record.get('required'),
                    order: order++
                };
        }, this);
        //this.logger.log('_buildSettingValue out', mappings);
        return mappings;
    },

    getErrors: function() {
        var errors = [];
        if (_.isEmpty(this._buildSettingValue())) {
           errors.push('At least one field must be shown.');
        }
        return errors;
    },
    validate : function() {
        var me = this,
            isValid = me.isValid();
        if (isValid !== me.wasValid) {
            me.wasValid = isValid;
            me.fireEvent('validitychange', me, isValid);
        }
        if (!isValid){
            var html = this.getErrors().join('<br/>');
            Ext.create('Rally.ui.tooltip.ToolTip', {
                target : this.getEl(),
                html: '<div class="tsinvalid">' + html + '</div>',
                autoShow: true,
                anchor: 'bottom',
                destroyAfterHide: true
            });

        }

        return isValid;
    },
    setValue: function(value) {
        this.callParent(arguments);
        this._value = value;
    }
});

Ext.define('Rally.technicalservices.RequestForm', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tsrequestform',
    logger: new Rally.technicalservices.Logger(),
    bodyStyle: 'background:#cff; padding:10px;',
    layout: {
        type: 'vbox',       // Arrange child items vertically
        //type: 'table',
        //columns: 1,
        //padding: 10,
        //tableAttrs: {"class": "tstbl"},
        //trAttrs: {"class": "tstbl"}
    },

    config: {
        title: '',
        instructions: 'These are instructions for filling out this form',
        model: undefined,
        formConfiguration: undefined,
        record: undefined,
        submitDirectory: ''
    },

    /**
     * Properties that are populated during the creation of this object
     */
    newRecord: null,

    constructor: function(config){
        this.mergeConfig(config);
        //this.logger.log('constructor', config, this.config);
        this.callParent(arguments);
    },
    initComponent: function () {
        this.callParent();
        this.addEvents('save','ready','onwarning','onerror');
        this._build(this.model, this. record);
    },

    _build: function (model, record) {
        //this.logger.log('_build', model);

        if ( record === undefined) {
            this.record = this._getNewRecord(model);
        }

        this._addInstructions(this.instructions);

        this._addFields(this.record);

    },
    _addInstructions: function(){
        var title = this.add(Ext.create('Ext.container.Container',{
            tpl: '<tpl><div class="tsinstructions">{instructions}</div></tpl>'
        }));
        title.update(this);
    },

    _addFields: function(record){
        var model = this.model;
        //this.logger.log('_addFields', this.formConfiguration);
        if (!_.isEmpty(this.formConfiguration)){
            _.each(this.formConfiguration, function(field_obj){
                var field_name = field_obj.Name;
                var model_field = model.getField(field_name);
                if (model_field && field_obj.edit){
                    var item_id = field_name,
                        margin = 10,
                        field_label = model_field.displayName;

                    var item = Rally.technicalservices.DetailEditorFactory.getEditor(model_field,record,item_id, margin, field_label);
                    item.labelCls = "tslabel";
                    if (field_obj.required){
                        item.validator = function(value) {
                            if (Ext.isEmpty(value) || value == null || value == ''){
                                return Ext.String.format('{0} is required.', field_name);
                            }
                            return true;
                        }
                    }
                    item.msgTarget = 'side';
                    item.on('boxready', this._resize, this);

                    this.add(item);

                }
            }, this);
            this.doLayout();
            this.fireEvent('ready', this);
        } else {
            var msg = "No fields were loaded to display.  Please check the configuration settings to verify that fields are configured for this App."
            this.add({
                xtype: 'container',
                html: msg
            });
        }
    },
    _resize: function(cmp){
        //this.logger.log('_resize');
        this.doLayout();
    },
    _getNewRecord: function(model){
        var newFields = {};
        Ext.Object.each(this.formConfiguration, function(field_name, field_obj){
            //this.logger.log('_getNewRecord',field_name, field_obj);
            if (field_obj.defaultValue){
                newFields[field_name]=field_obj.defaultValue;
            }
        },this);

        //Add the users name in here
        newFields['Owner'] = Rally.getApp().getContext().getUser()._ref;

        //Add submit directory here
        newFields['Project'] = this.submitDirectory

        //this.logger.log('_getNewRecord', newFields);
        var rec = Ext.create(model, newFields);
        return rec;
    },

    _updateRecord: function(){
        var exceptionFields = ["Attachments"],
            valid = true;
        _.each(this.formConfiguration, function(field_obj){
            var field_name = field_obj.Name;
            if (!Ext.Array.contains(exceptionFields, field_name) && field_obj.edit) {
                this.logger.log('_updateNewRecord', field_name, this.down('#' + field_name));

                var val = this.down('#' + field_name).getValue() || field_obj.defaultValue || null;
                valid = this.down('#' + field_name).validate();
                if (!valid) {
                    return false;
                }
                this.record.set(field_name, val);

            }
        }, this);

        if (this.record.get('Ready') && this.submitDirectory){
            this.record.set('Project', this.submitDirectory);
        }
//this.logger.log('newRecordsetTo', this.newRecord);
        return valid;
    },
    save: function () {
        if (!this._updateRecord()){
            return false;
        };
        var attachments = null;
        if (this.down('#Attachments')){
            attachments = this.down('#Attachments').getValue() || null;
        }

        this.record.save({
            scope: this,
            callback: function(result, operation) {
                if(operation.wasSuccessful()) {
                    if (attachments) {
                        this._updateAttachments(result, 'Attachments', attachments).then({
                            scope: this,
                            success: function(){
                                this.fireEvent('save', result);
                            },
                            failure: function(msg){
                                this.fireEvent('save', result);
                                this.fireEvent('onerror', {message: msg});
                            }
                        });
                    } else {
                        this.fireEvent('save',result);
                    }
                } else {
                    var msg = Ext.String.format("Submission could not be saved: {0}", operation.error.errors[0]);
                    this.fireEvent('onerror', {message: msg});
                }
            }
        });
    },
    _updateAttachments: function(record, field_name, val){
        //this.logger.log('_updateAttachments', record, field_name, val);
        var deferred = Ext.create('Deft.Deferred');
        var me = this;

        var promises = [];
       _.each(val, function(v){
            var fn = function(){
                me._updateAttachment(record, v);
            }
            promises.push(fn);
        });

        Deft.Chain.sequence(promises).then({
            success: function(){
                deferred.resolve();
            },
            failure: function(msg){
                deferred.reject(msg);
            }
        });
        return deferred;
    },
    _updateAttachment: function(record, val){
        var deferred = Ext.create('Deft.Deferred'),
            me = this;

        //this.logger.log('_updateAttachment', val);

        Rally.data.ModelFactory.getModel({
            type: 'AttachmentContent',
            success: function(model) {
                var act = Ext.create(model, {
                    Content: val.get('content')
                });
                act.save({
                    callback: function(result, operation){
                        me.logger.log('_updateAttachment AttachmentContent.save callback', result, operation);
                        if (operation.wasSuccessful()){
                            Rally.data.ModelFactory.getModel({
                                type: 'Attachment',
                                success: function(amodel) {
                                    me.logger.log('_updateAttachment Attachment.model callback', amodel);
                                    var at = Ext.create(amodel, {
                                        Content: result.get('ObjectID'),
                                        ContentType: val.get('contentType'),
                                        Name: val.get('filename'),
                                        Artifact: record.get('_ref')
                                    });
                                    at.save({
                                        callback: function(result, operation){
                                            if (operation.wasSuccessful()){
                                                me.logger.log('_updateAttachment Attachment.save callback', result, operation);
                                                deferred.resolve();
                                            } else {
                                                deferred.reject('Error saving Attachment:  ' + operation.error && operation.error.errors.join(','));
                                            }

                                        }
                                    });
                                }
                            });
                        } else {
                            deferred.reject('Unable to save content: ' + operation.error.errors.join(','));
                        }
                    }
                });
            }
        });
        return deferred;
    }
});

Ext.define('Rally.technicalservices.WsapiToolbox',{
    singleton: true,

    fetchModel: function(model_name){
        var deferred = Ext.create('Deft.Deferred');
        Rally.data.wsapi.ModelFactory.getModel({
            type: model_name,
            success: function(model) {
                deferred.resolve(model);
            },
            failure: function(){
                deferred.reject('Error loading model: ' + model_name);
            }
        });
        return deferred.promise;
    }
});

Ext.define("risk-request-form", {
    extend: 'Rally.app.App',
    componentCls: 'app',
    logger: new Rally.technicalservices.Logger(),
    defaults: { margin: 10 },
    config: {
        defaultSettings: {
            approvalField: false,
            enableFormattedID: false,
            submitDirectory: ''
        }
    },
    layoutConfig: '{"fields" : [' +
//        '{ "Name" : "Project",    "view" : true,  "edit" : false },' +
        '{ "Name" : "c_OBNNo",   "view" : true, "edit" : true  },' +
        '{ "Name" : "Parent",    "view" : true,  "edit" : false },' + // Do not put parent in edit
        '{ "Name" : "Name",    "view" : true,  "edit" : true },' +
        '{ "Name" : "Milestones",    "view" : true,  "edit" : true },' + // Milestones label not available in edit
        '{ "Name" : "c_RAIDRaisedBy",   "view" : true, "edit" : true  },' +
        '{ "Name" : "c_BusinessOwner",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_RAIDOwner",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_DateIdentifiedCreated",   "view" : true, "edit" : true  },' +
        '{ "Name" : "c_RAIDArea",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_RAIDAreaofPrimaryImpact",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_RAIDImpactLevel",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_RAIDEscalationDate",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_RAIDEscalationLevel",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_DateDue",    "view" : true,  "edit" : true },' +
        '{ "Name" : "c_DateofNextReview",    "view" : true,  "edit" : true },' +
        '{ "Name" : "Description",    "view" : false,  "edit" : true },' +
//        '{ "Name" : "c_RAIDImpact",    "view" : false,  "edit" : true },' +
        '{ "Name" : "c_Priority",    "view" : false,  "edit" : true },' +
        '{ "Name" : "c_RAIDProposedSolution",    "view" : false,  "edit" : true },' +
        '{ "Name" : "c_WeeklyProgressUpdate",    "view" : false,  "edit" : true },' +
        '{ "Name" : "Ready",    "view" : false,  "edit" : true }' +
        ']}',
    formModel: undefined,
    //TODO Need to load these from the subscription
    formModelName: 'PortfolioItem/Feature',
    parentModelName: 'PortfolioItem/BusinessOutcome',
//    parentModelName: 'PortfolioItem/Initiative',
    items: [],
    notAllowedFields: [
            //User story fields
            'ScheduleState','PortfolioItem',
            //Portfolio Item fields
            'State','Children',
            //Common fields
            'Parent','PredecessorsAndSuccessors','Predecessors','Successors','Project','Milestones','Workspace','Tags','Changesets','DisplayColor'
    ],
    externalAppSettingsKey: 'niksAppSettings',
    launch: function() {
        if (this.isExternal()){
            this.getExternalAppSettings(this.externalAppSettingsKey);
        } else {
            this.onSettingsUpdate(this.getSettings());
        }
    },
    _prepareApp: function(){
//        console.log('_prepareApp', this.formModelName, this.formConfiguration);
        Rally.technicalservices.WsapiToolbox.fetchModel(this.formModelName).then({
            scope: this,
            success: function(model){
                this.formModel = model;
                this.model = model;
                this._showGrid(model);
            },
            failure: function(msg){
                Rally.ui.notify.Notifier.showError({message: msg});
            }
        });
    },
    _buildForm: function(model, form_config, record){
        //this.logger.log('_buildForm');
        this._clearWindow();
        this.add({xtype:'container',itemId:'button_box', flex: 1, layout: {type: 'hbox', pack: 'center'}});
        this.add({xtype:'container',itemId:'display_box', flex: 1});
        this.down('#display_box').add({
            xtype: 'tsrequestform',
            itemId: 'requestform',
            model: model,
            record: record,
            instructions: this.formInstructions,
            formConfiguration: form_config,
            submitDirectory: this.submitDirectory,  //If ready is set, push the record to here
            listeners: {
                scope: this,
                save: this._onSaved,
                onwarning: this._onWarning,
                onerror: this._onError,
                ready: this._onReady
            }
        });
        var btnText = 'Submit';
        if (record !== undefined) {
            btnText = 'Update';
        }
        this.down('#button_box').add({
            xtype:'rallybutton',
            text: btnText,
            itemId: 'btn-submit',
            style: {
                textAlign: 'center'
            },
            width: 75,
            scope: this,
            handler: this._save
        });
        this.down('#button_box').add({
            xtype:'rallybutton',
            text: 'Cancel',
            itemId: 'btn-cancel',
            style: {
                textAlign: 'center'
            },
            width: 75,
            scope: this,
            handler: this._cancel
        });
    },
    _save: function(){
        var requestForm = this.down('#requestform');
        requestForm.save();
    },
    _onSaved: function(newRecord){
        //this.logger.log('_onSaved',newRecord);
        Rally.ui.notify.Notifier.showCreate({artifact: newRecord});
        this._showGrid(this.model);
    },
    _cancel: function(){
        this._showGrid(this.model);
    },
    _onWarning: function(obj){
        Rally.ui.notify.Notifier.showWarning(obj);
    },
    _onError: function(obj){
        Rally.ui.notify.Notifier.showError(obj);
    },
    _onReady: function(form){
        //this.logger.log('_onReady', form);
        form.doLayout();
        form.setWidth('95%')
        this.down('#display_box').doLayout();
    },
    _clearWindow: function(){
        if (this.down('#story-grid')){
            this.down('#story-grid').destroy();
        }
        if (this.down('#display_box')){
            this.down('#display_box').destroy();
        }
        if (this.down('#button_box')){
            this.down('#button_box').destroy();
        }
        if (this.down('#new_button')){
            this.down('#new_button').destroy();
        }
    },
    _checkSubmit: function(store,record,action,field) {
        //Don't need:  && (record.get('Ready') !== record.raw.Ready)
        if (field.includes('Ready') && (action === 'edit') && (record.raw.Ready === false)) {
            if ( this.submitDirectory ) {
                record.set('Project', this.submitDirectory);
                this.fireEvent('update');
            }
        }
    },
    _showGrid: function(model) {
        this._clearWindow();
        var btn = Ext.create('Ext.Container', {
                    itemId: 'new_button',
                    items: [{
                        xtype: 'rallybutton',
                        text: 'New Risk',
                        margin: 5,
                        bubbleEvents: ['click']
                    }]
                });
        this.add(btn);
        btn.on({
                    click: this._onNewRequest,
                    scope: this
                });
        var context = this.getContext();
        var ds = Ext.create('Rally.data.wsapi.Store', {
            model: model,
            autoLoad: false,
            fetch: true,
            filters: [{
                property: 'State.Name',
                operator: '!=',
                value: 'Done'
            }],
            sorters: [
                {
                    property: 'CreationDate',
                    direction: 'DESC'
                }
            ],
            //When data changes, check ready flag to see if it needs moving to submitDirectory
            listeners: {
                update: this._checkSubmit,
                scope: this
            }
        }, this);
        ds.load().then({
            scope: this,
            failure: function(a,b,c,d,e){
                //this.logger.log('Could not load datastore');
            },
            success: function(){
                var gb = this.add({
                    xtype: 'rallygrid',
                    context: context,
                    itemId: 'story-grid',
                    model: model,
                    stateful: false,
                    store: ds,
                    showRowActionsColumn: false,
                    columnCfgs: this.getColumnCfgs(),
                    height: this.getHeight()
                });
            },
            scope: this
        });
    },
    getColumnCfgs: function(){
        var app = this;
        config_obj = Ext.JSON.decode(this.layoutConfig);
        // I am sure there are better ways to do this, but it works....
        var fieldList = [];
        for ( key in config_obj.fields) {
            if (config_obj.fields[key].view) {
                if ( config_obj.fields[key].Name === 'Parent'){
                    fieldList.push({
                        dataIndex: 'Parent',
                        text: 'Business Outcome',
                        renderer: function( field, cell, record, row, column, view) {
                            var nclass = ' class=applink';
                            var name =  '<-- Click to Set -->';
                            if ( record.data.Parent ) {
                                name =  record.data.Parent._refObjectName;
                            }
                            else {
                                nclass = ' class=errorbar';
                            }
                            return '<div' + nclass +  '>' +  name + '</div>';
                        },
                        listeners: {
                            click: function(view,cellObject,row,column,event,record,rowObject) {
                                Ext.create('Rally.ui.dialog.ArtifactChooserDialog', {
                                    artifactTypes: [ app.parentModelName ],
                                    autoShow: true,
                                    title: 'Choose a ' + app.parentModelName,
                                    listeners : {
                                        artifactchosen: function (dialog, selectedRecord) {
                                            record.set('Parent', selectedRecord.get('_ref'));
                                            record.save().then({
                                                success: function(a,b,c,d,e,f,g) {
                                                    Rally.ui.notify.Notifier.show({ message: 'Item: ' + record.get('FormattedID') + ' updated'});
                                                },
                                                failure: function (error) {
                                                    Rally.ui.notify.Notifier.showError({ message: 'Failed to save item: ' + record.get('FormattedID') });
                                                }
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    fieldList.push(config_obj.fields[key].Name);
                }
            }
        }
        //this.logger.log('gridColumnCfgObj', fieldList);
        var clmns = [];
        if ( !this.getSetting('enableFormattedID')) {
            clmns.push({
                dataIndex: 'FormattedID',
                text: 'ID',
                renderer: function(item, row, record, arg4, arg5) {
                    var tpl = new Ext.XTemplate(
                        '<tpl for=".">',
                        '<span class="icon-eye-open">',
                        '</span>',
                        '<span class="applink" id={[this._getLinkId(values)]}>',
                        '{[this._getPopUp()]}',
                        '</span>',
                        '</tpl>',
                        {
                            _getLinkId: function(x,y,z) {
                                var result = Ext.id();
                                Ext.Function.defer( this.addListener,10, this, [result]);
                                return result;
                            },
                            _getPopUp: function(w,x,y,z) {
                                return item;
                            },
                            addListener: function(id) {
                                var config_obj = Ext.JSON.decode(app.layoutConfig);
                                Ext.get(id).on('click', function() { app._buildForm(app.model, config_obj.fields, record);});
                            }
                        });
                    return tpl.apply(record)
                }
            });
        }
        else {
            clmns.push('FormattedID');
        }
        if ( this.getSetting('approvalField')) {
            clmns.push({
                dataIndex: 'Project',
                text: 'Category',
                renderer: function(item){
                    return item._refObjectName;
                }
            });
        }
        clmns = clmns.concat(fieldList);
        //this.logger.log('gridColumnCfgs', clmns);
        return clmns;
    },
    _onNewRequest: function() {
        //this.logger.log('_onNewRequest');
         var config_obj = Ext.JSON.decode(this.layoutConfig);
        this._buildForm(this.model, config_obj.fields);
    },
    getOptions: function() {
        return [
            {
                text: 'About...',
                handler: this._launchInfo,
                scope: this
            }
        ];
    },
    _isFieldAllowed: function(field){
        var forbiddenTypes = ['WEB_LINK'];
        if (Ext.Array.contains(this.notAllowedFields, field.name)){
            return false;
        }
        if (field.readOnly === true || field.hidden === true){
            return false;
        }
        if (field && !field.attributeDefinition){
            return false;
        }
        //Not showing Weblinks for now
        if (Ext.Array.contains(forbiddenTypes, field.attributeDefinition.AttributeType)){
            return false;
        }
        return true;
    },
    getSettingsFields: function() {
        var returned = [
        {
            name: 'enableFormattedID',
            xtype: 'rallycheckboxfield',
            fieldLabel: 'Show ID as hyperlink',
            labelAlign: 'top'
        },
        {
            name: 'submitDirectory',
            xtype: 'rallyprojectscopefield',
            labelAlign: 'top',
            fieldLabel: 'Target "submit on ready" project'
        }];
        return returned;
    },
    _launchInfo: function() {
        if ( this.about_dialog ) { this.about_dialog.destroy(); }
        this.about_dialog = Ext.create('Rally.technicalservices.InfoLink',{});
    },
    isExternal: function(){
        return typeof(this.getAppId()) == 'undefined';
    },
    //onSettingsUpdate:  Override
    onSettingsUpdate: function (settings){
        //this.logger.log('onSettingsUpdate',settings);
        Ext.apply(this, settings);
        if (this.isExternal()){
            this.saveExternalAppSettings(this.externalAppSettingsKey, settings);
        } else {
            this.saveInternalAppSettings();
        }
        this._prepareApp();
    },
    saveExternalAppSettings: function(key, settings){
        var prefs = {};
        _.each(settings, function(val, setting_key){
            var pref_key = key + '.' + setting_key;
            prefs[pref_key] = val;
        });
        //this.logger.log('SaveExternalAppSettings', key, settings, prefs);
        Rally.data.PreferenceManager.update({
            project: this.getContext().getProject()._ref,
            settings: prefs,
            scope: this,
            success: function(updatedRecords, notUpdatedRecords) {
                //this.logger.log('settings saved', key, updatedRecords, notUpdatedRecords);
            }
        });
    },
    saveInternalAppSettings: function() {
        this.setSettings();
    },
    getExternalAppSettings: function(key){
        Rally.data.PreferenceManager.load({
            project: this.getContext().getProject()._ref,
            additionalFilters: [{
                property: 'name',
                operator: 'contains',
                value: key
            }],
            scope: this,
            cache: false,
            success: function(prefs) {
                _.each(prefs, function(val, pref_name){
                    if (/\.formConfiguration$/.test(pref_name)){
                        this.formConfiguration = val;
                    }
                }, this);
                this._prepareApp();
            },
            failure: function(error) {
                debugger;
            }
        });
    },
    getInternalAppSettings: function() {
    },
});
            
               Rally.launchApp('risk-request-form', {
                   name: 'Risk Submit Form'
               });
        });
    </script>
    
    <style type="text/css">

.app {
}
.x-action-col-icon {
    float: left;
}
.tsinfolink {
    position:absolute;
    right:0px;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    text-align: center;
    color: white;
    background: #C0C0C0;
    border-style: solid;
    border-width: 1px;
    margin-top: 25px;
    margin-right: 5px;
    cursor: pointer;
}
.tslabel {
    font-family: ProximaNovaSemiBold,Helvetica,Arial;
    color: #222;
    font-size: 12px;
    text-align: right;
    float: right;
    padding: 10;
}
.tsinvalid {
    color: #c30;
    font-weight: bold;
    font-family: ProximaNovaSemiBold,Helvetica,Arial;
}
.tsinstructions {
    font-family: ProximaNovaSemiBold,Helvetica,Arial;
    color: #222;
    font-size: 14px;
    padding: 10px;
}
.tstbl {
    padding: 5px;
}
.tstbl tr:nth-child(odd){
    background-color: #e6e6e6;
}
.tstbl tr:nth-child(even){
    background-color: #ffffff;
}
.applink {
    font-family: NotoSansBold,Helvetica,Arial;
    color: #337ec6;
    text-decoration: none;
    font-size: 12px;
    font-weight: normal;
    text-align: left;
}
.errorbar {
    padding-left: 5px;
    border-left: 5px solid red;
}
._errorcorner {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAEDWlDQ1BJQ0MgUHJvZmlsZQAAOI2NVV1oHFUUPrtzZyMkzlNsNIV0qD8NJQ2TVjShtLp/3d02bpZJNtoi6GT27s6Yyc44M7v9oU9FUHwx6psUxL+3gCAo9Q/bPrQvlQol2tQgKD60+INQ6Ium65k7M5lpurHeZe58853vnnvuuWfvBei5qliWkRQBFpquLRcy4nOHj4g9K5CEh6AXBqFXUR0rXalMAjZPC3e1W99Dwntf2dXd/p+tt0YdFSBxH2Kz5qgLiI8B8KdVy3YBevqRHz/qWh72Yui3MUDEL3q44WPXw3M+fo1pZuQs4tOIBVVTaoiXEI/MxfhGDPsxsNZfoE1q66ro5aJim3XdoLFw72H+n23BaIXzbcOnz5mfPoTvYVz7KzUl5+FRxEuqkp9G/Ajia219thzg25abkRE/BpDc3pqvphHvRFys2weqvp+krbWKIX7nhDbzLOItiM8358pTwdirqpPFnMF2xLc1WvLyOwTAibpbmvHHcvttU57y5+XqNZrLe3lE/Pq8eUj2fXKfOe3pfOjzhJYtB/yll5SDFcSDiH+hRkH25+L+sdxKEAMZahrlSX8ukqMOWy/jXW2m6M9LDBc31B9LFuv6gVKg/0Szi3KAr1kGq1GMjU/aLbnq6/lRxc4XfJ98hTargX++DbMJBSiYMIe9Ck1YAxFkKEAG3xbYaKmDDgYyFK0UGYpfoWYXG+fAPPI6tJnNwb7ClP7IyF+D+bjOtCpkhz6CFrIa/I6sFtNl8auFXGMTP34sNwI/JhkgEtmDz14ySfaRcTIBInmKPE32kxyyE2Tv+thKbEVePDfW/byMM1Kmm0XdObS7oGD/MypMXFPXrCwOtoYjyyn7BV29/MZfsVzpLDdRtuIZnbpXzvlf+ev8MvYr/Gqk4H/kV/G3csdazLuyTMPsbFhzd1UabQbjFvDRmcWJxR3zcfHkVw9GfpbJmeev9F08WW8uDkaslwX6avlWGU6NRKz0g/SHtCy9J30o/ca9zX3Kfc19zn3BXQKRO8ud477hLnAfc1/G9mrzGlrfexZ5GLdn6ZZrrEohI2wVHhZywjbhUWEy8icMCGNCUdiBlq3r+xafL549HQ5jH+an+1y+LlYBifuxAvRN/lVVVOlwlCkdVm9NOL5BE4wkQ2SMlDZU97hX86EilU/lUmkQUztTE6mx1EEPh7OmdqBtAvv8HdWpbrJS6tJj3n0CWdM6busNzRV3S9KTYhqvNiqWmuroiKgYhshMjmhTh9ptWhsF7970j/SbMrsPE1suR5z7DMC+P/Hs+y7ijrQAlhyAgccjbhjPygfeBTjzhNqy28EdkUh8C+DU9+z2v/oyeH791OncxHOs5y2AtTc7nb/f73TWPkD/qwBnjX8BoJ98VVBg/m8AAAA5SURBVBgZY/zPwABEhAEjSAkxisEKiVEMV0hIMYpCfIoxFOJSjFUhNsU4FaIrxqsQXTGIjxeAwhkA/x0T9gDAanEAAAAASUVORK5CYII=');
    background-repeat: no-repeat;
    background-position: right top;
}

    </style>

</head>
<body></body>
</html>
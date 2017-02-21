// R Cook
// v1.0.1
// 2017-02-21
// Template script to load a viewport with 5 panels

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function () {
        console.log('f launch');
        var me = this; // <- Personal preference but I like me rather than this;)
        me._createLayout();
    },
    _createLayout: function () {
        console.log('f _createLayout');
        var me = this;
        var x = 0;

        me._loadData();

        // We are build ing this layout 
        // |""""""""|""""""""""""""""""""""""""""|""""""""|
        // | West   | North                      | East   |
        // |        |""""""""""""""""""""""""""""|        |
        // |        | Center                     |        |
        // |        |""""""""""""""""""""""""""""|        |
        // |        | South                      |        |
        // |""""""""|""""""""""""""""""""""""""""|""""""""|
        /*
                this.viewport = Ext.create('Ext.container.Viewport', {
                    extend: 'Ext.app.Controller',
                    layout: 'border',
                    items: [{
                        region: 'north',
                        xtype: 'panel',
                        itemId: 'north',
                        id: 'viewPortnorth',
                        height: 120,
                        minHeight: 120,
                        html: 'South',
                        collapsible: true,
                        layout: 'fit'
                    }, {
                        region: 'center',
                        xtype: 'panel',
                        itemId: 'center',
                        autoScroll: 'true',
                        id: 'viewPortCenter',
                        layout: 'fit'
                    }, ],
                    listeners: {
                        beforerender: function () {
                            // Triggers before the parent viewport loads
                            console.log('Viewport Loading');
                        },
                        afterrender: function () {
                            // Triggers after the viewport & all of its panels have loaded
                            console.log('Viewport Rendered');
                            me._loadData();
                        },
                        add: function () {
                            // Counts in our viewports regions as they load
                            x++;
                            console.log('Viewport Rendering [ #', x, ']');
                        },
                        scope: me
                    },
                });
                x = null;
        */
        console.log('finished');






    },
    _getFilters: function () {

        var myFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Feature',
            operation: '!=',
            value: null
        });

        return myFilter;

        // EXTRA EXAMPLE showing AND + OR combination; (commented code only)
        /*
      var blockedFilter = Ext.create('Rally.data.wsapi.Filter', {
              property: 'Blocked',
              operation: '=',
              value: true
      });
 
      var iterationSeverityFilter = iterationFilter.and(severityFilter);
      var myFilters = blockedFilter.or(iterationSeverityFilter);

      return myFilters;
      */
    },

    // Get data from Rally
    _loadData: function () {
        var me = this;
        // filters to send to Rally during the store load
        var myFilters = this._getFilters();

        console.log('my filter', myFilters.toString());

        // if store exists, just load new data
        if (me.defectStore) {
            console.log('store exists');
            me.defectStore.setFilter(myFilters);
            me.defectStore.load();

            // create store
        } else {
            console.log('creating store');
            me.defectStore = Ext.create('Rally.data.wsapi.Store', { // create defectStore on the App (via this) so the code above can test for it's existence!
                model: 'User Story',
                autoLoad: true, // <----- Don't forget to set this to true! heh
                filters: myFilters,
                listeners: {
                    load: function (myStore, myData, success) {
                        console.log('got data!', myStore, myData);
                        if (!me.defectGrid) { // only create a grid if it does NOT already exist
                            me._createGrid(myStore); // if we did NOT pass scope:this below, this line would be incorrectly trying to call _createGrid() on the store which does not exist.
                        }
                    },
                    scope: me // This tells the wsapi data store to forward pass along the app-level context into ALL listener functions
                },
                fetch: ['FormattedID', 'Name', 'Feature', 'Parent'] // Look in the WSAPI docs online to see all fields available!
            });
        }
    },

    // Create and Show a Grid of given defect
    _createGrid: function (myDefectStore) {

        var me = this;

        var defectGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myDefectStore,
            columnCfgs: [ // Columns to display; must be the same names specified in the fetch: above in the wsapi data store
                'FormattedID', 'Name', 'Feature', 'Parent'
            ]
            
        });
        //this.viewport.getComponent('center').add(me.defectGrid);
        //me.add(me.defectGrid); // add the grid Component to the app-level Container (by doing this.add, it uses the app container)


        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [defectGrid]
        });

    },

    getColumnCfgs: function () {
        var app = this;
        config_obj = Ext.JSON.decode(this.layoutConfig);
        // I am sure there are better ways to do this, but it works....
        var fieldList = [];
        for (key in config_obj.fields) {
            if (config_obj.fields[key].view) {
                if (config_obj.fields[key].Name === 'Parent') {
                    fieldList.push({
                        dataIndex: 'Parent',
                        text: 'Business Outcome',
                        renderer: function (field, cell, record, row, column, view) {
                            var nclass = ' class=applink';
                            var name = '<-- Click to Set -->';
                            if (record.data.Parent) {
                                name = record.data.Parent._refObjectName;
                            } else {
                                nclass = ' class=errorbar';
                            }
                            return '<div' + nclass + '>' + name + '</div>';
                        },
                        listeners: {
                            click: function (view, cellObject, row, column, event, record, rowObject) {
                                Ext.create('Rally.ui.dialog.ArtifactChooserDialog', {
                                    artifactTypes: [app.parentModelName],
                                    autoShow: true,
                                    title: 'Choose a ' + app.parentModelName,
                                    listeners: {
                                        artifactchosen: function (dialog, selectedRecord) {
                                            record.set('Parent', selectedRecord.get('_ref'));
                                            record.save().then({
                                                success: function (a, b, c, d, e, f, g) {
                                                    Rally.ui.notify.Notifier.show({
                                                        message: 'Item: ' + record.get('FormattedID') + ' updated'
                                                    });
                                                },
                                                failure: function (error) {
                                                    Rally.ui.notify.Notifier.showError({
                                                        message: 'Failed to save item: ' + record.get('FormattedID')
                                                    });
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
        if (!this.getSetting('enableFormattedID')) {
            clmns.push({
                dataIndex: 'FormattedID',
                text: 'ID',
                renderer: function (item, row, record, arg4, arg5) {
                    var tpl = new Ext.XTemplate(
                        '<tpl for=".">',
                        '<span class="icon-eye-open">',
                        '</span>',
                        '<span class="applink" id={[this._getLinkId(values)]}>',
                        '{[this._getPopUp()]}',
                        '</span>',
                        '</tpl>', {
                            _getLinkId: function (x, y, z) {
                                var result = Ext.id();
                                Ext.Function.defer(this.addListener, 10, this, [result]);
                                return result;
                            },
                            _getPopUp: function (w, x, y, z) {
                                return item;
                            },
                            addListener: function (id) {
                                var config_obj = Ext.JSON.decode(app.layoutConfig);
                                Ext.get(id).on('click', function () {
                                    app._buildForm(app.model, config_obj.fields, record);
                                });
                            }
                        });
                    return tpl.apply(record)
                }
            });
        } else {
            clmns.push('FormattedID');
        }
        if (this.getSetting('approvalField')) {
            clmns.push({
                dataIndex: 'Project',
                text: 'Category',
                renderer: function (item) {
                    return item._refObjectName;
                }
            });
        }
        clmns = clmns.concat(fieldList);
        //this.logger.log('gridColumnCfgs', clmns);
        return clmns;
    },



});
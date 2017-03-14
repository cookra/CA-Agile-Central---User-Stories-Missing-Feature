// R Cook
// v1.0.1
// 2017-03-02
// Template script to load a viewport with 5 panels
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    myFetch: [],
    myCols: [],
    // Filter theFetch
    // 0 -> Hide columns
    // 1 -> Add Column
    // 1/0 -> Both will be fetched from the query
    dataList: [
        [1, 'FormattedID'],
        [1, 'Name'],
        [1, 'Project'],
        [1, 'Owner'],
        [1, 'CreatedDate'],
        [1, 'DisplayColor'],
        [1, 'ScheduleState'],
        [1, 'Blocked'],
        [1, 'DirectChildrenCount'],
        [1, 'Defects'],
        [1, 'Iteration'],
        [1, 'PlanEstimate'],
        [1, 'Predecessors'],
        [1, 'Successors'],
        [1, 'Release'],
        [1, 'TestCases'],
    ],
    launch: function () {
        this._mask();
        console.log('\033[2J'); // clear the console
        var me = this;
        for (var j = 0; j < this.dataList.length; j++) {
            if (this.dataList[j][0] === 1) {
                this.myFetch.push(this.dataList[j][1]);
                this.myCols.push(this.dataList[j][1]);
                console.log('@ _launch Filter Fetch (+) ', this.dataList[j][1]);
            }
            if (this.dataList[j][0] === 0) {
                this.myFetch.push(this.dataList[j][1]);
                console.log('@ _launch Filter Fetch (-) ', this.dataList[j][1]);
            }
        }
        this._loadData();
    },
    _getFilters: function () {
        var myFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Feature',
            operation: '=',
            value: null
        });
        return myFilter;
    },
    _loadData: function () {
        var me = this;
        var myFilters = this._getFilters();
        console.log('my filter', myFilters.toString());
        if (me.userStoryStore) {
            console.log('store exists');
            me.userStoryStore.setFilter(myFilters);
            me.userStoryStore.load();
        } else {
            console.log('creating store');
            me.userStoryStore = Ext.create('Rally.data.wsapi.Store', { // create 
                model: 'User Story',
                limit: 200,
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function (myStore, myData, success) {
                        console.log('got data!', myStore, myData);
                        if (!me.userStoryGrid) {
                            me._createGrid(myStore, myData);
                        }
                    },
                    scope: me
                },
                fetch: this.myFetch
            });
        }
    },

    _mask: function () {
        //this.add(Ext.create('App.Loader')._build('bar'));
    },
    _createGrid: function (myStore, myData) {
        var xData1 = this.getContext().getUser();
        var xData2 = this.getContext().getProject();
        var xData3 = this.getContext().getWorkspace();
        var appVersion = Ext.create('App.System')._this_Application_Details('inapp');
        var myColours_Barclays = Ext.create('App.Config').PbarclaysColours_5
        var bodyStyle = 'font-size:20px;padding:10px; color:' + myColours_Barclays[3] + ';';
        var tabColour_1 = myColours_Barclays[0];
        var tabColour_2 = myColours_Barclays[0];
        var tabColour_3 = myColours_Barclays[0];
        var panelBaseColor = myColours_Barclays[0];
        var colour_Background_Darken = Ext.create('App.Tools')._shadeBlendConvert(panelBaseColor, -20);
        var colour_Background = 'background: repeating-linear-gradient(  -45deg,  ' + panelBaseColor + ',' + panelBaseColor + ' 10px,  ' + colour_Background_Darken + ' 10px,  ' + colour_Background_Darken + ' 20px);';


        //PbarclaysColours_5: ['#145FAC', '#437EA0', '#00AEEF', '#FFF', '#FFA000'],

        var viewport = Ext.create('Ext.container.Viewport', {
            items: [{
                region: 'north',
                collapsible: true,
                items: [{
                    xtype: 'tabpanel',
                    width: '100%',
                    items: [{
                        title: 'About',
                        width: '100%',
                        html: 'This custom page display artifacts that are considered to be orphaned',
                        height: 50,
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: tabColour_1,
                            }
                        },
                        /*
                        buttons: [{
                            text: 'Button 1'
                        }]
                        */
                    }, {
                        title: 'Version',
                        width: '100%',
                        html: appVersion[2] + ' ' + appVersion[4] + ' ' + appVersion[3] + ' ' + appVersion[6],
                        height: 50,
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: tabColour_2,
                            }
                        },
                    }, {
                        title: 'Support',
                        width: '100%',
                        height: 50,
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: tabColour_3,
                            }
                        },
                        items: [{
                            xtype: 'button',
                            text: 'Support',
                            height: 25,
                            style: {
                                backgroundColor: 'red',
                            },
                            listeners: {
                                afterrender: function (v) {
                                    v.el.on('click', function () {
                                        console.log('[ ' + myStore + ' ] Clicked ');
                                        Ext.create('App.Emailer')._emailer(myData, xData1, xData2, xData3);
                                    });
                                },
                                scope: this
                            },
                        }]
                    }]
                }]
            }, {
                region: 'south',
                layout: 'fit',
                flex: 1,
                items: [{

                    xtype: 'tabpanel',
                    width: '100%',
                    items: [{
                        title: 'User Stories',
                        width: '100%',
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                        items: [{
                            xtype: 'rallygrid',
                            store: myStore,
                            height: '100%',
                            columnCfgs: this.myCols,
                        }]
                    }, {
                        title: 'Features',
                        width: '100%',
                        html: 'X',
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                    }, {
                        title: 'Features',
                        width: '100%',
                        html: 'X',
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                    }, {
                        title: 'Business outcomes',
                        width: '100%',
                        html: 'X',
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                    }, {
                        title: 'Portfolio Objectives',
                        width: '100%',
                        html: 'X',
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                    }, {
                        title: 'Strategic Objectives',
                        width: '100%',
                        html: 'X',
                        bodyStyle: colour_Background + bodyStyle,
                        cls: 'fixTabMargins',
                        tabConfig: {
                            style: {
                                background: '#808080',
                            }
                        },
                    }],


                }]
            }]
        });
    },
});
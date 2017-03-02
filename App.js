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

    items: [ // pre-define the general layout of the app; the skeleton (ie. header, content, footer)
        {
            xtype: 'container', // this container lets us control the layout of the pulldowns; they'll be added below
            itemId: 'pulldown-container',
            margin: '5 5 5 5',
            layout: {
                type: 'hbox', // 'horizontal' layout
                align: 'stretch'
            }
        }, {
            xtype: 'box',
            id: 'myTarget',
            autoScroll: true,
            margin: '10 5 5 10',
            width: '100%',
            style: {
                borderTop: '1'
            },
            autoEl: {
                tag: 'div',
                cls: 'myContent',
                html: '',
            },
            listeners: {
                add: function () {
                    console.log('@ Launch Added Content Box');
                },
                scope: this
            },
            flex: 1
        }
    ],
    launch: function () {
        console.log('\033[2J'); // clear the console
        var me = this;
        var xData1 = this.getContext().getUser();
        var xData2 = this.getContext().getProject();
        var xData3 = this.getContext().getWorkspace();
        var xData4 = this.getContext().getSubscription();
        //var gEpros = App.Emailer; // shorten global property string
        // var gRpros = App.Runtime; // shorten global property string
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

        var layout = Ext.create('Ext.container.Container', {
            layout: 'fit',
            align: 'stretch',
            height: '100%',
            layoutConfig: {
                align: 'stretch',
            },
            items: [{
                xtype: 'panel',
                width: 300,
                border: false,
                layout: 'hbox',
                html: '',
                id: 'myHeader',
                itemId: 'header',
                height: 300,
                listeners: {
                    afterrender: function () {
                        console.log('@ Launch Added Panel');
                        me._loadData();
                    },
                    scope: me
                },
                items: [{
                    xtype: 'button',
                    text: 'Support',
                    margin: '5 5 5 20',
                    listeners: {
                        afterrender: function (v) {
                            v.el.on('click', function () {
                                var email = new gEpros._emailer(MySharedData.supportArray, xData1, xData2, xData3, xData4);
                                console.log('@ Launch Added Support Button');
                            });
                        },
                        scope: me
                    }
                }],
            }, {
                xtype: 'box',
                id: 'myTarget',
                autoScroll: true,
                margin: '10 5 5 10',
                width: '100%',
                style: {
                    borderTop: '1'
                },
                autoEl: {
                    tag: 'div',
                    cls: 'myContent',
                    html: '',
                },
                listeners: {
                    add: function () {
                        console.log('@ Launch Added Content Box');
                    },
                    scope: me
                },
                flex: 1
            }]
        });
        this.add(layout);
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
                limit: Infinity,
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function (myStore, myData, success) {
                        console.log('got data!', myStore, myData);
                        if (!me.userStoryGrid) {
                            me._createGrid(myStore);
                        }
                    },
                    scope: me
                },
                fetch: this.myFetch
            });
        }
    },
    _createGrid: function (myuserStoryStore) {
        console.log(this.myCols);
        var userStoryGrid = Ext.create('Rally.ui.grid.Grid', {
            store: myuserStoryStore,
            columnCfgs: this.myCols
        });
        var viewport = Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [userStoryGrid]
        });
        console.log('GRID ', this.myFetch);
        Ext.fly('myTarget').update(viewport);



    },
});
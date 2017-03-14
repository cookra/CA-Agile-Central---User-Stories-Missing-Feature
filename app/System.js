Ext.define('App.System', {
    // Created by Richard Cook ::: Cookra Limited
    // Barclaycard richard.cook@barclaycard.co.uk
    // v4.8
    // Updated 2017-03-08
    _this_Application_Details: function (type) {
        var Output;
        var a = [];
        a.push('> - - - - - - - - - - < Application Details');
        a.push('> App Name : ' + 'Orphaned Items');
        a.push('> App Version : ' + 'v4.1b');
        a.push('> App Version Status : ' + 'beta');
        a.push('> App Designer : ' + 'Richard Cook');
        a.push('> App Description : ' + 'Custom Ext JS Application that displays orphaned artifacts');
        a.push('> App Release Date : ' + '2017-03-13');
        if(type==='email'){
            output = Ext.create('App.Tools')._common_Array_Outputter(a);
        }else if(type==='inapp'){
            output = a;
        }
        return output;
    },
    _this_Application_Output: function (array) {
        var a = [];
        console.log('xxx ',array);
        a.push('> - - - - - - - - - - < Application Output');
        for (var i = 0; i < array.length; i++) {
            a.push('> FormattedID : ' + array[i].raw.FormattedID + ' Name : ' + array[i].raw.Name + ' _Ref : ' + array[i].raw._ref);
        }
        array = undefined;
        return Ext.create('App.Tools')._common_Array_Outputter(a);
    },
    _user_Vars: function () {
        var a = [];
        a.push('> - - - - - - - - - - < Local Details');
        a.push('> Browser Web App Name : ' + navigator.appName);
        a.push('> Browser User Agent : ' + navigator.userAgent);
        a.push('> Browser Version : ' + navigator.appVersion);
        a.push('> Browser Code Name : ' + navigator.appCodeName);
        a.push('> Platform : ' + navigator.platform);
        a.push('> OS CPU : ' + navigator.oscpu);
        a.push('> Cookies : ' + navigator.cookieEnabled);
        a.push('> Outer Width : ' + window.outerWidth);
        a.push('> Outer Height : ' + window.outerHeight);
        a.push('> Inner Width : ' + window.innerWidth);
        a.push('> Inner Height : ' + window.innerHeight);
        a.push('> Base URI : ' + document.getElementsByTagName('script')[0].baseURI);
        a.push('> SRC : ' + document.getElementsByTagName('script')[0].src);
        a.push('> LocalName : ' + document.getElementsByTagName('script')[0].localName);
        a.push('> Type : ' + document.getElementsByTagName('script')[0].type);
        return Ext.create('App.Tools')._common_Array_Outputter(a);
    },
    _user_Rally_Vars: function (context_User, context_Project, context_Workspace) {
        var a = [];
        a.push('> - - - - - - - - - - < User Details');
        a.push('> AC User Username : ' + context_User.UserName);
        a.push('> AC User Name : ' + context_User._refObjectName);
        a.push('> AC User Role : ' + context_User.Role);
        a.push('> AC Application Launched From Node : ' + context_Project._refObjectName);
        a.push('> AC Application Workspace Name : ' + context_Workspace._refObjectName);
        a.push('> AC Application Workspace Date/Time Format : ' + context_Workspace.WorkspaceConfiguration.DateFormat);
        return Ext.create('App.Tools')._common_Array_Outputter(a);
    },
});
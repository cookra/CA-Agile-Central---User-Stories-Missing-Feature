Ext.define('Loading', {
    singleton: true,
    _mask: function (message) {
        console.log('@ _mask We are loading the store, show the spinner');
        if (this.sparkler) {
            this.sparkler.destroy();
        }
        this.sparkler = new Ext.LoadMask(this, {
            msg: message
        });
        this.sparkler.show();
    },
    _unmask: function () {
        console.log('@ _unmask We have the data so destroy the spinner');
        if (this.sparkler) {
            this.sparkler.hide();
        }
    },
});
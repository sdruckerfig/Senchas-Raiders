Ext.define('MyApp.view.shipcontrols.ShipActions', {
    extend: 'Ext.Toolbar',
    alias: 'widget.shipactions',
    requires: ['Ext.Button'],
    config: {
        docked: 'left',
        layout: {
            type: 'vbox',
            pack: 'justify'
        },
        defaults: {
           flex: 1
        },
        items: [

        {
            xtype: 'button',
            text: 'Pau',
            itemId: 'btnPause'
        },
        {
            xtype: 'button',
            text: 'Aft',
            itemId: 'btnAft'
        }, {
            xtype: 'button',
            text: 'Shld',
            itemId: 'btnShields'
        }, {
            xtype: 'button',
            text: 'Tac',
            itemId: 'btnTactical'
        }, {
            xtype: 'button',
            text: 'Map',
            itemId: 'btnMap'
        }, 
        {
            xtype: 'button',
            text: 'Warp',
            itemId: 'btnWarp'
        },
        

        {
            xtype: 'spacer'
        }, {
            xtype: 'button',
            text: 'Fire!',
            itemId: 'btnFire',
            flex: 2
        }

        ]


    }

});
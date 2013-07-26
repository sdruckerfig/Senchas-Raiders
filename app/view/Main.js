Ext.define('MyApp.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    requires: [
            'MyApp.view.intro.Intro',
            'MyApp.view.ViewScreen',
            'MyApp.view.Speedbar',
            'MyApp.view.shipcontrols.ShipActions',
            'MyApp.view.PlayField',
            'MyApp.view.Sounds',
            'MyApp.view.shipcontrols.GalacticMap',
            'MyApp.view.MainView'
    ],

    config: {
        layout: {
            type: 'card',
            animation: 'flip'
        },
        items: [
            {
                xtype: 'intro' //activeItem == 0
            }
        ]
    }

});
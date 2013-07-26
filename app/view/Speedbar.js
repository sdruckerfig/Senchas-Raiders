Ext.define('MyApp.view.Speedbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.speedbar',
    requires: ['MyApp.view.verticalslider.SliderField'],
    config: {
        docked: 'right',
        layout: {
            type: 'vbox',
            pack: 'center'
        },
        items: [

        {
            xtype: 'verticalsliderfield',
            itemId: 'velocity',
            flex: 1,
            value: 1,
            minValue: 0,
            maxValue: 9,
            margin: '5 0 10 0'
        }

        ]
    }

});
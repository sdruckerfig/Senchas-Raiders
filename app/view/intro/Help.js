Ext.define('MyApp.view.intro.Help', {
	extend: 'Ext.Container',
	xtype: 'help',
	config: {
		items: [{
				xtype: 'titlebar',
				docked: 'top',
				title: 'Help',
				items: [{
						xtype: 'button',
						align: 'left',
						ui: 'back',
						text: 'Back'
					}
				]
			}
		]
	}
})
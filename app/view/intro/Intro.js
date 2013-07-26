Ext.define('MyApp.view.intro.Intro', {
	extend: 'Ext.Container',
	
	xtype: 'intro',
	requires: [
			'MyApp.view.intro.Home', 'MyApp.view.intro.GameOver'
	],
	config: {
		itemId: 'introview',
		layout: {
			type: 'card',
			animation: 'flip'
		},

		items: [{
				xtype: 'home'
			}, {
				xtype: 'container',
				layout: 'fit',
				itemId: 'sub'
			}
		]
	}
});
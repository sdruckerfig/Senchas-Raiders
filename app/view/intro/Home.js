Ext.define('MyApp.view.intro.Home', {
	extend: 'Ext.Container',
	xtype: 'home',
	requires: [
			'Ext.draw.Component',
			'MyApp.view.enemyship.Enemy4',
			'Ext.Container',
			'Ext.Button',
			'Ext.layout.Fit',
			'Ext.draw.Component'
	],
	config: {
		// cls: 'starbackground',
		cls: 'introbackground',
		layout: 'fit',
		items: [

			{
				xtype: 'draw',
				engine: 'Ext.draw.engine.Canvas',
				itemId: 'homedraw'
			}, 
			
			{
				xtype: 'component',
				html: 'Version 0.99',
				cls: 'titlePageText',
				margin: '5 0 0 5',
				top: 0,
				left: 0,
				zIndex: 0,
				width: '85%',
				height: '85%'
			},
			
			{
				xtype: 'container',
				margin: '0 5 0 0',
				docked: 'right',
				width: 100,
				layout: {
					type: 'vbox',
					pack: 'justify'
				},
				
				items: [{
						xtype: 'button',
						text: 'Resume',
						hidden: true,
						itemId: 'btnResumeGame',
						ui: 'confirm'
					}, {
						xtype: 'button',
						text: 'New Game',
						itemId: 'btnNewGame'
					}, {
						xtype: 'button',
						text: 'Instructions',
						itemId: 'btnInstructions'
					}, {
						xtype: 'button',
						text: 'High Scores',
						itemId: 'btnHighScores'
					}, {
						xtype: 'button',
						text: 'Settings',
						itemId: 'btnSettings'
					}, {
						xtype: 'button',
						text: 'Credits',
						itemId: 'btnCredits'
					},
					{
						xtype: 'button',
						text: 'Contact',
						itemId: 'btnContact'
					}
				]
			}

		]

	}


})
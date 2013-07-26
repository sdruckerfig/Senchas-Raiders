Ext.define('MyApp.view.intro.Instructions', {
	extend: 'Ext.Container',
	xtype: 'instructions',
	config: {
		cls: 'instructions',
		scrollable: true,
		styleHtmlContent: true,
		contentEl: 'instructions',
		items: [
			{
				xtype: 'titlebar',
				title: 'Instructions',
				docked: 'top',
				items: [{
						xtype: 'button',
						text: 'Back',
						ui: 'back',
						align: 'left',
						itemId: 'btnBack'
					}
				]
			}
		]
	}
});
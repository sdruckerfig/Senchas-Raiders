Ext.define('MyApp.view.intro.Contact', {
	extend: 'Ext.Container',
	xtype: 'contact',
	config: {
		cls: 'instructions',
		styleHtmlContent: true,
		contentEl: 'contactus',
		scrollable: true,
		items: [{
				xtype: 'titlebar',
				docked: 'top',
				title: 'About Fig Leaf Software',
				items: [{
						xtype: 'button',
						align: 'left',
						ui: 'back',
						text: 'Back',
						itemId: 'btnBack'
					},
					{
						xtype: 'button',
						align: 'right',
						text: 'Contact Us',
						handler: function() {
							location.href = 'mailto:info@figleaf.com?subject=Consulting%20Services%20Request'
						}
					}
				]
			}
		]
	}
})
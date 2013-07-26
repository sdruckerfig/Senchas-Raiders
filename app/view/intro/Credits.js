Ext.define('MyApp.view.intro.Credits', {
	extend: 'Ext.Container',
	xtype: 'credits',
	config: {
		cls: 'starbackground credits',
		contentEl: 'credits',
		items: [{
				xtype: 'titlebar',
				docked: 'top',
				title: 'Credits',
				items: [{
						xtype: 'button',
						align: 'left',
						ui: 'back',
						text: 'Back',
						itemId: 'btnBack'
					}
				]
			}
		],
		listeners: {
			activate: function(cmp) {
				// center floating titles
				var el = Ext.get(Ext.select('#' + cmp.getId() + ' h1').elements[0]);
				var height = Ext.Viewport.element.getHeight();
				var width = Ext.Viewport.element.getWidth();
				
				el.setStyle("left", (width / 2 - 70) + "px");
				el.setStyle("top", (height / 2 - 100) + "px");

			}
		}
	}
})
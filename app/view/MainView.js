Ext.define('MyApp.view.MainView', {
	extend: 'Ext.Container',
	xtype: 'mainview',
	requires: [
		'MyApp.view.joystick.Joystick'
	],
	config: {
		layout: 'fit',
		items: [{
				xtype: 'container',
				layout: 'fit',
				itemId: 'mainviewscreen',
				items: [{
						xtype: 'viewscreen',
						cls: 'starfield'
					}
				]
			}, {
				xtype: 'shipactions',
				width: 80,
				docked: 'right'
			}, {
				xtype: 'sounds',
				hidden: true
			}, {
				xtype: 'speedbar',
				docked: 'left',
				width: 60
			}
		]
	},
	initialize: function() {

		if (Ext.os.deviceType !== 'Desktop') {
			Ext.ComponentQuery.query('speedbar')[0].destroy();
		}

		if (Ext.os.is.Desktop) {
			/*this.add({
				xtype: 'sounds',
				url: 'resources/sounds/thrust.mp3',
				itemId: 'sndThrust',
				ambientTrack: 'sndThrust',
				playAmbient: true,
				hidden: true,
				tracks: {
					sndThrust: {
						start: 0,
						length: 7.24
					}
				}
			});*/
		}


		this.on('activate', this.onActivated, this, {
			single: true,
			delay: 500
		});
		// this.on('resize', this.onResize, this);
	
		var h = Ext.Viewport.element.getHeight();

		this.add({
			xtype: 'joystick',
			width: 80,
			height: 80,
			top: h - 90,
			left: 5
		});

		this.callParent(arguments);
	},
	/*
	onResize: function(cmp) {

		var statusBar = this.down('#shipstatuspanel');
		if (statusBar) {
			statusBar.setTop(this.down('#mainviewscreen').element.getHeight() - 35);
		}
	},

	*/
	onActivated: function() {
		var mainV = this.down('#mainviewscreen');
		/*
		mainV.add({
			xtype: 'component',
			itemId: 'shipstatuspanel',
			height: 30,
			tpl: 'E: <span style="width:64px; display: inline-block; text-align: left;">{totalEnergy}</span> T: <span style="width:20px; display: inline-block; text-align: left;">{torpedoes}</span> ',
			// html: 'hey',
			cls: 'shipstatuspanel',
			top: mainV.element.getHeight() - 35,
			left: 0,
			margin: '0 3 3 3',
			width: '100%'
		});
		*/
		mainV.add({
			xtype: 'playfield'
		})
	}
});
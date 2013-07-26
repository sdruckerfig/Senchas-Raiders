Ext.define('MyApp.view.starbase.Freighter', {
	extend: 'Ext.draw.sprite.Image',
	alias: ['sprite.freighter','widget.freighter'],
	
	inheritableStatics: {
		def: {
			defaults: {
				itemId: 'shuttle',
				src: 'resources/images/spacestation/Freighter.png',
				width: 10,
				height: 10,
				x: 0,
				y: 0,
				zIndex: 1
			}
		}
	},

	w: null, // size of canvas
	h: null,
	actualSize: 130,
	dockingSequence: 0,

	constructor: function() {
		this.callParent(arguments);
		this.markedForDeath = false;
		this.fx.setEasing('easeIn');
		this.dockWithShip();
	},

	destroy: function() {
		this.markedForDeath = true;
		this.callParent(arguments);
	},

	dockWithShip: function() {
		this.dockingSequence = 1;
		this.fx.setDuration(6000);
		this.fx.on('animationend', this.onAnimationEnd, this);
		this.setAttributes({
			width: 75,
			height: 75,
			x: Math.floor(this.config.canvasWidth / 2 + 50),
			y: Math.floor(this.config.canvasHeight / 2 + 50)
		});
	},

	onAnimationEnd: function() {
		switch (this.dockingSequence) {
			case 1: 
				this.dockingSequence++;
				this.fx.setEasing('linear');
				this.fx.setDuration(4000);
				this.setAttributes({
					width: 150,
					height: 150,
					x: Math.floor(this.config.canvasWidth + 50),
					y: Math.floor(this.config.canvasHeight + 50)
				});
				break;
			case 2: 
				this.getParent().getParent().fireEvent('docked',this);
				break;
		}
	}

});
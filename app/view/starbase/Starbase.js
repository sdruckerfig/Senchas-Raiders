Ext.define('MyApp.view.starbase.Starbase', {
	extend: 'Ext.draw.sprite.Image',
	alias: 'sprite.starbase',
	
	inheritableStatics: {
		def: {
			defaults: {
				src: 'resources/images/spacestation/Space-Station1.png',
				width: 1,
				height: 1,
				x: 0,
				y: 0,
				zIndex: 1
			}
		}
	},
	frameCounter: 0,
	frames: 24,
	w: null, // size of canvas
	h: null,
	surface: null,


	constructor: function() {
		this.callParent(arguments);
		this.markedForDeath = false;
		this.fx.setEasing('easeOut');
		this.animateShip = Ext.Function.bind(this.changeShipSkin, this);
	},

	startRotation: function() {

		this.animateShip();
		this.surface = this.getParent().getParent().getSurface();
	},

	changeShipSkin: function() {


		this.frameCounter++;
		if (this.frameCounter > this.frames) {
			this.frameCounter = 1;
		}

		try {
			this.setAttributes({
				src: 'resources/images/spacestation/Space-Station' + this.frameCounter + '.png'
			});
			this.surface.renderFrame();
		} catch (err) {
			// exception generated if destroyed in middle of cycle
		}

		// halt animation if destroyed
		if (!this.markedForDeath) {
			window.requestAnimationFrame(this.animateShip);
			/*
			Ext.defer(function() {
				
			},30,this);
			*/
		}
			


	},

	destroy: function() {
		this.markedForDeath = true;
		this.callParent(arguments);
	},

	moveShip: function() { // reserved for future use
		/*
		this.fx.setDuration(Math.floor(Math.random() * 5000));
		this.fx.on('animationend', this.onAnimationEnd, this);
		var depth = Math.floor(Math.random() * 70) + 20;
		this.setAttributes({ 
			x: Math.floor(Math.random() * this.w),
			y: Math.floor(Math.random() * this.h),
			width: depth,
			height: depth
		});
		*/
	}
});
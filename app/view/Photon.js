Ext.define('MyApp.view.Photon', {
	extend: 'Ext.draw.sprite.Image',
	alias: 'sprite.photontorpedo',
	requires: ['MyApp.util.Functions'],
	inheritableStatics: {
		def: {
			processors: {
				/**
				 * @cfg {string} [photonTube=''] The torpedo tube that launched the photon
				 */
				photonTube: 'string'
			},
			defaults: {
				src: 'resources/images/photons/photon4-24bit.png',
				width: 150,
				height: 150,
				photonTube: '0',
				destX: 0,
				destY: 0
			}
		}
	},
	stageWidth: 0,
	stageHeight: 0,
	
	
	constructor: function(config) {

		this.callParent(arguments);
		this.markedForDeath = false;
		this.photonMotion = Ext.Function.bind(this.animatePhoton, this);
	},
	
	//We now want the photons to reload on a timer as opposed to reloading when one of them finishes their animation
	
	firePhoton: function(customReloadTime) {
		var surface = this.config.surface;
		this.stageWidth = surface.element.getWidth(true);
		this.stageHeight = surface.element.getHeight(true);
		var centerX = this.stageWidth / 2;
		var centerY = this.stageHeight / 2;
		switch (this.config.photonTube) {
			case 0:
				this.setAttributes({
					x: -100, //The starting locations for the left photon, the right photon's loc is scaled to the length of the playfield
					y: this.stageHeight
				});
				break;
			case 1:
				this.setAttributes({
					x: this.stageWidth,
					y: this.stageHeight
					
				});
				break;
		}
		var scaleFactor = 1500 / MyApp.util.Functions.distance(this.attr.x, this.attr.y, this.stageWidth / 2, this.stageHeight / 2);
		//debugger;

		surface.add(this);
		var reloadTime = 1500; //Can also be modified for changes in gameplay
		
		if (customReloadTime != -1) {
			reloadTime = customReloadTime;
			//console.log(reloadTime);
		}
		Ext.defer(this.readyToReload, reloadTime, [this]);
		this.config.destX = centerX + this.config.offsetX;
		this.config.destY = centerY + this.config.offsetY;

		var tempX = this.attr.x;
		var tempY = this.attr.y;

		var tempX = Math.min(this.attr.x, Math.abs(this.attr.x - this.stageWidth));
		var duration = MyApp.util.Functions.distance(tempX, tempY, this.config.destX, this.config.destY) * scaleFactor;
		duration = 1500; //preserve this until we know exactly what we wanna do with the photon speeds and how we're gonna do it.
		this.fx.setDuration(duration);
		this.fx.setEasing('easeOut');
		this.fx.on('animationend', this.onAnimationEnd, this);
		this.setAttributes({
			x: this.config.destX - 20, //See if we can get rid of the -20's because they're messing up the math
			y: this.config.destY - 20,
			rotationRads: 3,
			width: 40,
			height: 40,
			markedForDeath: false

		});
		
		
	},
	
	readyToReload: function() {
		this[0].getParent().getParent().fireEvent('reloadphoton', this[0].config.photonTube);
	},
	
	onAnimationEnd: function(animation) {
		switch (this.config.photonTube) {
			case 1:
				this.getParent().getParent().fireEvent('photonanimended', this, 'right'); //points to the playfield, which fires the event to the controller.
				break;
			case 0:
				this.getParent().getParent().fireEvent('photonanimended', this, 'left');
				break;
		}
	}
});
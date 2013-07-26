Ext.define('MyApp.view.enemyship.EnemyPhoton', {
	extend: 'Ext.draw.sprite.Image',
	
	inheritableStatics: {
		def: {
			processors: {
				
			},
			defaults: {
				src: 'resources/images/photons/enemyphoton1.png'
			}
		}
	},
	
	photonType: 1,
	
	constructor: function(config) {
		this.callParent(arguments);
		this.firePhoton();
	},

	firePhoton: function() {
		
		this.fx.setDuration(Math.floor(this.config.to.duration));
		this.fx.setEasing('linear');
		this.fx.on('animationend', this.onAnimationEnd, this);
		this.setAttributes({
			x: this.config.to.x, //See if we can get rid of the -20's because they're messing up the math
			y: this.config.to.y,
			//x: 600, y: 300,
			rotationRads: 3,
			width: 140,
			height: 140
		});
	},

	onAnimationEnd: function(animation) {
		this.getParent().getParent().fireEvent('explosion',this);
	}
});
Ext.define('MyApp.view.explosions.Explosion2', {
	extend: 'Ext.draw.sprite.Image',
	alias: 'sprite.explosion2',
	inheritableStatics: {
		def: {
			processors: {
				/**
				 * @cfg {String} [src=''] The image source of the sprite.
				 */
				src: 'string',
				endSize: 'number',
				isHidden: 'bool'

			},
			defaults: {
				src: 'resources/images/fireball.jpg'
			}
		}
	},
	constructor: function(config) {
		this.callParent(arguments);
		this.animateMe();
	},
	animateMe: function() {
		this.fx.setDuration(200);
		this.fx.setEasing('easeOut');
		this.fx.on('animationend', this.onExplosionAnimationEnd, this);
		this.setAttributes({
			globalAlpha: 0,
			rotationRads: 1,
			hidden: this.attr.isHidden
		});
	},
	onExplosionAnimationEnd: function() {
		this.destroy();
	}

});
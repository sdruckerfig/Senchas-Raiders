Ext.define('MyApp.view.explosions.Explosion1', {
	extend: 'Ext.draw.sprite.Image',
	alias: 'sprite.explosion1',
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
                src: 'resources/images/gold-star.png'
            }
        }
    },
    constructor: function(config) {
    	this.callParent(arguments);
    	this.animateMe();
    },
    animateMe: function() {
    	//this.fx.setDuration(1300);
        this.fx.setDuration(1300);
		this.fx.setEasing('easeOut');
		this.fx.on('animationend', this.onExplosionAnimationEnd, this);
		this.setAttributes({
			globalAlpha: 0,
			height: this.attr.endSize,
			width: this.attr.endSize,
			hidden: this.attr.isHidden
		});
    },
    onExplosionAnimationEnd: function() {
        console.log('explosion anim ended');
       Ext.Array.remove( MyApp.app.getController('Controls').activeExplosions, this );
		this.destroy();
	}

});
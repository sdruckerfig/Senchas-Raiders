// special class for intro animation

Ext.define('MyApp.view.enemyship.Enemy4', {
	extend: 'Ext.draw.sprite.Image',
	alias: 'sprite.enemy4',
	requires: [
		'MyApp.view.enemyship.EnemyPhoton4'
	],
	inheritableStatics: {
		def: {
			defaults: {
				itemId: 'enemy4',
				src: 'resources/images/enemy1/ship1.png',
				width: 50,
				height: 50,
				x: 0,
				y: 0

			}
		}
	},
	speedX: 0,
	speedY: 0,
	w: 300, // size of canvas
	h: 200,
	launchTube: 0,
	
	constructor: function() {//Title screen enemy

		this.callParent(arguments);

		// initially set position within small bounding box
		this.setAttributes({
			x: Math.floor(Math.random() * this.w),
			y: Math.floor(Math.random() * this.h),
			width: 10,
			height: 10
		});
		this.fx.setEasing('easeInOut');
		this.moveShip();
		Ext.draw.Animator.addFrameCallback(this.firePhoton, this);

	},
	moveShip: function() {
		this.fx.setDuration(Math.floor(Math.random() * 5 + 1) * 1000);
		this.fx.on('animationend', this.onAnimationEnd, this);
		var depth = Math.floor(Math.random() * 70) + 20;
		this.setAttributes({
			x: Math.floor(Math.random() * (this.w - 60)), // adjusted for right bbar
			y: Math.floor(Math.random() * this.h -30),
			width: depth,
			height: depth,
			rotationRads: Math.floor(Math.random() * 8)
		});
	},
	onAnimationEnd: function() {
		
		this.w = this.getParent().element.getWidth();
		this.h = this.getParent().element.getHeight();
		
		this.moveShip();
	},
	firePhoton: function() {
		if (Math.floor(Math.random() * 120) == 1) {
			
			if (this.launchTube == 0) {
				this.launchTube = 1;
				var startX = Math.floor(this.attr.x + (this.attr.width / 2));
				var startY = Math.floor(this.attr.y + (this.attr.height / 2));
			} else {
				this.launchTube = 0;
				var startX = Math.floor(this.attr.x + 5);
				var startY = Math.floor(this.attr.y + (this.attr.height / 2));
			}
			var relativeDepth = this.attr.width / 90;
			var relativeSize = 140 * relativeDepth;
			

			this.getParent().add({
				type: 'enemyphotontorpedo4',
				x: startX,
				y: startY,
				height: relativeSize,
				width: relativeSize,
				to : {
					x: Math.floor(Math.random() * this.w),
					y: Math.floor(Math.random() * this.h),
					duration: 1500 * (1-relativeDepth)
				}
			})
		}
	}
});
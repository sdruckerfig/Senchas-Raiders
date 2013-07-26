Ext.define('MyApp.view.enemyship.Enemy', {
	extend: 'Ext.draw.sprite.Image',

	inheritableStatics: {
		def: {
			processors: {
				torpedo: "string"
			},
			defaults: {
				src: 'resources/images/enemy1/ship1.png',
				torpedo: "enemyphotontorpedo4",
				width: 50,
				height: 50,
				x: 0,
				y: 0,
				inRange: false,
				enemyType: 1
			}
		}
	},

	courseX: 0,
	courseY: 0,
	courseZ: 0,
	rotation: 0,
	timeIn: new Date(),

	frameCounter: 0,

	staticDepth: 0,
	pos: [100, 100],
	speedX: 0,
	speedY: 0,

	w: null, // size of canvas
	h: null,

	markedForDeath: false,

	fireRate: 1,   // always fire after course movement
	setCourse: false,

	newCourseTimer: null,
	mvtDetectorTimer: null,
	courseCorrectTimer: null,

	heroShipCourseX: 0,
	heroShipCourseY: 0,
	heroShipCourseZ: 0,


	courseCorrectEnemy: function() {


		this.courseX += this.heroShipCourseX;
		this.courseY += this.heroShipCourseY;


		this.setAttributes({
			x: this.courseX,
			y: this.courseY,
			// translationX: x * 2,
			// translationY: y * 2,
			// x: this.courseX + (x * -1),
			// y: this.courseY + (y * -1),
			// x: this.courseX,
			// y: this.courseY,
			// translationX: x,
			// translationY: y,
			rotationRads: this.rotation,
			width: this.courseZ + this.heroShipCourseZ,
			height: this.courseZ + +this.heroShipCourseZ
		});

	},

	updateCourse: function(x, y, z) {

		if (!isNaN(parseInt(x))) {
			this.heroShipCourseX = x;
			this.heroShipCourseY = y;
		}
		if (!isNaN(parseInt(z))) {
			this.heroShipCourseZ = z;
		}
		this.courseCorrectEnemy();

	},

	setNewCourse: function() {


		// if (this.frameCounter == 0) {
			if (Math.random() > 0.8) { // chance of floating to rear view
				this.courseX = MyApp.util.Functions.getRandomInt(-this.w, 2 * this.w);
				this.courseY = MyApp.util.Functions.getRandomInt(-this.h, 2 * this.h);
			} else {
				console.log('inbounds');
				this.courseX = 10 + Math.floor(Math.random() * (this.w - 10));
				this.courseY = 10 + Math.floor(Math.random() * (this.h - 10));
			}
			this.courseZ = Math.floor(Math.random() * 100) + 10;
			this.rotation = Math.floor(Math.random() * 4);


			this.timeIn = new Date();
			this.courseTime = 2000 + Math.floor(Math.random() * 3500);
			this.fx.setDuration(this.courseTime);
			this.fx.on('animationend', this.onAnimationEnd, this);

			this.setAttributes({
				x: this.courseX,
				y: this.courseY,
				//x: 600, y:300,
				rotationRads: Math.random() * 4,
				width: this.courseZ,
				height: this.courseZ
			});

			if (this.frameCounter > 0) 
				this.onAnimationEnd();

			this.newCourseTimer = Ext.Function.defer(this.setNewCourse, this.courseTime, this);
			this.frameCounter++;
		// }



	},

	constructor: function() {

		this.callParent(arguments);

		var surface = this.config.surface;
		var me = this;

		me.on('beforedestroy', this.onBeforeDestroy);

		this.w = surface.element.getWidth();
		this.h = surface.element.getHeight();
		this.deltaV = 0;

		this.mvtDetector = Ext.Function.bind(this.onMvtDetect, this);
		this.courseCorrect = Ext.Function.bind(this.courseCorrectEnemy, this);

		this.inAft = MyApp.util.Functions.cont().aftView;

		this.mvtDetectorTimer = window.setInterval(function() {
			window.requestAnimationFrame(me.mvtDetector)
		}, 33);


		this.courseCorrectTimer = window.setInterval(function() {
			window.requestAnimationFrame(me.courseCorrect)
		}, 1000);


		this.fx.setEasing('easeOut');

		this.setNewCourse();


	},

	onBeforeDestroy: function() {
		clearTimeout(this.newCourseTimer);
		clearTimeout(this.mvtDetectorTimer);
		clearTimeout(this.courseCorrectTimer);
	},


	onMvtDetect: function() {

		if (MyApp.util.Functions.cont().activeEnemies.length != 0 && !this.markedForDeath) {

			if (this.attr.y + this.attr.height < 0) { //moving offscreen up

				this.fx.setEasing('linear');
				this.fx.setDuration(0);
				this.setAttributes({
					y: this.h
				});

				this.fx.setDuration(1100);
				this.courseY = this.h + this.courseY;
				this.setAttributes({
					y: this.courseY,
					rotationRads: Math.random() * 4
				});

				this.toggleAft();
				this.getParent().getParent().fireEvent('leftview', this, 'U');

			} else if (this.attr.y > this.h) { //moving offscreen down

				this.fx.setEasing('linear');

				this.fx.setDuration(0);
				this.setAttributes({
					y: 0
				});

				this.fx.setDuration(1100);
				this.courseY = this.courseY - this.h;
				this.setAttributes({
					y: this.courseY,
					rotationRads: Math.random() * 4
				});

				this.toggleAft();
				this.getParent().getParent().fireEvent('leftview', this, 'D');


			} else if (this.attr.x + this.attr.width < 0) { //moving offscreen left

				this.fx.setEasing('linear');
				this.attr.x = this.w;

				this.fx.setDuration(0);
				this.setAttributes({
					x: this.w
				});

				this.fx.setDuration(1100);
				this.courseX = this.w + this.courseX;
				this.setAttributes({
					x: this.courseX,
					rotationRads: Math.random() * 4
				});
				this.toggleAft();
				this.getParent().getParent().fireEvent('leftview', this, 'L');
				changed = true;


			} else if (this.attr.x > this.w) { //moving offscreen right

				// this.attr.x = this.w - (this.attr.x - this.w);

				this.attr.x = 1;

				this.fx.setDuration(0);
				this.setAttributes({
					x: 1
				});
				this.fx.setEasing('linear');
				this.fx.setDuration(1100);
				this.courseX = this.courseX - this.w;
				this.setAttributes({
					x: this.courseX,
					rotationRads: Math.random() * 4
				});
				this.toggleAft();
				this.getParent().getParent().fireEvent('leftview', this, 'R');
				changed = true;
			}


		}


	},

	toggleAft: function() {
		this.inAft = !this.inAft;
	},

	onAnimationEnd: function() {
		var random = MyApp.util.Functions.getRandomInt(1, this.fireRate); //changing the R value changes th eprobability of a shot, can be adjusted for difficulty
		if (random == 1) {
			//console.log('enemy fire');
			this.getParent().getParent().fireEvent('enemyshoot', this);
		}
		// this.setNewCourse();
	},


	firePhoton: function() {
		var startX = Math.floor(this.attr.x + 5);
		var startY = Math.floor(this.attr.y + (this.attr.height / 2));
		var relativeDepth = this.attr.width / 90;
		var relativeSize = 140 * relativeDepth;
		var photonfired = this.getParent().add({
			type: this.attr.torpedo,
			x: startX,
			y: startY,
			//x: 600, y:150, 
			height: relativeSize,
			width: relativeSize,
			photonType: this.attr.enemyType,
			to: {
				x: MyApp.util.Functions.getRandomInt(0, this.w),
				y: MyApp.util.Functions.getRandomInt(0, this.h),
				duration: 3500 / Math.abs(1 + this.deltaV)
				/*x: 600,
					y: 150,
					duration: 10000 * (1-relativeDepth),*/
			}
		});
		photonfired.inAft = this.inAft;

		photonfired.setAttributes({
			hidden: photonfired.inAft != MyApp.util.Functions.cont().aftView
		});

		return photonfired;
	},
});
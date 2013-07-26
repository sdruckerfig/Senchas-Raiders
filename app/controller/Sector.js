// todo: long range sensor and 
// move ship into attack range
Ext.define('MyApp.controller.Sector', {
	extend: 'Ext.app.Controller',

	requires: ['MyApp.view.dradis.Enemy1', 'MyApp.view.dradis.StarbaseFront', 'MyApp.view.dradis.StarbaseAft'],


	shipPosX: 500,
	shipPosY: 500,
	shipPosZ: 500,
	sbPosX: null,
	sbPosY: null,
	sbPosZ: null,
	enemyPositions: [],
	enemies: 0,
	enemyType: 0,
	enemyShips: [],
	starbaseSprite: null,
	clock: null,
	positionClock: null,
	time: new Date().getTime(),
	dockedWithStarbase: false,
	w: 0,
	h: 0,
	headingX: 0,
	headingY: 0,
	headingZ: 0,
	easyMode: false,
	shipDx: 0,
	shipDy: 0,
	shipDv: 0,
	surface: 0,
	sectorType: 'yellow',
	dradisSprite: null,
	attackComputer: false,
	docked: false,
	dockingComplete: false,
	diffXTarget: 0,
	diffYTarget: 0,

	config: {
		views: [
				'MyApp.view.starbase.Starbase',
				'MyApp.view.starbase.Freighter',
				'MyApp.view.enemyship.Enemy1',
				'MyApp.view.enemyship.Enemy2',
				'MyApp.view.enemyship.Enemy3'
		],
		refs: {
			'galacticMap': 'galacticmap',
			playField: 'playfield',
			soundPlayer: 'sounds',
			starField: 'viewscreen',
			speedbar: 'speedbar verticalsliderfield'
		},
		control: {

			galacticMap: {
				starbasesector: 'onStarbaseSectorInit',
				enemysector: 'onEnemySector',
				emptysector: 'onEmptySector',
				clearedsector: 'onClearedSector',
				reset: 'onMapReset'
			},

			playField: {
				activate: 'onPlayFieldShow',
				shipmovement: 'onShipMovement',
				attackcomputerchange: 'onAttackComputerChange',
				docking: 'onDocking'
			}
		}
	},


	onDocking: function(bool) {
		this.docked = bool;
	},

	onPlayFieldShow: function(cmp) {
		this.surface = this.getPlayField().getSurface();
	},

	init: function() {

		this.updDistanceToTarget = Ext.Function.bind(this.updateDistanceToTarget, this);
		this.hsm = Ext.Function.bind(this.handleShipMovement, this);

	},

	onEmptySector: function() {
		this.onLeaveStarbaseSector();
		this.onYellowAlert();
	},

	onMapReset: function() {
		this.onLeaveStarbaseSector();
		this.onYellowAlert();
	},

	onAttackComputerChange: function(bool) {

		this.attackComputer = bool;

		if (this.sectorType == 'green' && this.attackComputer)
			this.showDistanceToTarget(bool);
		else
			this.showDistanceToTarget(false);

	},

	initShipPosition: function() {
		this.shipPosX = Math.floor(Math.random() * 1000);
		this.shipPosY = Math.floor(Math.random() * 1000);
		this.shipPosZ = Math.floor(Math.random() * 1000);

		this.headingX = 0;
		this.headingY = 0;
	},

	initStarbasePosition: function() {
		this.sbPosX = Math.floor(Math.random() * 1000);
		this.sbPosY = Math.floor(Math.random() * 1000);
		this.sbPosZ = Math.floor(Math.random() * 1000);
	},

	onStarbaseSectorInit: function(sector) {
		Ext.Function.defer(this.onStarbaseSector, 2000, this);
	},



	handleShipMovement: function() {

		var dradisXOffset = 0;
		var dradisYOffset = 0;
		var speed = this.shipDv;

		this.headingX += (this.shipDx * 0.001);
		this.headingY += (this.shipDy * 0.001);

		if (this.headingX > 1)
			this.headingX = -1;

		if (this.headingX < -1)
			this.headingX = 1;

		if (this.headingY > 1)
			this.headingY = -1;

		if (this.headingY < -1)
			this.headingY = 1;

		// account for velocity changes			
		this.shipPosX += (this.headingX * speed * 0.9);
		this.shipPosY += (this.headingY * speed * 0.9);
		this.shipPosZ += (this.headingZ * speed * 0.9);

		if (this.dradisSprite) { // resposition sprite

			var distance = this.calcDistance(
				this.shipPosX, this.shipPosY, this.shipPosZ,
				this.sbPosX, this.sbPosY, this.sbPosZ);

			var centerHeadingX = (this.sbPosX - this.shipPosX) / distance;
			var centerHeadingY = (this.sbPosY - this.shipPosY) / distance;

			this.diffXTarget = centerHeadingX - this.headingX;
			this.diffYTarget = centerHeadingY - this.headingY;

			this.dradisSprite.setAttributes({
				translationX: (this.w - 90) + (Ext.Number.constrain(this.diffXTarget * -100, -50, 50)),
				translationY: (this.h - 75) + (Ext.Number.constrain(this.diffYTarget * -100, -35, 35)),
				hidden: false
			});

			this.positionStarbase(distance, this.diffXTarget, this.diffYTarget);

		}



	},

	onShipMovement: function(dx, dy, dv) {

		if (dx != undefined)
			this.shipDx = dx;
		if (dy != undefined)
			this.shipDy = dy;
		if (dv != undefined)
			this.shipDv = dv;
	},

	/*
	onMoveStarbase: function() {

		var x = this.starbaseSprite.attr.x;
		var y = this.starbaseSprite.attr.y;
		var modX, modY;

		this.starbaseSprite.fx.setDuration(2000 - (Math.abs(this.shipDx) + Math.abs(this.shipDy)) * 20);
		this.starbaseSprite.fx.setEasing('linear');
		this.starbaseSprite.fx.on('animationend', this.onStarbaseMovementEnd, this);
		this.starbaseSprite.setAttributes({
			x: x + (this.shipDx * 10),
			y: y + (this.shipDy * 10)
		});

	},
	*/


	positionStarbase: function(distance, diffXFromCenter, diffYFromCenter) {

		var size = Math.floor(200 - distance);

		if (size > 0) { // within 200 units

			if (distance < 101 && !this.dockingComplete) {

				this.dockingComplete = true;
				this.getPlayField().outputMessage('AUTO-DOCKING ENGAGED');

				if (this.getSpeedbar())
					this.getSpeedbar().setValue(1);

				this.getApplication().getController('Controls').setVelocity(0);

				this.starbaseSprite.startRotation();
				this.starbaseSprite.fx.setDuration(3000);

				// move starbase to center
				this.starbaseSprite.setAttributes({
					width: 125,
					height: 125,
					x: Math.floor((this.w / 2) - (125 / 2)),
					y: Math.floor((this.h / 2) - (125 / 2))
				});

				this.getPlayField().fireEvent('docking', true);

				Ext.Function.defer(this.dockAtStarbase, 3000, this);


			} else {

						
				this.starbaseSprite.fx.setDuration(0);
				this.starbaseSprite.setAttributes({
					width: size,
					height: size,
					x: ((this.w / 2) - (size / 2)) + (diffXFromCenter * -1 * (this.w / 2)),
					y: ((this.h / 2) - (size / 2)) + (diffYFromCenter * -1 * (this.h / 2)),
					hidden: false
				});

			}

		} else {

			// beyond 200 units, hide starbase

			this.starbaseSprite.setAttributes({
				hidden: true
			});
		}
	},


	/*
	onStarbaseMovementEnd: function() {
		this.onMoveStarbase();
	},
	*/

	onStarbaseSector: function(sector) {

		this.sectorType = 'green';

		if (this.starbaseSprite == null) {

			this.onGreenAlert();

			this.surface = this.getPlayField().getSurface();

			this.w = this.surface.element.getWidth();
			this.h = this.surface.element.getHeight();
			this.initStarbasePosition();

			// in easy mode, always set off near the starbase

			if (this.easyMode) {

				this.shipPosX = this.sbPosX;
				this.shipPosY = this.sbPosY;
				this.shipPosZ = this.sbPosZ - 300;

			} else {

				this.initShipPosition();

			}

			// set ship heading towards starbase
			// todo - make user navigate to base

			var distance = this.calcDistance(
				this.shipPosX, this.shipPosY, this.shipPosZ,
				this.sbPosX, this.sbPosY, this.sbPosZ);


			if (this.easyMode) { // automatically align the headings
				this.headingX = (this.sbPosX - this.shipPosX) / distance;
				this.headingY = (this.sbPosY - this.shipPosY) / distance;
				this.headingZ = (this.sbPosZ - this.shipPosZ) / distance;
			} else {
				// start with random heading
				this.headingX = Math.random() * (Math.random() > 0.5 ? 1 : -1);
				this.headingY = Math.random() * (Math.random() > 0.5 ? 1 : -1);
				this.headingZ = (this.sbPosZ - this.shipPosZ) / distance;
			}


			// add sprite
			this.starbaseSprite = this.surface.add({
				type: 'starbase',
				x: (this.w / 2) - 1,
				y: (this.h / 2) - 1,
				width: 2,
				height: 2,
				hidden: true
			});


			/*
			this.moveStarbase = Ext.Function.bind(this.positionStarbase, this);
			this.clock = window.requestAnimationFrame(this.moveStarbase);
			*/

			this.onAttackComputerChange(this.attackComputer);
			this.clock = setInterval(this.hsm, 250);

		}
	},

	calcDistance: function(x1, y1, z1, x2, y2, z2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		var dz = z1 - z2;
		return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
	},

	updateDistanceToTarget: function() {

		var me = this;

		if (this.distanceSprite) {
			this.distanceSprite.setAttributes({
				text: 'Distance: ' + Math.floor(this.calcDistance(this.shipPosX, this.shipPosY, this.shipPosZ, this.sbPosX, this.sbPosY, this.sbPosZ))
			});
			setTimeout(function() {
				window.requestAnimationFrame(me.updDistanceToTarget);
			}, 33);
		}
		

	},

	showDistanceToTarget: function(bool) {

		if (bool && !this.distanceSprite) {
			this.surface = this.getPlayField().getSurface();

			this.distanceSprite = this.surface.add({
				type: 'text',
				x: this.w - 140,
				y: this.h - 110,
				fontFamily: 'orbitron',
				text: 'Distance: 1',
				fontSize: 12,
				fillStyle: 'white'
			});

			// initially center sprite
			this.dradisSprite = this.surface.add({
				type: 'dradisstarbasefront',
				translationX: this.w - 90,
				translationY: this.h - 75,
				hidden: true
			});

			this.updDistanceToTarget();

		} else if (this.distanceSprite) {
			this.distanceSprite.destroy();
			this.distanceSprite = null;
			this.dradisSprite.destroy();
			this.dradisSprite = null;
		}
	},

	dockAtStarbase: function() {

		this.getPlayField().outputMessage('RESUPPLY IN PROGRESS');

		// set speed to 0.5
		if (this.getSpeedbar()) {
			this.getSpeedbar().setValue(0.5);
			this.getApplication().getController('Controls').setVelocity(0);
		} else {
			this.getApplication().getController('Controls').setVelocity(0);
		}



		this.freighter = this.getPlayField().getSurface().add({
			type: 'freighter',
			x: (this.w / 2) - 1,
			y: (this.h / 2) - 1,
			width: 2,
			height: 2,
			canvasWidth: this.w,
			canvasHeight: this.h
		});

		this.freighter.dockWithShip();

	},



	onLeaveStarbaseSector: function() {

		clearTimeout(this.clock);

		if (this.dradisSprite) {
			this.dradisSprite.destroy();
			this.dradisSprite = null;
		}

		if (this.starbaseSprite) {
			this.starbaseSprite.destroy();
			this.starbaseSprite = null;
		}

		if (this.distanceSprite) {
			this.distanceSprite.destroy();
			this.distanceSprite = null;
		}

		this.dockingComplete = false;

	},

	onEnemySector: function(sector) {

		var enemySprite = null;


		this.onLeaveStarbaseSector();

		this.sectorType = 'red';
		this.w = this.getPlayField().getSurface().element.getWidth();
		this.h = this.getPlayField().getSurface().element.getHeight();
		this.enemies = sector.count;
		this.enemyType = sector.type;
		this.enemyShips = [];

		var createStr = 'MyApp.view.enemyship.Enemy' + sector.type;

		for (var i = 0; i < this.enemies; i++) {
			enemySprite = Ext.create(createStr, {
				type: 'enemy' + sector.type,
				x: Math.ceil(Math.random() * this.w),
				y: Math.ceil(Math.random() * this.h),
				width: 0,
				height: 0,
				surface: this.getPlayField().getSurface()
			});
			this.enemyShips[i] =

			{
				x: Math.floor(Math.random() * 1000),
				y: Math.floor(Math.random() * 1000),
				z: Math.floor(Math.random() * 1000),
				sprite: enemySprite
			}
			//this.fireEvent('spawnenemy', this.enemyShips[i]);
			this.getPlayField().fireEvent('spawnenemy', enemySprite);
		};

		this.initShipPosition();
		this.onRedAlert();
	},

	/*
	 *
	 * SECTOR STATUS
	 *
	 */

	onRedAlert: function() {
		this.getPlayField().setStyle('border: 1px solid red');
		this.getPlayField().outputMessage('RED ALERT');
		this.getSoundPlayer().playTrack('sndRedAlert', true);
	},

	onClearedSector: function() {
		this.getSoundPlayer().playTrack('sndOn', false);
		this.getPlayField().outputMessage('SECTOR CLEARED');
		this.getPlayField().fireEvent('changeScore', 500);
		this.getPlayField().fireEvent('sectorcleared');
		this.onYellowAlert();

	},

	onYellowAlert: function() {
		var pf = this.getPlayField();
		if (pf)
			pf.setStyle('border: 1px solid yellow');
	},

	onGreenAlert: function() {
		this.getPlayField().setStyle('border: 1px solid green');
	}

});
Ext.define('MyApp.view.PlayField', {
	extend: 'Ext.draw.Component',
	engine: 'Ext.draw.engine.Canvas',
	requires: ['Ext.draw.sprite.Sprite', 'MyApp.view.Photon', 'Ext.draw.Animator', 'MyApp.util.Functions'],
	xtype: 'playfield',
	config: {
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		style: 'border: 1px solid yellow',
		items: [],
		shields: false,
		aftView: false,
		attackComputer: false,
		statusSprite: null,
	},
	msgTimer: null,
	msgSprite: null,
	attackComputerSpriteCrosshair: [],
	photonTube: 1,
	customReloadTime: -1,

	shipStatusSprite: null,
	shipPhotonSprite: null,
	shipKillSprite: null,
	shipUDSprite: null,
	shipVSprite: null,
	shipLRSprite: null,

	initialize: function() {
		this.onRefresher = Ext.Function.bind(this.onRefresh, this);
		this.element.on({
			swipe: this.onSwipe,
			taphold: this.onDoubleTap,
			tap: this.onTap,
			show: this.onRefresher,
			pinch: this.onPinch,
			pinchstart: this.onPinchStart,
			pinchend: this.onPinchEnd,
			scope: this
		});

		this.callParent(arguments);
		window.requestAnimationFrame(this.onRefresher);
	},

	onPinchStart: function(ev, node, options, eOpts) {
		this.fireEvent('pinchstart', ev);
	},
	onPinchEnd: function(ev, node, options, eOpts) {
		this.fireEvent('pinchend', ev);
	},
	onPinch: function(ev, node, options, eOpts) {
		this.fireEvent('pinch', ev.scale);
	},


	// refresh playfield
	onRefresh: function() {
		/*
		this.getSurface().renderFrame();
		Ext.defer(function() {
			window.requestAnimationFrame(this.onRefresher);
		},500,this);
		*/

	},
	onSwipe: function(ev) {
		this.fireEvent('swipe', this, ev); //sends the current canvas and the swipe event as parameters
	},
	onDoubleTap: function(ev) {
		this.fireEvent('taphold', this, ev); //sends the current canvas and the swipe event as parameters
	},
	onTap: function(ev) {
		this.fireEvent('tap', this, ev);
	},

	createPhoton: function(photonTubeArg, translations) {
		return Ext.create('MyApp.view.Photon', {
			photonTube: photonTubeArg,
			surface: this.getSurface(),
			offsetX: translations[0], //offsetX and offsetY are stored in config, not attr
			offsetY: translations[1],


		});
	},
	firePhoton: function(photonTubeArg, translations, inAft) {
		//debugger;

		var p = this.createPhoton(photonTubeArg, translations, inAft);
		p.inAft = inAft;
		p.firePhoton(this.customReloadTime);
		return p;
	},
	updateAftView: function(newVal) {
		if (this.getAttackComputer()) {
			this.displayAttackComputer(false);
			this.displayAttackComputer(true);
		}
	},
	updateAttackComputer: function(newVal) {
		this.displayAttackComputer(newVal);
	},

	outputMessage: function(msg, size) {

		if (this.msgSprite) {
			this.msgSprite.destroy();
		}

		if (size == 'small')
			var fontSize = 20;
		else
			var fontSize = 22;

		this.msgSprite = Ext.create('Ext.draw.sprite.Text', {
			type: 'text',
			x: 10,
			y: 30,
			text: msg,
			fontFamily: 'orbitron',
			fontSize: fontSize,
			fillStyle: 'white',
			surface: this.getSurface()
		});
		this.getSurface().add(this.msgSprite);
		this.getSurface().renderFrame();
		// this.getSurface().renderFrame();
		if (this.msgTimer != null) clearTimeout(this.msgTimer);
		this.msgTimer = Ext.Function.defer(this.clearMessage, 2500, this);
	},

	clearMessage: function() {
		if (this.msgSprite) {
			this.msgSprite.destroy();
			this.getSurface().renderFrame();
		}
	},


	hideAttackComputerStats: function() {
		if (this.shipStatusSprite) {
			this.shipStatusSprite.destroy();
			this.shipPhotonSprite.destroy();
			this.shipKillSprite.destroy();
			this.shipUDSprite.destroy();
			this.shipVSprite.destroy();
			this.shipLRSprite.destroy();
		}
	},

	showAttackComputerStats: function() {

		var surface = this.getSurface();
		var width = this.element.getWidth();
		var height = this.element.getHeight();

		this.shipStatusSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 15,
			fontFamily: 'orbitron',
			text: 'E: 9999',
			fontSize: 12,
			fillStyle: 'white'
		});

		this.shipPhotonSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 30,
			fontFamily: 'orbitron',
			text: 'P: 50',
			fontSize: 12,
			fillStyle: 'white'
		});

		this.shipKillSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 45,
			fontFamily: 'orbitron',
			text: 'K: 0',
			fontSize: 12,
			fillStyle: 'white'
		});
		this.shipUDSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 60,
			fontFamily: 'orbitron',
			text: 'dV: 0',
			fontSize: 12,
			fillStyle: 'white'
		});

		this.shipVSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 90,
			fontFamily: 'orbitron',
			text: 'V: 1',
			fontSize: 12,
			fillStyle: 'white'
		});

		this.shipLRSprite = surface.add({
			type: 'text',
			x: width - 60,
			y: 75,
			fontFamily: 'orbitron',
			text: 'dH: 0',
			fontSize: 12,
			fillStyle: 'white'
		});
	},


	displayAttackComputer: function(state) {

		var surface = this.getSurface();
		var width = this.element.getWidth();
		var height = this.element.getHeight();

		this.fireEvent('attackcomputerchange', state);

		if (state == true) {

			if (!this.getAftView()) {
				
				this.showAttackComputerStats();

				// target reticle
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) - 1,
					y: (height / 2) - 30,
					width: 3,
					height: 20,
					fillStyle: 'silver'
				}));
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) - 1,
					y: (height / 2) + 10,
					width: 3,
					height: 20,
					fillStyle: 'silver'
				}));
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) - 50,
					y: height / 2 - 1,
					width: 40,
					height: 3,
					fillStyle: 'silver'
				}));
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) + 10,
					y: height / 2 - 1,
					width: 40,
					height: 3,
					fillStyle: 'silver'
				}));

				// radar
				// exterior radar
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 140,
					y: height - 100,
					width: 120,
					height: 70,
					strokeStyle: '#ffffff'
				}));

				// interior radar box
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 110,
					y: height - 80,
					width: 60,
					height: 30,
					strokeStyle: '#ffffff'
				}));

				// north bar
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 80,
					y: height - 100 + 2,
					width: 1,
					height: 16,
					strokeStyle: '#ffffff'
				}));

				// south bar
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 80,
					y: height - 48,
					width: 1,
					height: 16,
					strokeStyle: '#ffffff'
				}));

				// west bar
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 140,
					y: height - 65,
					width: 28,
					height: 1,
					strokeStyle: '#ffffff'
				}));

				// east bar
				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: width - 48,
					y: height - 65,
					width: 28,
					height: 1,
					strokeStyle: '#ffffff'
				}));

			} else { // aft view

				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) - 50,
					y: height / 2 - 1,
					width: 40,
					height: 3,
					fillStyle: 'silver'
				}));

				this.attackComputerSpriteCrosshair.push(surface.add({
					type: 'rect',
					x: (width / 2) + 10,
					y: height / 2 - 1,
					width: 40,
					height: 3,
					fillStyle: 'silver'
				}));
			}

		} else {

			for (var i = 0; i < this.attackComputerSpriteCrosshair.length; i++) {
				this.attackComputerSpriteCrosshair[i].destroy();
			}

			this.hideAttackComputerStats();

		}
		surface.renderFrame();
	}
})
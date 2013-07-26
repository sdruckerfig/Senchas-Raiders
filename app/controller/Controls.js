Ext.define('MyApp.controller.Controls', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.device.Orientation',
		'MyApp.view.enemyship.Enemy1',
		'MyApp.view.explosions.Explosion1',
		'MyApp.view.explosions.Explosion2',
		'Ext.util.DelayedTask',
		'Ext.draw.sprite.Image',
		'MyApp.util.Functions',
		'Ext.MessageBox',
		'MyApp.view.intro.GameOver'
	],
	shields: false,
	shieldsUp: false,
	shieldDamage: false,
	shieldTimer: null,
	tactical: false,
	aftView: false,
	velocity: 1,
	lastRotation: 0,
	shipStatusSprite: null,
	shipPhotonSprite: null,
	shipKillSprite: null,
	shipUDSprite: null,
	shipLRSprite: null,
	shipVSprite: null,
	activeEnemies: [],
	activeEnemyShots: [],
	activeExplosions: [],
	loadedPhotons: [],
	playFieldWidth: 0,
	playFieldHeight: 0,
	playerScore: 0,
	initialCursor: [], //Represents the Star Field cursor when the ship is just going straight
	translations: [0, 0],
	customReloadTime: -1,
	time: new Date().getTime(),
	shipHits: 0, // # of times ship was hit without shield protection
	damagedScreenSprite: null,
	warpEnabled: false,
	canvas: null,

	config: {
		models: ['HeroShip', 'Statistic'],
		refs: {
			starField: 'viewscreen',
			soundPlayer: 'sounds',
			playField: 'playfield',
			mainView: 'main',
			mapBackButton: 'galacticmap button',
			shipStatusPanel: 'component#shipstatuspanel',
			fireButton: 'button#btnFire',
			galacticMap: 'galacticmap',
			btnResumeGame: 'home #btnResumeGame',
			viewport: 'viewport',
			btnWarp: '#btnWarp',
			btnAft: '#btnAft',
			btnEnemy: '#btnEnemy',
			btnFire: '#btnFire',
			btnTac: '#btnTactical',
			sector: '#sector',
			introView: '#introview',
			joyStick: 'joystick'

		},
		control: {
			"verticalsliderfield#velocity": {
				change: 'onVelocityChange'
			},
			"button#btnShields": {
				tap: 'onBtnShieldTap'
			},

			"button#btnEnemy": {
				tap: 'onDisplayEnemy'
			},
			"button#btnFire": {
				tap: 'onBtnFire'
			},
			"button#btnTactical": {
				tap: 'onBtnTactical'
			},
			"button#btnWarp": {
				tap: 'onBtnWarp'
				//tap: 'onDisplayEnemy',

			},
			"button#btnAft": {
				tap: 'onBtnAft'
			},
			"button#btnMap": {
				tap: 'onBtnMap'
			},
			"button#btnPause": {
				tap: 'onPauseGame'
			},
			"mapBackButton": {
				tap: 'onMapBackButton'
			},
			"playField": {
				// swipe: 'onPlayFieldSwipe',
				changeScore: 'onChangeScore',
				'docked': 'onFreighterDocked',
				initialize: 'onPlayFieldInitialize',
				photonanimended: 'onPhotonAnimEnded',
				reloadphoton: 'onReloadPhoton',
				// tap: 'onTap',
				// taphold: 'onDoubleTap', //only to be used when playing on desktop
				// bottomchange: 'onPlayFieldHeightChange'
				enemyshoot: 'onEnemyShoot',
				explosion: 'onExplosion',
				leftview: 'onEnemyLeftView',
				gameover: 'onGameOver',
				spawnenemy: 'onSpawnEnemy',
				pinch: 'onPlayFieldPinch',
				// pinchstart: 'onPlayFieldPinchStart',
				// pinchend: 'onPlayFieldPinchEnd',
				newgame: 'onNewGame',
				sectorcleared: 'onSectorCleared'
			},
			'btnResumeGame': {
				tap: 'onResumeGame'
			},
			galacticMap: {
				changeScore: 'onChangeScore',
			},
			joyStick: {
				dragstart: 'onJoyStickDragStart',
				drag: 'onJoyStickDrag',
				dragend: 'onJoyStickDragEnd'
			}


		}
	},

	

	onSectorCleared: function() {

		if (this.getGalacticMap().getEnemySectorCount() == 0) {
			// YOU WIN!!!
			this.getPlayField().fireEvent('gameover');
		}

	},

	onChangeScore: function(change) {
		this.playerScore += change;
		MyApp.Stats.set('score', MyApp.Stats.get('score') + change);
	},



	/*
	 *
	 * Initialize
	 *
	 */
	init: function() {
		this.ship = Ext.create('MyApp.model.HeroShip');
		this.activeEnemies = new Array();
		this.loadedPhotons = new Array();
		this.activePhotons = new Array();
		this.activeEnemyShots = new Array();
		this.activeExplosions = new Array();
		//this.shipCounter = Ext.Function.defer(this.shipStatus, 1000, this);
		this.collisionDetector = Ext.Function.bind(this.onCollisionDetect, this);
		this.updateShipStatus = Ext.Function.bind(this.shipStatus, this);

	},

	reset: function() {
		this.init();
		this.shields = false;
		this.shieldsUp = false;
		this.shieldDamage = false;
		this.shieldTimer = null;
		this.tactical = false;
		this.aftView = false;
		this.shipHits = 0;
		this.setVelocity(1);
	},


	setEnergy: function(modifier) {
		this.ship.set('totalEnergy', this.ship.get('totalEnergy') + modifier);
		MyApp.Stats.set('energy', MyApp.Stats.get('energy') + Math.abs(modifier));
	},

	onPlayFieldInitialize: function(cmp) {
		this.loadedPhotons.push(1);
		this.loadedPhotons.push(0);
		Ext.defer(this.onPlayFieldShow, 500, this);
	},
	restoreShip: function() {
		this.ship.reload();
		this.shieldDamage = false;
		this.shipHits = 0;
		this.undamageViewScreen();
		if (this.shieldTimer != null) {
			clearTimeout(this.shieldTimer);
		}
	},
	onNewGame: function(cmp) {

		this.playerScore = 0; //resets the score
		MyApp.Stats = Ext.create('MyApp.model.Statistic');
		this.restoreShip();
		this.clearActiveEnemies();
		this.getPlayField().outputMessage('GREETINGS, STARFIGHTER!', 'small');
		this.getSoundPlayer().playTrack('sndOn', true);

	},
	onPlayFieldShow: function() {
		this.surface = this.getPlayField().getSurface();
		this.surface.removeAll(true);
		this.playFieldWidth = this.surface.element.getWidth();
		this.playFieldHeight = this.surface.element.getHeight();
		this.initialCursor[0] = this.getStarField().cursor_x;
		this.initialCursor[1] = this.getStarField().cursor_y;
		this.shipStatus();
		this.getPlayField().outputMessage('GREETINGS, STARFIGHTER!', 'small');
		this.getSoundPlayer().playTrack('sndOn', true);
	},
	updatePhotonStatus: function() {
		if (this.tactical && !this.aftView)
			this.getPlayField().shipPhotonSprite.setAttributes({
				text: 'P:' + this.ship.get('torpedoes')
			});
		if (this.tactical)
			this.surface.renderFrame();
	},
	onFreighterDocked: function(f) {
		this.restoreShip();
		this.getSoundPlayer().playTrack('sndOn', true);
		this.getPlayField().outputMessage('RESUPPLY COMPLETE');
		this.updatePhotonStatus();
		// destroy sprite
		f.destroy();
		MyApp.Stats.set('dockings', MyApp.Stats.get('dockings') + 1);
	},
	onEnemyLeftView: function(enemy, direction) {
		//console.log('eventfired', direction);
		if (enemy.inAft == this.aftView) {

			enemy.setAttributes({
				hidden: false
			});
		} else {
			enemy.setAttributes({
				hidden: true
			});
		}
	},
	/*
	 *
	 *	ENEMIES
	 *
	 */
	onDisplayEnemy: function(b, e) {
		var surface = this.getPlayField().getSurface();
		var sprite = Ext.create('MyApp.view.enemyship.Enemy1', { //inmplicitly calls the constructor
			surface: surface
		});
		this.onSpawnEnemy(sprite);
	},
	onSpawnEnemy: function(sprite) {
		this.getPlayField().getSurface().add(sprite);
		this.activeEnemies.push(sprite);
		//sprite.moveShip();
	},
	clearActiveEnemies: function() {
		for (var i = 0, len = this.activePhotons.length; i < len; i++) {
			this.activePhotons[i].destroy();
		}
		for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
			this.activeEnemies[i].destroy();
		}
		for (var i = 0, len = this.activeEnemyShots.length; i < len; i++) {
			this.activeEnemyShots[i].destroy();
		}
		this.activeEnemyShots = new Array();
		this.activeEnemies = new Array();
		this.activePhotons = new Array();
	},
	/*
	 *
	 * COMBAT
	 *
	 */
	onEnemyShoot: function(enemy) {
		if (!MyApp.app.gamePaused) {
			var photonfired = enemy.firePhoton();
			this.activeEnemyShots.push(photonfired);
		}
	},
	onReloadPhoton: function(tubeToReload) {
		this.loadedPhotons.push(tubeToReload);
	},
	// enemy photon
	onPhotonAnimEnded: function(photon, side) {
		this.activePhotons = Ext.Array.remove(this.activePhotons, photon);
		photon.destroy();
	},
	/*
	 *
	 * DAMAGE CONTROL
	 *
	 */
	shakeViewport: function() {
		if (MyApp.Preferences.get('shakeScreen')) {
			this.getViewport().setLeft(-10);
			Ext.Function.defer(function() {
				this.getViewport().setLeft(10);
			}, 20, this);
			Ext.Function.defer(function() {
				this.getViewport().setLeft(0);
			}, 40, this);
		}
	},
	damageViewScreen: function() {
		this.damagedScreenSprite = this.surface.add({
			type: 'image',
			src: 'resources/images/cracked.png',
			x: 0,
			y: 0,
			width: this.playFieldWidth,
			height: this.playFieldHeight,
			zIndex: 100
		});
		this.surface.renderFrame();
	},
	undamageViewScreen: function() {
		if (this.damagedScreenSprite != null) {
			this.damagedScreenSprite.destroy();
			this.damagedScreenSprite = null;
		}
	},
	onExplosion: function(photon) {
		MyApp.Stats.set('shipHits', MyApp.Stats.get('shipHits') + 1);
		this.shakeViewport();
		this.onChangeScore(-25);
		if (!this.shieldsUp) {
			this.shipHits++;
			switch (this.shipHits) {
				case 1:

					this.getSoundPlayer().playTrack('sndDamage', true);
					this.damageViewScreen();
					this.getPlayField().outputMessage('STRUCTURAL INTEGRITY CRITICAL');
					break;
				case 2:
					this.onGameOver();
					break;
			}
		} else {
			switch (photon.photonType) {
				case 1:
					this.setEnergy(-500);
					this.systemsDamage(0.20, 8); //Rvalue (in seconds) can be changed for changes in gameplay
					break;
				case 2:
					this.setEnergy(-250);
					this.systemsDamage(0.30, 8); //Rvalue (in seconds) can be changed for changes in gameplay
					break;
				case 3:
					this.setEnergy(-1000);
					this.systemsDamage(0.10, 8); //Rvalue (in seconds) can be changed for changes in gameplay
					break;
			}
		}
		Ext.Array.remove(this.activeEnemyShots, photon);
		photon.destroy();
	},
	systemsDamage: function(chance, duration) {
		
		var rnd = Math.random();
		if (rnd > chance) {
			if (MyApp.Preferences.get('playCombatSounds'))
				this.getSoundPlayer().playTrack('sndHullHit', true);
		} else {
			if (chance <= 1) {
				if (MyApp.Preferences.get('playCombatSounds'))
					this.getSoundPlayer().playTrack('sndDamage', true);
				switch (MyApp.util.Functions.getRandomInt(1, 4)) {
					// switch (1) {
					case 1: //disable crosshair 
						this.getPlayField().outputMessage('ATTACK COMPUTER DAMAGED');
						if (this.tactical) {
							this.getPlayField().setAttackComputer(false);
						}
						this.tactical = false;
						this.getBtnTac().setDisabled(true);
						break;
					case 2: //disable warping - effectively you get a "time out"
						this.getPlayField().outputMessage('WARP DRIVE DAMAGED');
						this.getBtnWarp().setDisabled(true);
						Ext.defer(function() {
							this.getPlayField().outputMessage('WARP DRIVE REPAIRED');
							this.getBtnWarp().setDisabled(false);
						}, Math.random() * 20000, this);
						break;
					case 3: // broken torpedo launcher
						if (Math.random() > 0.5 && this.ship.get('leftTorpedoDamage') == 0) {
							// left launcher broken
							this.ship.set('leftTorpedoDamage', 1);
							this.loadedPhotons = Ext.Array.remove(this.loadedPhotons, 0);
						} else {
							// right launcher broken
							this.ship.set('rightTorpedoDamage', 1);
							this.loadedPhotons = Ext.Array.remove(this.loadedPhotons, 1);
						}
						if (this.ship.get('leftTorpedoDamage') == 1 && this.ship.get('rightTorpedoDamage') == 1)
							this.getPlayField().outputMessage('TORPEDO LAUNCHERS DESTROYED');
						else
							this.getPlayField().outputMessage('TORPEDO LAUNCHER DAMAGED');
						break;
					case 4: //Shield damage
						switch (this.ship.get('shieldDamage')) {
							case 0:
								this.getPlayField().outputMessage('SHIELDS DAMAGED');
								this.ship.set('shieldDamage', 1);
								this.shieldDamage = true;
								this.damagedShields();
								break;
							case 1:
								this.getPlayField().outputMessage('SHIELDS DESTROYED');
								this.ship.set('shieldDamage', 2);
								if (this.shieldTimer)
									clearTimeout(this.shieldTimer);
								this.activateShields(false);
								break;
						}
						break;
				}
			}
		}
	},
	/*
	 *
	 * WARP DRIVE
	 *
	 */
	onBtnWarp: function() {

		this.getBtnAft().disable();
		this.getBtnWarp().disable();
		this.getBtnFire().disable();
		if (Ext.os.deviceType === 'Desktop') {
			var vSlider = Ext.ComponentQuery.query('#velocity')[0];
			vSlider.disable();
		}
		var map = this.getGalacticMap();
		if (map.getShipPlottedCourse().x == map.getShipPosition().x && map.getShipPlottedCourse().y == map.getShipPosition().y) {
			map.setRandomCourse();
			this.getPlayField().outputMessage('STARBUCK, JUMP THE SHIP!', 'small');
		} else {
			this.getPlayField().outputMessage('LUDICROUS SPEED ON');
		}
		this.engageWarpSpeed();
		this.getSoundPlayer().playTrack('sndWarp', true);
		this.clearActiveEnemies();
	},
	decrementWarpSpeed: function() {
		var v = this.ship.get('velocity');
		if (v > this.preWarpSpeed) {
			this.setVelocity(v - 1);
			Ext.Function.defer(this.decrementWarpSpeed, 100, this);
		} else
			this.onWarpActuallyComplete();
	},
	incrementWarpSpeed: function() {
		var v = this.ship.get('velocity');
		this.setVelocity(v + 1);
		if (v < 50) {
			Ext.Function.defer(this.incrementWarpSpeed, 100, this);
		} else {
			this.onWarpComplete();
			this.decrementWarpSpeed();
		}
	},
	engageWarpSpeed: function() {
		this.preWarpSpeed = this.ship.get('velocity');
		this.warpEnabled = true;
		this.incrementWarpSpeed();
	},
	onWarpComplete: function() {
		this.getPlayField().outputMessage('WARP COMPLETE');
		this.getSoundPlayer().playTrack('sndWarpExit', true);
		var map = this.getGalacticMap();
		var plottedCourse = map.getShipPlottedCourse();
		this.setEnergy(-1 * plottedCourse.energy);
	},
	onWarpActuallyComplete: function() {
		var map = this.getGalacticMap();
		this.warpEnabled = false;
		map.completeWarp();
		this.getBtnWarp().enable();
		this.getBtnFire().enable();
		this.getBtnAft().enable();
		if (Ext.os.deviceType === 'Desktop') {
			var vSlider = Ext.ComponentQuery.query('#velocity')[0];
			vSlider.enable();
		}
	},
	/*
	 *
	 * COLLISION DETECTION
	 *
	 */
	onCollisionDetect: function() {
		var enemyCount = null;
		//console.log('PERFORMING ON-FRAME COLLISION DETECT');
		if ((this.activeEnemies.length != 0 || this.activeEnemyShots.length != 0) && this.activePhotons.length != 0) {
			var haveKill = false;
			var haveDeflect = false;
			for (var i = 0, len = this.activePhotons.length; i < len; i++) {
				var currPhoton = this.activePhotons[i];
				var photonCenter = currPhoton.getBBoxCenter();
				for (var j = 0, len2 = this.activeEnemies.length; j < len2; j++) {
					var currEnemy = this.activeEnemies[j];
					var enemyBox = currEnemy.getBBox(false);
					if (MyApp.util.Functions.CDHelperHitboxes(enemyBox, {
						x: photonCenter[0],
						y: photonCenter[1]
					}) && currPhoton.inAft == currEnemy.inAft) {
						haveKill = true;
						////console.log('we have a collision');
						this.fireEvent('enemykilled');
						MyApp.Stats.set('torpedoHits', MyApp.Stats.get('torpedoHits') + 1);
						this.onChangeScore(200);
						this.ship.set('kills', this.ship.get('kills') + 1);
						if (this.tactical && !this.aftView) {
							this.getPlayField().shipKillSprite.setAttributes({
								text: 'K:' + this.ship.get('kills')
							});
							this.surface.renderFrame();
						}
						//if (this.activeEnemies[j] === undefined) {debugger;}
						var eCoords = [this.activeEnemies[j].attr.x, this.activeEnemies[j].attr.y];
						var ehw = [this.activeEnemies[j].attr.height, this.activeEnemies[j].attr.width];
						this.activeEnemies[j].markedForDeath = true;
						this.activePhotons[i].markedForDeath = true;
					}
				}
				for (var k = 0, len3 = this.activeEnemyShots.length; k < len3; k++) {
					var currEnemyShot = this.activeEnemyShots[k];
					var currEnemyShotBox = currEnemyShot.getBBox(false);
					if (MyApp.util.Functions.CDHelperHitboxes(currEnemyShotBox, {
						x: photonCenter[0],
						y: photonCenter[1]
					}) && currPhoton.inAft == currEnemyShot.inAft) {
						// deflection
						if (MyApp.Preferences.get('playCombatSounds'))
							this.getSoundPlayer().playTrack('sndDeflect', true);
						haveDeflect = true;
						this.activeEnemyShots[k].markedForDeath = true;
						this.activePhotons[i].markedForDeath = true;
						MyApp.Stats.set('torpedoHits', MyApp.Stats.get('torpedoHits') + 1);
					}
				}
			}
			if (haveKill || haveDeflect) {
				for (var i = 0, len = this.activePhotons.length; i < len; i++) {
					if (this.activePhotons[i].markedForDeath) {
						this.activePhotons[i].destroy();
						Ext.Array.remove(this.activePhotons, this.activePhotons[i]);
						break;
					}
				}

			}
			if (haveDeflect) {
				for (var i = 0, len = this.activeEnemyShots.length; i < len; i++) {
					enemyshot = this.activeEnemyShots[i];
					if (enemyshot.markedForDeath) {
						var currExplosion = Ext.create('MyApp.view.explosions.Explosion1', {
							//this.getPlayField().getSurface().add({
							type: 'explosion1',
							x: Math.ceil(enemyshot.attr.x),
							y: Math.ceil(enemyshot.attr.y),
							height: Math.ceil(enemyshot.attr.height),
							width: Math.ceil(enemyshot.attr.height),
							endSize: Math.ceil(enemyshot.attr.height) + 20,
							isHidden: this.aftView != enemyshot.inAft,
							inAft: this.aftView
						});
						this.getPlayField().getSurface().add(currExplosion);
						this.activeExplosions.push(currExplosion);
						enemyshot.destroy();
						Ext.Array.remove(this.activeEnemyShots, enemyshot);
						break;
					}
				}
			}
			if (haveKill) {
				for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
					if (this.activeEnemies[i].markedForDeath) {
						var enemyview = this.activeEnemies[i].inAft;
						this.activeEnemies[i].destroy();
						Ext.Array.remove(this.activeEnemies, this.activeEnemies[i]);
						break;
					}
				}
				if (MyApp.Preferences.get('playCombatSounds'))
					this.getSoundPlayer().playTrack('sndExplosion', true);
				var currExplosion = Ext.create('MyApp.view.explosions.Explosion1', {
					//this.getPlayField().getSurface().add({
					type: 'explosion1',
					x: eCoords[0],
					y: eCoords[1],
					height: ehw[0] / 2,
					width: ehw[1] / 2,
					endSize: ehw[0] * 2,
					inAft: this.aftView,
					isHidden: (this.aftView != enemyview)
				});
				this.getPlayField().getSurface().add(currExplosion);
				this.activeExplosions.push(currExplosion);
				this.getGalacticMap().destroyShip();
			}
		}
		if (this.activePhotons.length != 0) {
			Ext.defer(function() {
				window.requestAnimationFrame(this.collisionDetector);
			}, 20, this);
		}
	},
	onExplosionAnimationEnd: function(param) {
		//Ext.Array.remove(this.activeExplosions, )
		console.log('exanimended controls');
		this.destroy();
	},
	onBtnSettingsTap: function() {
		this.getMainView().setActiveItem(2);
	},
	shipStatus: function() {
		if (!MyApp.app.gamePaused) {
			var now = new Date().getTime();
			var dt = now - (this.time || now);
			if (!this.warpEnabled)
				var depletion = 1000 / this.ship.get('velocity');
			else
				var depletion = 1000 / 1;
			if (dt >= depletion) { //The rate of energy depletions increases as velocity increases

				this.setEnergy(-1);
				if (this.tactical && !this.aftView) {
					this.getPlayField().shipStatusSprite.setAttributes({
						text: 'E:' + this.ship.get('totalEnergy')
					});
					this.surface.renderFrame();
				}
				this.time = now;
			}
			if (this.ship.get('totalEnergy') <= 0) {
				this.onGameOver();
			}
		}
		window.requestAnimationFrame(this.updateShipStatus);
	},
	
	/*
	 *
	 * SHIP MOVEMENT
	 *
	 *
	 */


	onJoyStickDragStart: function() {
		this.cx = this.getStarField().cursor_x;
		this.cy = this.getStarField().cursor_y;
	},

	onJoyStickDragEnd: function() {
		/*
		this.getStarField().cursor_x = this.cx;
		this.getStarField().cursor_y = this.cy;
		this.setUDLR(this.getStarField().cursor_x, this.getStarField().cursor_y);
		*/
		this.resetUDLR();

		for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
			this.activeEnemies[i].updateCourse(this.translations[0], this.translations[1]);
		}
		this.getPlayField().fireEvent('shipmovement', 0, 0, null);
	},

	onJoyStickDrag: function(joystick, thumb, offsetX, offsetY, e) {

		var offX = (Ext.Number.constrain(Math.floor(offsetX * 1.2), -40, 40) * -1);
		var offY = Ext.Number.constrain(Math.floor(offsetY * 1.2), -40, 40);


		this.getStarField().cursor_x = this.cx + offX;
		this.getStarField().cursor_y = this.cy + offY;

		this.setUDLR(this.getStarField().cursor_x, this.getStarField().cursor_y);


		for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
			this.activeEnemies[i].updateCourse(this.translations[0], this.translations[1]);
		}
		this.getPlayField().fireEvent('shipmovement', offX, offY, null);

	},


	resetUDLR: function() {
		this.translations[0] = 0;
		this.translations[1] = 0;
		this.getStarField().cursor_x = this.initialCursor[0];
		this.getStarField().cursor_y = this.initialCursor[1];
		this.ship.set('UD', this.translations[1]);
		this.ship.set('LR', this.translations[0]);
		if (this.tactical && !this.aftView) {
			this.getPlayField().shipUDSprite.setAttributes({
				text: 'dV: ' + this.ship.get('UD')
			});
			this.getPlayField().shipLRSprite.setAttributes({
				text: 'dH: ' + -1 * this.ship.get('LR')
			});
			this.surface.renderFrame();
		}
	},


	setUDLR: function(cursorX, cursorY) {
		this.translations[0] = cursorX - this.initialCursor[0];
		this.translations[1] = cursorY - this.initialCursor[1];
		this.ship.set('UD', this.translations[1]);
		this.ship.set('LR', this.translations[0]);
		if (this.tactical && !this.aftView) {
			if (this.getPlayField().shipUDSprite) {
				this.getPlayField().shipUDSprite.setAttributes({
					text: 'dV: ' + this.ship.get('UD')
				});
				this.getPlayField().shipLRSprite.setAttributes({
					text: 'dH: ' + -1 * this.ship.get('LR')
				});
			}
			this.surface.renderFrame();
		}
	},

	/*
	 *
	 * SHIP CONTROLS
	 *
	 */
	 
	onBtnMap: function(b, e) {
		this.getMainView().setActiveItem(2);
	},
	onMapBackButton: function(b, e) {
		this.getMainView().setActiveItem(1);
	},
	onBtnAft: function(b, e) {

		if (!this.aftView) {
			b.setText('Fwd');
			this.aftView = true;
			this.getSoundPlayer().playTrack('sndOn', true);
			this.getPlayField().outputMessage('AFT VIEW');
			this.getPlayField().setAftView(true);
			this.getStarField().setAftView(true);
			this.toggleAft(true);
		} else {
			b.setText('Aft');
			this.aftView = false;
			this.getPlayField().outputMessage('FWD VIEW');
			this.getSoundPlayer().playTrack('sndOff', true);
			this.getStarField().setAftView(false);
			this.getPlayField().setAftView(false);
			this.toggleAft(false);
		}
	},
	toggleAft: function() {
		//debugger;
		var newView = this.aftView; //true if we're going fwd -> aft, false if aft->fwd
		for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
			this.activeEnemies[i].setAttributes({
				hidden: (newView != this.activeEnemies[i].inAft)
			});
		}
		for (var i = 0, len = this.activeEnemyShots.length; i < len; i++) {
			this.activeEnemyShots[i].setAttributes({
				hidden: (newView != this.activeEnemyShots[i].inAft)
			});
		}
		for (var i = 0, len = this.activePhotons.length; i < len; i++) {
			this.activePhotons[i].setAttributes({
				hidden: (newView != this.activePhotons[i].inAft)
			});
		}
		for (var i = 0, len = this.activeExplosions.length; i < len; i++) {
			this.activeExplosions[i].setAttributes({
				hidden: (newView != this.activeExplosions[i].inAft)
			});
		}
	},
	onBtnTactical: function() {
		if (!this.tactical) {
			this.getSoundPlayer().playTrack('sndOn', true);
			this.getPlayField().outputMessage('ATTACK COMPUTER ON');
			this.tactical = true;
			this.getPlayField().setAttackComputer(true);
		} else {
			this.getSoundPlayer().playTrack('sndOff', true);
			this.getPlayField().outputMessage('ATTACK COMPUTER OFF');
			this.tactical = false;
			this.getPlayField().setAttackComputer(false);
		}
	},
	onBtnFire: function() {
		var numTorps = this.ship.get('torpedoes');

		if (numTorps > 0 && this.loadedPhotons.length != 0) {
			var currPhoton = this.loadedPhotons.shift();
			if (this.ship.get('leftTorpedoDamage') == 0 && currPhoton == 0) {
				this.activePhotons.push(this.getPlayField().firePhoton(0, this.translations, this.aftView));
				if (MyApp.Preferences.get('playCombatSounds'))
					this.getSoundPlayer().playTrack('sndTorp', true);
				this.ship.set('torpedoes', this.ship.get('torpedoes') - 1);
			}
			if (this.ship.get('rightTorpedoDamage') == 0 && currPhoton == 1) {
				this.activePhotons.push(this.getPlayField().firePhoton(1, this.translations, this.aftView));
				if (MyApp.Preferences.get('playCombatSounds'))
					this.getSoundPlayer().playTrack('sndTorp', true);
				this.ship.set('torpedoes', this.ship.get('torpedoes') - 1);
			}
			MyApp.Stats.set('torpedoesFired', MyApp.Stats.get('torpedoesFired') + 1);
			this.onChangeScore(-10);
			window.requestAnimationFrame(this.collisionDetector);
			this.updatePhotonStatus();
		} else {
			//play misfire sound
			//console.log('MISFIRE');
		}
	},
	/*
	 *
	 * VELOCITY CONTROLS
	 *
	 */
	setVelocity: function(v) {
		this.velocity = v;
		this.ship.set('velocity', v);
		if (this.aftView) {
			this.getStarField().star_speed = (v + 0.1) * -1;
		} else {
			this.getStarField().star_speed = v + 0.1;
		}
		if (this.tactical) {
			this.getPlayField().shipVSprite.setAttributes({
				text: 'V:' + Ext.Number.toFixed(v, 2)
			});
			this.surface.renderFrame();
		}
		if (this.getPlayField())
			this.getPlayField().fireEvent('shipmovement', null, null, v);
	},
	/*
	onPlayFieldPinchStart: function(ev) {
		// this.velocity = this.ship.get('velocity');
	},

	onPlayFieldPinchEnd: function(ev) {
		// this.velocity = this.getStarField().star_speed;
	},
	*/
	onPlayFieldPinch: function(scale) {
		var scale = Ext.Number.constrain(scale, 0, 2);
		if (scale > 1) {
			modifier = (scale - 1) * 1;
		} else {
			modifier = (1 - scale) * -1;
		}
		this.setVelocity(Ext.Number.constrain(this.velocity + modifier, 0, 9));
		/*
		for (var i = 0, len = this.activeEnemies.length; i < len; i++) {
			this.activeEnemies[i].recalculate(old, this.ship.get('velocity'));
		}
		*/
	},
	//When the velocity is changed from the pinch/slider
	onVelocityChange: function(me, sl, thumb, newValue, oldValue, eOpts) {
		this.setVelocity(newValue);
	},
	/*
	 *
	 * SHIELDS
	 *
	 */
	damagedShields: function() {
		var rnd = Math.random();
		if (rnd < 0.4)
			this.activateShields(false);
		else
			this.activateShields(true);
		if (this.shieldDamage) {
			this.shieldTimer = Ext.Function.defer(this.damagedShields, Math.floor(Math.random() * 1000), this);
		}
	},
	activateShields: function(bool) {
		if (bool) {
			this.getPlayField().addCls('shields');
			this.shieldsUp = true;
		} else {
			this.getPlayField().removeCls('shields');
			this.shieldsUp = false;
		}
	},
	onBtnShieldTap: function() {
		if (!this.shields) {
			if (this.ship.get('shieldDamage') < 2) {
				this.getSoundPlayer().playTrack('sndOn', true);
				this.activateShields(true);
				this.shields = true;
				this.getPlayField().outputMessage('SHIELDS ON');
				if (this.ship.get('shieldDamage') == 1) {
					this.shieldDamage = true;
					this.shieldTimer = Ext.Function.defer(this.damagedShields, Math.floor(Math.random() * 3000), this);
				}
			} else {
				this.getPlayField().outputMessage('SHIELDS DESTROYED');
			}
		} else {
			this.shieldDamage = false;
			if (this.shieldTimer != null) {
				clearTimeout(this.shieldTimer);
			}
			this.getSoundPlayer().playTrack('sndOff', true);
			this.activateShields(false);
			this.shields = false;
			this.getPlayField().outputMessage('SHIELDS OFF');
		}
	},
	/*
	 *
	 * PAUSE / RESUME / GAME OVER
	 *
	 */
	onPauseGame: function() {
		MyApp.app.gamePaused = true;
		this.getBtnResumeGame().setHidden(false);
		this.getMainView().setActiveItem(0);
		this.getSoundPlayer().stop();
		this.getApplication().getController('Intro').onHomeScreenActivate();
	},

	onResumeGame: function() {
		MyApp.app.gamePaused = false;
		this.getMainView().setActiveItem(1);
		this.getApplication().getController('Intro').onHomeScreenDeactivate();
	},

	onGameOver: function() {
		// Do game over-y stuff here
		var enemysectors = this.getGalacticMap().getEnemySectorCount();
		MyApp.app.gamePaused = true;
		this.getBtnResumeGame().setHidden(true);
		this.getMainView().setActiveItem(0);
		this.clearActiveEnemies();
		this.undamageViewScreen();
		//console.log(this.ship.get('totalEnergy'), this.ship.get('kills'));

		//var go = Ext.create('MyApp.view.intro.GameOver');

		MyApp.app.getController('Intro').getSubView().add({
			xtype: 'gameover',
			playerScore: this.playerScore.toString(),
			enemiesRemaining: enemysectors
		});
		this.getIntroView().setActiveItem(1) //flips to the game over screen


		//console.log(this.getMainView().items);
		// Ext.Msg.alert('Game Over', 'Your Score: <br> <b>' + this.playerScore.toString() + '<b>');


		this.getMainView().innerItems[2].destroy(); //Destroys the Galactic Map
		// this.getMainView().innerItems[1].destroy(); //Destroys the playview
		this.getPlayField().destroy();
	},
});
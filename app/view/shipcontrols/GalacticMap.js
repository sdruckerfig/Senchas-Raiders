Ext.define('MyApp.view.shipcontrols.GalacticMap', {
	extend: 'Ext.Container',
	xtype: 'galacticmap',
	requires: ['Ext.TitleBar'],

	targetReticle: null,
	energyPerSector: 250,
	gameTimer: null,
	enemyFleetMovementInterval: 1000 * 60 * 2, // default 2 minute turn cycle
	dradis: null,
	turnNumber: 0,

	config: {
		layout: 'fit',
		galaxyWidth: 10,
		galaxyHeight: 5,
		canvasWidth: 0,
		canvasHeight: 0,
		surface: null,
		shipPosition: {
			x: 0,
			y: 0
		},
		shipPlottedCourse: null,

		items: [{
				xtype: 'titlebar',
				title: 'GALACTIC MAP',
				docked: 'top',
				items: [{
						xtype: 'button',
						ui: 'back',
						text: 'Back'
					}
				]
			}, {
				xtype: 'draw',
				itemId: 'galacticmapcanvas',
				cls: 'galacticMapBackground'
			}, {
				xtype: 'component',
				docked: 'bottom',
				height: 30,
				cls: 'galacticMapComputerStatus',
				itemId: 'energyCost',
				tpl: ''.concat('Energy Required: {energy} | Enemies: {enemies}')
			}
		]
	},

	getEnemySectorCount: function() {
		var enemySectorCount = 0;
		for (var i = 0; i < this.getGalaxyWidth(); i++) {
			for (var j = 0; j < this.getGalaxyHeight(); j++) {
				if (this.map[i][j].type > 0) {
					enemySectorCount++;
				}
			}
		}
		return enemySectorCount;
	},

	destroyShip: function() {

		var sector = this.map[this.getShipPosition().x][this.getShipPosition().y];
		sector.count--;
		if (sector.count == 0) {
			sector.type = -1;
			this.fireEvent('clearedsector', this);
		}
	},

	scanSectorForEnemies: function(pos) {

		var sector = this.getSector(pos.x, pos.y);

		if (sector.type == 0) {
			this.fireEvent('starbasesector', sector);
		} else if (sector.type == -1) {
			this.fireEvent('emptysector', sector);
		} else if (sector.type > 0) {
			this.fireEvent('enemysector', sector);
		}

	},

	updateShipPosition: function(newPos, oldPos) {
		// ship position updated, check for enemies or starbase
		this.scanSectorForEnemies(newPos);
	},

	completeWarp: function() {


		var plottedCourse = this.getShipPlottedCourse();
		this.setShipPosition({
			x: plottedCourse.x,
			y: plottedCourse.y
		});
		this.setShipPlottedCourse({
			x: plottedCourse.x,
			y: plottedCourse.y
		});

		var enemies = this.map[plottedCourse.x][plottedCourse.y].count;
		this.down('#energyCost').setData({
			energy: 0,
			enemies: enemies
		});

	},


	calcDistance: function(x1, y1, x2, y2) {
		var dX = Math.pow(x1 - x2, 2);
		var dY = Math.pow(y1 - y2, 2);
		var distance = Math.floor(Math.sqrt(dX + dY));

		return distance;
	},

	onTap: function(ev) {

		// figure out block
		var x = ev.pageX;
		var y = ev.pageY - 45; // adjust for height of button bar at top

		var cellWidth = this.canvasWidth / this.getGalaxyWidth();
		var cellHeight = this.canvasHeight / this.getGalaxyHeight();

		// determine position of x/y target on grid
		var xPos = Math.floor(x / cellWidth);
		var yPos = Math.floor(y / cellHeight);

		var distance = this.calcDistance(xPos, yPos, this.getShipPosition().x, this.getShipPosition().y);

		if (this.map[xPos][yPos].type >= 1 && this.map[xPos][yPos].type <= 3) {
			var enemies = this.map[xPos][yPos].count;
		} else {
			var enemies = 0;
		}

		this.down('#energyCost').setData({
			energy: distance * 250,
			enemies: enemies
		});

		this.setShipPlottedCourse({
			x: xPos,
			y: yPos,
			energy: distance * this.energyPerSector
		});

		if (cellWidth > cellHeight) {
			imgSize = cellHeight - 10;
		} else {
			imgSize = cellWidth - 10;
		}

		xMod = (cellWidth - imgSize) / 2;
		yMod = (cellHeight - imgSize) / 2;

		// var easings = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'backIn', 'backOut', 'backInOut', 'elasticIn', 'elasticOut', 'bounceIn', 'bounceOut'];

		this.targetReticle.fx.setDuration(1000);
		// this.targetReticle.fx.setEasing(easings[Math.floor(Math.random() * easings.length)]);
		this.targetReticle.fx.setEasing('linear');
		this.targetReticle.setAttributes({
			x: (cellWidth * xPos) + xMod + 5,
			y: (cellHeight * yPos) + yMod + 4
		});
	},


	getEmptyRandomSector: function() {
		
		var xPos, yPos;

		while (true) {
			xPos = Math.floor(Math.random() * this.getGalaxyWidth());
			yPos = Math.floor(Math.random() * this.getGalaxyHeight());
			if (this.map[xPos][yPos].type == -1)
				break;
		}

		return {x: xPos, y: yPos};
	},

	// reinitialize the map
	// effectively resets the game

	resetMap: function() {

		this.map = new Array();

		var type = null;
		var starbases = 0;
		var xPos, yPos, pos;

		for (var i = 0; i < this.getGalaxyWidth(); i++) {
			this.map[i] = [];
			for (var j = 0; j < this.getGalaxyHeight(); j++) {

				type = Math.floor(Math.random() * 15) + 1;

				switch (type) {
					case 1:
						starbases++;
						if (starbases <= 2) this.map[i][j] = {
								type: 0,
								count: 0
						}; // limit on 4 starbases
						else this.map[i][j] = Math.floor(Math.random() * 4) + 2;
						break;
					case 2:
						this.map[i][j] = {
							type: 1,
							count: 3
						}; // enemy 1
						break;
					case 3:
						this.map[i][j] = {
							type: 2,
							count: 2
						} // enemy 2
						break;
					case 4:
						this.map[i][j] = {
							type: 3,
							count: 1
						}; // enemy 3
						break;
					default:
						this.map[i][j] = {
							type: -1,
							count: 0
						};
						break;
				}

			}
		}

		// find random empty slot for one starbase

		pos = this.getEmptyRandomSector();

		this.map[pos.x][pos.y] = {
			type: 0,
			count: 0
		}

		// find empty random slot and set position of ship

		pos = this.getEmptyRandomSector();

		this.setShipPosition({
			x: pos.x,
			y: pos.y
		});

		this.setShipPlottedCourse({
			x: pos.x,
			y: pos.y,
			energy: 0
		});


		// reset game timer
		if (this.gameTimer != null)
			window.clearInterval(this.gameTimer);

		this.gameTimer = setInterval(this.moveEnemyFleet, this.enemyFleetMovementInterval);
		this.turnNumber = 0;
		this.fireEvent('reset', this);
	},


	initialize: function() {

		this.on('show', this.onShow, this, {
			delay: 100
		});
		this.on('destroy', this.onDestroy,this);

		this.down('#galacticmapcanvas').element.on('singletap', this.onTap, this);
		this.resetMap();
		this.moveEnemyFleet = Ext.Function.bind(this.enemyFleetMovement, this);
	},

	onDestroy: function(cmp) {
		clearInterval(cmp.gameTimer);
	},

	getAdjacentOpenStarbaseSlot: function(x, y) {

		if (x + 1 < this.getGalaxyWidth()) {
			if (this.map[x + 1][y].type == -1) {
				return {
					x: x + 1,
					y: y
				}
			}
		}

		if (x - 1 >= 0) {
			if (this.map[x - 1][y].type == -1) {
				return {
					x: x - 1,
					y: y
				}
			}
		}

		if (y - 1 >= 0) {
			if (this.map[x][y - 1].type == -1) {
				return {
					x: x,
					y: y - 1
				}
			}
		}

		if (y + 1 < this.getGalaxyHeight()) {
			if (this.map[x][y + 1].type == -1) {
				return {
					x: x,
					y: y + 1
				}
			}
		}

		// starbase surrounded - move in general direction
		return {
			x: x,
			y: y
		};


	},

	// enemies on the march
	enemyFleetMovement: function() {

		//console.log('fleet movement');

		if (MyApp.app.gamePaused) {
			return;
		}


		var enemies = [];
		var starbases = [];
		var sectorType = null;

		// catalogue locations

		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[j].length; j++) {
				sectorType = this.map[i][j].type;
				if (sectorType == 0) {
					starbases.push({
						x: i,
						y: j,
						base: true
					});
				} else if (sectorType > 0) {
					enemies.push({
						x: i,
						y: j,
						type: sectorType,
						count: this.map[i][j].count
					});
				}
			}
		}


		// check for surrounded condition
		// and destroy base if necessary
		var sX, sY, openSlot;
		for (i = 0; i < starbases.length; i++) {
			sX = starbases[i].x;
			sY = starbases[i].y;
			openSlot = this.getAdjacentOpenStarbaseSlot(sX, sY);
			if (openSlot.x == sX && openSlot.y == sY) {
				this.fireEvent('starbasedestroyed', sX, sY);
				Ext.Array.erase(starbases, i, 1);
				enemies.push({
					x: sX,
					y: sY,
					type: 3,
					count: 3
				});
				break;
			}
		}

		if (starbases.length == 0) {
			// no more starbases left - fleet converges on player's position.
			// Define "dummy" starbase
			starbases.push({
				x: this.getShipPosition().x,
				y: this.getShipPosition().y,
				base: false
			})
		}

		// now determine closest starbase and move (if appropriate)
		var closestBase = null;
		var closestDistance = null;
		var distance = null;
		var dX, dY;
		var openBaseSlot = null;
		var shipPosition = this.getShipPosition();

		for (i = 0; i < enemies.length; i++) {

			// if enemy is engaged with player, continue
			if (enemies[i].x == shipPosition.x && enemies[i].y == shipPosition.y)
				continue;


			closestDistance = 999;
			for (j = 0; j < starbases.length; j++) {
				distance = this.calcDistance(enemies[i].x, enemies[i].y, starbases[j].x, starbases[j].y);
				if (closestDistance > distance) {
					closestBase = starbases[j];
					closestDistance = distance;
				}
			}

			// don't move if already DIRECTLY adjacent (does not include diagonal)

			if ((Math.abs(closestBase.x - enemies[i].x) + Math.abs(closestBase.y - enemies[i].y)) > 1) {

				// find open adjacent slot to starbase

				openBaseSlot = this.getAdjacentOpenStarbaseSlot(closestBase.x, closestBase.y);

				// determine next move
				var dX = openBaseSlot.x - enemies[i].x;
				var dY = openBaseSlot.y - enemies[i].y;

				if (Math.abs(dX) >= Math.abs(dY)) {

					if (dX > 0)
						enemies[i].x2 = enemies[i].x + 1;
					else
						enemies[i].x2 = enemies[i].x - 1;

					enemies[i].y2 = enemies[i].y;

					// calculate alternative move
					enemies[i].x3 = enemies[i].x;
					if (dY > 0) {
						enemies[i].y3 = enemies[i].y + 1;
					} else {
						enemies[i].y3 = enemies[i].y - 1;
					}

				} else {
					if (dY > 0)
						enemies[i].y2 = enemies[i].y + 1;
					else
						enemies[i].y2 = enemies[i].y - 1;

					enemies[i].x2 = enemies[i].x;

					// calculate alternative move
					enemies[i].y3 = enemies[i].y;
					if (dX > 0) {
						enemies[i].x3 = enemies[i].x + 1;
					} else {
						enemies[i].x3 = enemies[i].x - 1;
					}

				}
			} else {
				enemies[i].x2 = -1;
				enemies[i].y2 = -1;
			}
		}



		// clear map
		for (var i = 0; i < this.getGalaxyWidth(); i++) {
			this.map[i] = [];
			for (var j = 0; j < this.getGalaxyHeight(); j++) {
				this.map[i][j] = {
					type: -1,
					count: 0
				}
			}
		}

		// add objects back into the map
		for (i = 0; i < starbases.length; i++) {
			if (starbases[i].base) {
				this.map[starbases[i].x][starbases[i].y] = {
					type: 0,
					count: 0
				}
			}
		}

		// handle "collisions" - only one enemy per sector
		for (i = 0; i < enemies.length; i++) {

			// handle stationaries around starbase

			if (enemies[i].x2 == -1) {
				//console.log(enemies[i].x, enemies[i].y, 'orbiting starbase');
				this.map[enemies[i].x][enemies[i].y] = {
					type: enemies[i].type,
					count: enemies[i].count
				}
				continue;
			}

			// valid move to empty sector along path to starbase

			if (enemies[i].x2 && (this.map[enemies[i].x2][enemies[i].y2].type == -1)) {
				// //console.log(enemies[i].x, enemies[i].y, 'moving to', enemies[i].x2, enemies[i].y2);
				this.map[enemies[i].x2][enemies[i].y2] = {
					type: enemies[i].type,
					count: enemies[i].count
				}
				continue;
			}


			// conflict resolution - try alternate axis move
			try {
				if (enemies[i].x3 && (this.map[enemies[i].x3][enemies[i].y3].type == -1)) {
					// //console.log(enemies[i].x, enemies[i].y, 'alt move to', enemies[i].x3, enemies[i].y3);
					this.map[enemies[i].x3][enemies[i].y3] = {
						type: enemies[i].type,
						count: enemies[i].count
					}
					continue;
				}
			} catch (err) {

			}

			// else - gotta stay put - traffic jam!
			//console.log(enemies[i].x, enemies[i].y, 'staying put-traffic jam', this.map);
			this.map[enemies[i].x][enemies[i].y] = {
				type: enemies[i].type,
				count: enemies[i].count
			}

		}


		// check for surrounded condition
		for (i = 0; i < starbases.length; i++) {
			sX = starbases[i].x;
			sY = starbases[i].y;
			openSlot = this.getAdjacentOpenStarbaseSlot(sX, sY);
			if (openSlot.x == sX && openSlot.y == sY) {
				//console.log('firing starbase surrounded event');
				this.fireEvent('starbasesurrounded', sX, sY);
				break;
			}
		}

		// see if enemy has entered your sector
		this.scanSectorForEnemies(this.getShipPosition());

		this.onShow(this);

	},


	getSector: function(x, y) {
		if (this.map) {
			var sector = this.map[x][y];
			return {
				type: sector.type,
				count: sector.count
			};
		} else {
			return {
				type: -1,
				count: 0
			}
		}
	},

	// Starbuck, JUMP THE SHIP!!!
	setRandomCourse: function() {
		var xPos = Math.floor(Math.random() * this.getGalaxyWidth());
		var yPos = Math.floor(Math.random() * this.getGalaxyHeight());

		var distance = this.calcDistance(xPos, yPos, this.getShipPosition().x, this.getShipPosition().y);
		this.setShipPlottedCourse({
			x: xPos,
			y: yPos,
			energy: distance * this.energyPerSector
		});
	},

	// future use- animated dradis
	drawDradis: function() {

		this.surface = this.down('draw').getSurface();

		this.dradis = this.surface.add({

			type: 'ellipticalArc',
			cx: Math.floor(this.canvasWidth / 2),
			cy: this.canvasHeight,
			rx: 10,
			ry: this.canvasHeight,
			fillOpacity: 0.2,
			fillStyle: 'yellow',
			startAngle: 0,
			endAngle: 10,
			anticlockwise: true,
			zIndex: 20

		});

		this.dradis.fx.setDuration(1500);
		this.dradis.fx.setEasing('easeOut');

		this.dradis.setAttributes({
			endAngle: 200
		});

	},

	onShow: function(cmp) {

		var img, imgSize, xMod, yMod = null;


		this.surface = this.down('draw').getSurface();
		this.surface.removeAll();
		this.canvasWidth = this.surface.element.getWidth();
		this.canvasHeight = this.surface.element.getHeight();


		// draw outer rectangle
		this.surface.add({
			type: 'rect',
			x: 1,
			y: 1,
			lineWidth: 3,
			width: this.canvasWidth - 2,
			height: this.canvasHeight - 3,
			strokeStyle: 'silver'
		});

		var cellWidth = this.canvasWidth / this.getGalaxyWidth();
		var cellHeight = this.canvasHeight / this.getGalaxyHeight();

		for (var i = 1; i <= this.getGalaxyWidth(); i++) {
			this.surface.add({
				type: 'rect',
				x: cellWidth * i,
				y: 3,
				width: 1,
				height: this.canvasHeight - 5,
				fillStyle: 'silver',
				strokeStyle: 'silver'
			});
		}

		for (var i = 1; i <= this.getGalaxyHeight(); i++) {
			this.surface.add({
				type: 'rect',
				x: 3,
				y: cellHeight * i,
				width: this.canvasWidth - 5,
				height: 1,
				fillStyle: 'silver',
				strokeStyle: 'silver'

			})
		}


		// place icons

		for (var i = 0; i < this.getGalaxyWidth(); i++) {
			for (var j = 0; j < this.getGalaxyHeight(); j++) {
				img = '';
				switch (this.map[i][j].type) {

					case 0:
						img = "resources/images/spacestation/SpaceStation.png"
						break;

					case 1:
						img = "resources/images/enemy1/ship1.png"
						break;

					case 2:
						img = "resources/images/enemy1/ship2.png"
						break;

					case 3:
						img = "resources/images/enemy1/ship3.png"
						break;

				};

				if (cellWidth > cellHeight) {
					imgSize = cellHeight - 20;
				} else {
					imgSize = cellWidth - 20;
				}

				xMod = (cellWidth - imgSize) / 2;
				yMod = (cellHeight - imgSize) / 2;

				this.surface.add({
					type: 'image',
					src: img,
					width: imgSize,
					height: imgSize,
					x: (cellWidth * i) + xMod,
					y: (cellHeight * j) + yMod
				});
			}
		}


		this.targetReticle = this.surface.add({
			type: 'image',
			src: 'resources/images/starmapicons/reticle.png',
			width: imgSize,
			height: imgSize,
			zIndex: 8,
			x: (cellWidth * this.getShipPlottedCourse().x) + xMod,
			y: (cellHeight * this.getShipPlottedCourse().y) + yMod
		});

		this.surface.add({
			type: 'image',
			src: 'resources/images/starmapicons/heroship.png',
			width: imgSize,
			height: imgSize,
			x: (cellWidth * this.getShipPosition().x) + xMod,
			y: (cellHeight * this.getShipPosition().y) + yMod
		});



		// this.drawDradis();
		this.surface.renderFrame();

	}
})
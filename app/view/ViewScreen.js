Ext.define('MyApp.view.ViewScreen', {
	extend: 'Ext.Container',
	alias: 'widget.viewscreen',
	requires: [
		'Ext.draw.Component',
		'MyApp.view.StarCanvas'
	],

	c_x: null,
	c_y: null,
	starTimer: null,

	config: {
		itemId: 'viewscreen',
		style: 'background-color: #000000',
		layout: {
			type: 'fit'
		},
		aftView: false
	},


	onViewscreenActivate: function() {
		this.onChangeOrientation();
		this.initializeStars();
		var me = this;
		this.starTimer = window.setInterval(function() {
			window.requestAnimationFrame(me.animateStarField)
		},20);
	},

	updateAftView: function(nVal) {
		this.initializeStars();
		this.star_speed *= -1;
	},


	initialize: function() {
		this.n = 512;
		this.w = 0;
		this.h = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.star_color_ratio = 1;
		this.star_ratio = 256;
		this.star_speed = 1;
		this.star_speed_save = 0;
		this.star = new Array(this.n);
		this.fps = 0;
		this.cursor_x = 0;
		this.cursor_y = 0;
		this.canvas_x = 0;
		this.canvas_y = 0;
		this.setItems({
			xtype: 'starcanvas',
			itemId: 'viewscreenCanvas'
		});
		this.canvas = this.down('#viewscreenCanvas');
		this.domCanvas = Ext.get(this.canvas.getSurface().element.query('canvas')[0]);
		this.on({
			resize: this.onChangeOrientation,
			destroy: this.onDestroy,
			scope: this
		});
		Ext.Function.defer(this.onViewscreenActivate, 750, this);
		this.animateStarField = Ext.Function.bind(this.doAnimate, this);
		this.callParent(arguments);
		
		
	},

	onDestroy: function(cmp) {
		clearTimeout(this.starTimer);
	},

	onOrientationChange: function(e) {
		e = e[0];

		// var s = this.down('starcanvas');
		// //console.log('g', e.gamma);
		// //console.log('b', e.beta);

		this.cursor_x += e.gamma - this.c_x;
		this.c_x = e.gamma;
		this.cursor_y += e.beta - this.c_y;
		this.c_y = e.beta;
	},


	onChangeOrientation: function() {
		var el = Ext.get(this.element.select('canvas').elements[0]);
		this.w = el.getWidth();
		this.h = el.getHeight();

		this.x = Math.round(this.w / 2);
		this.y = Math.round(this.h / 2);
		this.z = (this.w + this.h) / 2;
		this.star_color_ratio = 1 / this.z;
		this.cursor_x = this.x;
		this.cursor_y = this.y;
	},

	doAnimate: function() {
		if (this.domCanvas.dom)
			context = this.domCanvas.dom.getContext('2d');
		else
			return;
		
		context.fillStyle = 'rgb(0,0,0)';
		context.strokeStyle = 'rgb(255,255,255)';
		mouse_x = this.cursor_x - this.x;
		mouse_y = this.cursor_y - this.y;
		// //console.log(mouse_x, mouse_y);
		// var path = '';
		// this.canvas.removeAll(true);
		context.fillRect(0, 0, this.w, this.h);
		for (var i = 0; i < this.n; i++) {
			test = true;
			this.star_x_save = this.star[i][3];
			this.star_y_save = this.star[i][4];
			this.star[i][0] += mouse_x >> 4;
			if (this.star[i][0] > this.x << 1) {
				this.star[i][0] -= this.w << 1;
				test = false;
			}
			if (this.star[i][0] < -this.x << 1) {
				this.star[i][0] += this.w << 1;
				test = false;
			}
			this.star[i][1] += mouse_y >> 4;
			if (this.star[i][1] > this.y << 1) {
				this.star[i][1] -= this.h << 1;
				test = false;
			}
			if (this.star[i][1] < -this.y << 1) {
				this.star[i][1] += this.h << 1;
				test = false;
			}
			this.star[i][2] -= this.star_speed;
			if (this.star[i][2] > this.z) {
				this.star[i][2] -= this.z;
				test = false;
			}
			if (this.star[i][2] < 0) {
				this.star[i][2] += this.z;
				test = false;
			}
			if (!test) {
				// reset starting position and angle
				this.star[i][0] = Math.random() * this.w * 2 - this.x * 2;
				this.star[i][1] = Math.random() * this.h * 2 - this.y * 2;
				this.star[i][2] = Math.round(Math.random() * this.z);
			}
			this.star[i][3] = this.x + (this.star[i][0] / this.star[i][2]) * this.star_ratio;
			this.star[i][4] = this.y + (this.star[i][1] / this.star[i][2]) * this.star_ratio;
			if (this.star_x_save > 0 && this.star_x_save < this.w && this.star_y_save > 0 && this.star_y_save < this.h && test) {
				context.lineWidth = (1 - this.star_color_ratio * this.star[i][2]) * 2;
				context.beginPath();
				context.moveTo(this.star_x_save, this.star_y_save);
				context.lineTo(this.star[i][3], this.star[i][4]);
				context.stroke();
				context.closePath();
			}
		}
		// surface.renderFrame();
		// update playfield
		/*
		this.starTimer = Ext.Function.defer(function() {
			requestAnimationFrame(this.animateStarField);
		}, 20, this);
		*/
	},



	initializeStars: function() {
		for (var i = 0; i < this.n; i++) {
			this.star[i] = new Array(5);
			this.star[i][0] = Math.random() * this.w * 2 - this.x * 2;
			this.star[i][1] = Math.random() * this.h * 2 - this.y * 2;
			this.star[i][2] = Math.round(Math.random() * this.z);
			this.star[i][3] = 0;
			this.star[i][4] = 0;
		}
	}
});
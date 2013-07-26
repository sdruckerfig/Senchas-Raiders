Ext.define('MyApp.view.dradis.Enemy1', {
	extend: 'Ext.draw.sprite.Composite',
	alias: 'sprite.dradisenemy1',
	inheritableStatics: {
		def: {
			defaults: {
				width: 50,
				height: 50
			}
		}
	},

	constructor: function() {

		this.callParent(arguments);

		this.add({
			type: 'circle',
			cx: 25,
			cy: 25,
			r: 5,
			strokeStyle: 'red'
		});

		this.add({
			type: 'rect',
			x: 24,
			y: 10,
			width: 3,
			height: 9,
			fillStyle: 'red',
			strokeStyle: 'red'
		});

		this.add({
			type: 'rect',
			rotationRads: 0.7,
			x: 29,
			y: 29,
			width: 10,
			height: 3,
			fillStyle: 'red',
			strokeStyle: 'red'
		});

		this.add({
			type: 'rect',
			rotationRads: 2.4,
			x: 11,
			y: 29,
			width: 10,
			height: 3,
			fillStyle: 'red',
			strokeStyle: 'red'
		});

	}

})
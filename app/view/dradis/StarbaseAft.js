Ext.define('MyApp.view.dradis.StarbaseAft', {
	extend: 'Ext.draw.sprite.Composite',
	alias: 'sprite.dradisstarbaseaft',
	inheritableStatics: {
		def: {
			defaults: {
				width: 20,
				height: 20
			}
		}
	},

	constructor: function() {

		this.callParent(arguments);

		this.add({
			type: 'circle',
			cx: 10,
			cy: 10,
			r: 8,
			strokeStyle: 'white'
		});
	}

})
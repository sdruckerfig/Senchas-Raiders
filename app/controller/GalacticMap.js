Ext.define('MyApp.controller.GalacticMap', {
	extend: 'Ext.app.Controller',

	config: {
		
		refs: {
			'galacticMap': 'galacticmap',
			'playField': 'playfield',
			'soundPlayer': 'sounds'
		},

		control: {
			galacticMap: {
				starbasedestroyed: 'onStarbaseDestroyed',
				starbasesurrounded: 'onStarbaseSurrounded'
			}
		}

	},


	onStarbaseSurrounded: function(x, y) {
		this.getPlayField().outputMessage('STARBASE SURROUNDED');
		this.fireEvent('changeScore', -250);
		MyApp.Stats.set('starbaseWarnings',MyApp.Stats.get('starbaseWarnings') + 1);
		this.getSoundPlayer().playTrack('sndRedAlert',true);
	},

	onStarbaseDestroyed: function(x, y) {
		MyApp.Stats.set('starbasesDestroyed',MyApp.Stats.get('starbasesDestroyed') + 1);
		this.getPlayField().outputMessage('STARBASE DESTROYED!');
		this.fireEvent('changeScore', -5000);
		this.getSoundPlayer().playTrack('sndRedAlert',true);
	}

});
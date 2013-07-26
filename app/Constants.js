Ext.define('MyApp.Constants', {
	statics: {
		
		rankings: [
			'Galactic Cook',
			'Garbage Scow Captain',
			'Rookie',
			'Novice',
			'Ensign',
			'Pilot',
			'Lieutenant',
			'Captain',
			'Major',
			'Commander',
			'Warrior',
			'Ace',
			'Star Commander'	
		],

		transmitHighScore: function() {
			Ext.Ajax.request({
				url: 'http://webapps.figleaf.com/sr/sr.cfc',
				params: {
					method: 'insertHighScore'
				},
				success: function(response) {
					Ext.Msg.alert('Saving High Score Success', 'Response code: ' + response.status);
				},
				failure: function(response, opts) {
					Ext.Msg.alert('Saving High Score Failed', 'Response code: ' + response.status);
				}
			})
		}
	}
});
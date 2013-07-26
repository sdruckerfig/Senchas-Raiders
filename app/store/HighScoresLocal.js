Ext.define('MyApp.store.HighScoresLocal', {
	extend: 'Ext.data.Store',
	requires: ['MyApp.model.HighScore'],
	config: {
		model: 'MyApp.model.HighScore',
		sorters: [
			{
				property: 'score',
				direction: 'DESC'
			}
		],
		proxy: {
			type: 'localstorage',
			id: 'sr-highscoreslocal'
		}
	}
});

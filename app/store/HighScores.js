Ext.define('MyApp.store.HighScores', {
	extend: 'Ext.data.Store',
	requires: ['MyApp.model.HighScore'],
	config: {
		model: 'MyApp.model.HighScore',
		remoteSort: true,
		remoteFilter: true,
		sorters: [
			{
				property: 'score',
				direction: 'DESC'
			}
		]
	}
});

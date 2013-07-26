Ext.define('MyApp.view.intro.HighScores', {
	extend: 'Ext.List',
	requires: [
			'Ext.plugin.ListPaging',
			'Ext.plugin.PullRefresh'
	],
	xtype: 'highscores',
	config: {
		store: 'HighScores',
		plugins: [{
				xclass: 'Ext.plugin.ListPaging',
				autoPaging: true
			}, {
				xclass: 'Ext.plugin.PullRefresh',
				pullRefreshText: 'Pull down to see updated scores'
			}
		],

		itemTpl: '<span style="display: inline-block; width:50%">{name}</span><span style="display: inline-block; width: 50%; text-align: right">{score}</span>',
		items: [{
				xtype: 'titlebar',
				docked: 'top',
				title: 'High Scores By Points',
				items: [{
						xtype: 'button',
						align: 'left',
						ui: 'back',
						text: 'Back',
						itemId: 'btnBack'
					}, {
						xtype: 'button',
						align: 'right',
						text: 'Select',
						itemId: 'btnHighScoreTypeSelect'
					}
				]
			}
		]
	}
})
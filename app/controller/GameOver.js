Ext.define("MyApp.controller.GameOver", {
	extend: 'Ext.app.Controller',
	config: {

		models: [
			'MyApp.model.Statistic'
		],
		stores: [
			'HighScores',
			'HighScoresLocal'
		],
		refs: {
			'gameOver': 'gameover',
			'introView': 'intro',
			'galacticMap': 'galacticmap',
			'mainView': 'mainview'
		},

		control: {
			gameOver: {
				savehighscore: 'onSaveHighScore',
				cancelsavehighscore: 'onCancelHighScore',
				activate: 'onGameOverActivate'
			}
		}
	},

	init: function() {
		MyApp.Stats = Ext.create('MyApp.model.Statistic');
	},

	onGameOverActivate: function(cmp) {
		console.log('ongameoveractivate', cmp.element.getWidth(), cmp.element.getHeight());
	},

	resetGame: function() {

		if (this.getGalacticMap()) {
			this.getGalacticMap().destroy();
		}

		if (this.getMainView()) {
			this.getMainView().destroy();
		}

	},

	onSaveHighScore: function(cmp) {

		Ext.Msg.prompt("Save High Score", "Enter your Name:", function(b, s) {

			if (b == 'ok') {

				var rec = Ext.getStore('HighScoresLocal').add({
					name: s,
					date: new Date(),
					score: MyApp.Stats.get('score'),
					rank: MyApp.Stats.get('rank'),
					kills: MyApp.Stats.get('torpedoHits')
				});

				// store local
				Ext.getStore('HighScoresLocal').sync();

				// store remote

				rec[0].save();
			}
			this.returnHome();

		}, this, false, MyApp.Preferences.get('name'));

	},

	onCancelHighScore: function(cmp) {
		this.returnHome();
	},


	returnHome: function() {
		this.resetGame();
		this.getIntroView().setActiveItem(0);
		Ext.Function.defer(function() {
			this.getGameOver().destroy();
		},1000,this);
	}


});
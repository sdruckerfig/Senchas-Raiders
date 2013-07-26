Ext.define('MyApp.controller.Intro', {
	extend: 'Ext.app.Controller',
	requires: ['Ext.picker.Picker'],
	highScorePicker: null,

	config: {
		models: ['HighScore'],
		stores: ['HighScores', 'HighScoresLocal'],
		views: [
			'MyApp.view.intro.Help',
			'MyApp.view.intro.HighScores',
			'MyApp.view.intro.Credits',
			'MyApp.view.intro.Preferences',
			'MyApp.view.intro.Instructions',
			'MyApp.view.intro.GameOver',
			'MyApp.view.intro.Contact'
		],
		refs: {
			mainView: 'main',
			settingsBtn: 'home #btnSettings',
			introScreen: 'intro',
			preferencesView: 'preferences',
			playField: 'playfield',
			'subView': '#sub',
			'instructionsBtn': 'home #btnInstructions',
			'highScoresBtn': 'home #btnHighScores',
			'sortHighScoreListBtn': 'highscores #btnHighScoreTypeSelect',
			'highScoreTitleBar': 'highscores > titlebar',
			'highScoresList': 'highscores',
			'creditsBtn': 'home #btnCredits',
			'viewport': 'viewport',
			'homeScreen': 'home',
			'homeDraw': 'draw#homedraw',
			'newGameBtn': 'home #btnNewGame',
			'galacticMap': 'galacticmap',
			'shipActionsToolBar': 'shipactions',
			'speedbar': 'speedbar',
			'contactBtn': 'home #btnContact'
		},
		control: {

			homeScreen: {
				'deactivate': 'onHomeScreenDeactivate',
				'activate': 'onHomeScreenActivate'
			},

			introScreen: {
				add: 'onIntroScreenAdd'
			},
			settingsBtn: {
				tap: 'onSettingsTap'
			},

			'#sub #btnBack': {
				tap: 'onBackButton'
			},

			'instructionsBtn': {
				tap: 'onBtnInstructionsTap'
			},
			'highScoresBtn': {
				tap: 'onBtnHighScoresTap'
			},
			'sortHighScoreListBtn': {
				tap: 'onHighScoreSort'
			},
			'picker#highscorepicker': {
				change: 'onHighScorePickSort'
			},
			'creditsBtn': {
				tap: 'onCreditsBtnTap'
			},
			'contactBtn': {
				tap: 'onContactBtnTap'
			},
			'homeDraw': {
				explosion: 'onExplosion'
			},
			'newGameBtn': {
				tap: 'onNewGame'
			}

		}
	},


	onHomeScreenDeactivate: function(cmp) {

		this.getHomeDraw().removeAll(true);
	},

	onHomeScreenActivate: function(cmp) {

		Ext.Function.defer(function() {
			var s = this.getHomeDraw().getSurface().add({
				type: 'starbase',
				x: 70,
				y: 70,
				width: 60,
				height: 60
			});

			if (Ext.os.is.Desktop) {
				s.startRotation();
			}

		}, 1, this);

		Ext.Function.defer(function() {
			this.getHomeDraw().getSurface().add({
				type: 'enemy4',
				zIndex: 5
			});
		}, 500, this);

	},

	onNewGame: function(b, e) {


		if (MyApp.Preferences.get('readInstructions') || b === true) {

			// destroy game views
			this.getApplication().getController('GameOver').resetGame();

			// generate new stats
			MyApp.Stats = Ext.create('MyApp.model.Statistic');

			this.getMainView().add([{
				xtype: 'mainview' //getMainView().activeItem == 1
			}, {
				xtype: 'galacticmap' //getMainView().activeItem == 2
			}]);

			var pf = this.getPlayField();

			this.onHomeScreenDeactivate();
			this.getMainView().setActiveItem(1);

			this.getGalacticMap().resetMap();
			this.getApplication().gamePaused = false;

			if (pf)
				pf.fireEvent('newgame', pf);

			this.getApplication().getController('Controls').reset();
			this.getApplication().getController('Preferences').execPreferences(MyApp.Preferences.getData());
		
		} else {

			Ext.Msg.confirm('Read the Instructions?','Would you like to read the instructions before playing?', function(b,e) {
				if (b == 'yes') {
					this.onBtnInstructionsTap();
				} else {
					this.onNewGame(true);
				}
			}, this)

		}

	},



	onExplosion: function(photon) {
		photon.destroy();
		//console.log('You got hit by an enemy in the title screen');
		// shake viewport
		if (MyApp.Preferences.get('shakeScreen')) {
			this.getViewport().setLeft(-5);
			Ext.Function.defer(function() {
				this.getViewport().setLeft(5);
			}, 20, this);
			Ext.Function.defer(function() {
				this.getViewport().setLeft(0);
			}, 40, this);
		}
	},

	/*

	Housekeeping

	*/


	onBackButton: function() {
		this.getIntroScreen().setActiveItem(0);
		Ext.Function.defer(this.destroySubView, 250, this);
	},

	destroySubView: function() {
		this.getSubView().removeAll(true, true);
	},


	/* 
	  
	  Preferences

	*/

	onSettingsTap: function(cmp) {
		this.getSubView().add({
			xtype: 'preferences'
		});
		this.getIntroScreen().setActiveItem(1);
	},


	/*

	 High Score

	*/

	onBtnHighScoresTap: function() {
		Ext.getStore('HighScores').load();
		this.getSubView().add({
			xtype: 'highscores'
		});
		this.getIntroScreen().setActiveItem(1);
	},


	onHighScoreSort: function(b, e) {


		var highScorePicker = Ext.create('Ext.Picker', {
			itemId: 'highscorepicker',
			slots: [{
				name: 'highScoreSorter',
				title: 'High Score List',
				data: [{
					text: 'Highest Scores',
					value: 1
				}, {
					text: 'Most Recent',
					value: 2
				}, {
					text: 'Personal Best',
					value: 3
				}]
			}]
		});

		Ext.Viewport.add(highScorePicker);
		highScorePicker.show();
	},


	onHighScorePickSort: function(picker, selectedObj, eOpts) {


		if (selectedObj.highScoreSorter == 3) {
			var store = Ext.getStore('HighScoresLocal');
			Ext.getStore('HighScores').removeAll();
			store.load();
		} else {
			var store = Ext.getStore('HighScores');
			Ext.getStore('HighScoresLocal').removeAll();
		}
		this.getHighScoresList().setStore(store);

		switch (selectedObj.highScoreSorter) {
			case 1:
				this.getHighScoreTitleBar().setTitle('Highest Scores');
				store.sort('score', 'DESC');
				store.load();
				break;
			case 2:
				this.getHighScoreTitleBar().setTitle('Recent Scores');
				store.sort('date', 'DESC');
				store.load();
				break;
			case 3:
				this.getHighScoreTitleBar().setTitle('Your Personal Best');
				store.load();
				break;
		}

	},

	/*

	 Instructions

	*/

	onBtnInstructionsTap: function(b, e) {
		this.getSubView().add({
			xtype: 'instructions'
		});
		this.getIntroScreen().setActiveItem(1);
		MyApp.Preferences.set('readInstructions',true);
		MyApp.Preferences.save();
	},

	/*

	Credits 

	*/

	onCreditsBtnTap: function(b, e) {
		this.getSubView().add({
			xtype: 'credits'
		});
		this.getIntroScreen().setActiveItem(1);
	},

	onContactBtnTap: function(b, e) {
		this.getSubView().add({
			xtype: 'contact'
		});
		this.getIntroScreen().setActiveItem(1);
	}

});
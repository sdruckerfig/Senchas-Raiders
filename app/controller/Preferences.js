Ext.define('MyApp.controller.Preferences', {
	extend: 'Ext.app.Controller',

	config: {

		views: [
			'MyApp.view.intro.Preferences'
		],
		models: [
			'MyApp.model.Preference'
		],
		refs: {
			preferencesView: 'preferences',
			'preferencesBtnSave': 'preferences #btnSave',
			'shipActionsToolBar': 'shipactions',
			'speedbar': 'speedbar',
			introScreen: 'intro',
			'subView': '#sub',
			'joyStick': 'joystick',
			'main': 'mainview'
		},
		control: {

			'preferencesView': {
				initialize: 'onPreferencesViewInitialize'
			},
			'preferencesBtnSave': {
				tap: 'onPreferencesSave'
			}

		}
	},



	init: function() {
		
		MyApp.model.Preference.load(1, {
			scope: this,
			failure: function(record, operation) {
				MyApp.Preferences = Ext.create('MyApp.model.Preference');
				MyApp.Preferences.save();
			},
			success: function(record, operation) {
				MyApp.Preferences = record;
			}
		});
	},


	destroySubView: function() {
		this.getSubView().removeAll(true, true);
	},


	/* 
	  
	  Preferences

	*/

	execPreferences: function(settings) {

		var playSounds = false;

		if (this.getShipActionsToolBar()) {
			if (settings.rightControls) {
				this.getShipActionsToolBar().setDocked('right');
				if (this.getSpeedbar()) {
					this.getSpeedbar().setDocked('left');
				}
				this.getJoyStick().setLeft(5);
			} else {
				this.getShipActionsToolBar().setDocked('left');
				if (this.getSpeedbar()) {
					this.getSpeedbar().setDocked('right');
					this.getJoyStick().setLeft(Ext.Viewport.element.getWidth() - 230);
				} else {
					this.getJoyStick().setLeft(Ext.Viewport.element.getWidth() - 160);
				}
			}
		}

		var sounds = Ext.ComponentQuery.query('audio');

		if (settings.playSounds == 0) {
			playSounds = false;
		} else {
			playSounds = true;
		}
		for (var i = 0; i < sounds.length; i++) {
			sounds[i].setMuted(!playSounds);
		}

	},

	onPreferencesSave: function(cmp) {

		var settings = this.getPreferencesView().getValues();

		// commit
		MyApp.Preferences.set(settings);
		MyApp.Preferences.save();

		// execute
		this.execPreferences(settings);

		// return to home
		this.getIntroScreen().setActiveItem(0);
		Ext.Function.defer(this.destroySubView, 250, this);
	},

	onPreferencesViewInitialize: function(cmp) {
		cmp.setRecord(MyApp.Preferences);
	},


	onPreferencesSaveButtonTap: function() {
		var data = this.getPreferencesView().getValues();
		/*
		this.getViewScreen().n = data.stars;
		this.getViewScreen().initializeStars();
		*/
		this.getIntroScreen().setActiveItem(0);
	}

});
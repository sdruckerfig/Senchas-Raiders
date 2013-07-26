Ext.define('MyApp.view.intro.Preferences', {
	extend: 'Ext.form.Panel',
	xtype: 'preferences',
	requires: [
			'Ext.form.FieldSet',
			'Ext.form.Spinner',
			'Ext.field.Toggle',
			'Ext.field.Select',
			'Ext.field.Email'
	],
	config: {
		style: 'background-color: #ffffff',
		items: [{
				xtype: 'titlebar',
				title: 'Preferences',
				docked: 'top',
				items: [{
						xtype: 'button',
						text: 'Back',
						ui: 'back',
						align: 'left',
						itemId: 'btnBack'
					}, {
						xtype: 'button',
						text: 'Save',
						itemId: 'btnSave',
						ui: 'confirm',
						align: 'right'
					}
				]
			}, 

			{ 
				xtype: 'fieldset',
				title: 'High Score Info',
				items: [
					{
						xtype: 'textfield',
						name: 'name',
						label: 'Your Name'
					},
					{
						xtype: 'emailfield',
						name: 'email',
						label: 'Your Email'
					}

				]
			},

			{
				xtype: 'fieldset',
				title: 'Game Features',
				items: [{
						xtype: 'spinnerfield',
						label: 'Stars',
						minValue: 32,
						maxValue: 512,
						stepValue: 32,
						groupButtons: false,
						name: 'stars'
					},
					{
						xtype: 'togglefield',
						label: 'Ship Sound FX',
						name: 'playSounds'
						
					},
					{
						xtype: 'togglefield',
						label: 'Combat Sound FX',
						name: 'playCombatSounds'
						
					},
					{
						xtype: 'togglefield',
						label: 'Screen Shake',
						name: 'shakeScreen'
						
					},
					{
						xtype: 'selectfield',
						label: 'Control Dock',
						name: 'rightControls',
						options: [
							{text: 'Right', value: true},
							{text: 'Left', value: false}
						]
					}
				]
			}
		

	]
}
});
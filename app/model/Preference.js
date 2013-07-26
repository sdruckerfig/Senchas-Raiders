Ext.define('MyApp.model.Preference', {
	extend: 'Ext.data.Model',
	config: {
		fields: [{
				name: 'id',
				type: 'int',
				defaultValue: 1
			},
			{
				name: 'stars',
				type: 'int',
				defaultValue: 512
			}, 
			{  
				name: 'name',
				type: 'string',
				defaultValue: ''
			}, {
				name: 'email',
				type: 'string',
				defaultValue: ''
			},
			{
				name: 'rightControls',
				type: 'boolean',
				defaultValue: true
			},
			{
				name: 'playSounds',
				type: 'boolean',
				defaultValue: true
			},
			{
				name: 'playCombatSounds',
				type: 'boolean',
				defaultValue: true
			},
			{
				name: 'shakeScreen',
				type: 'boolean',
				defaultValue: false
			},
			{
				name: 'readInstructions',
				type: 'boolean',
				defaultValue: false
			}
		],
		proxy: {
			type: 'localstorage',
			id: 'sr-preferences'
		},
		validations: [{
			type: 'format',
			field: 'email',
			matcher: /^[a-zA-Z0-9]+@.+\..+$/
		}]
	}
});
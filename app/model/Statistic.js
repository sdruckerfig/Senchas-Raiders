Ext.define('MyApp.model.Statistic', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
		{
			name: 'score',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'rank',
			type: 'string',
			defaultValue: ''
		},
		{
			name: 'energy',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'torpedoesFired',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'torpedoHits',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'starbasesDestroyed',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'starbaseWarnings',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'dockings',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'shipHits',
			type: 'int',
			defaultValue: 0
		}
		]
	}
});
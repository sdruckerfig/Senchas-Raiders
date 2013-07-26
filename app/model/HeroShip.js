Ext.define('MyApp.model.HeroShip', {
	extend: 'Ext.data.Model',
	config: {
		fields: [{
			name: 'shipName',
			type: 'string',
			defaultValue: 'The Defiant'
		}, {
			name: 'totalEnergy',
			type: 'integer',
			defaultValue: 9999
		},
		{
			name: 'torpedoes',
			type: 'integer',
			defaultValue: 50
		},
		{
			name: 'kills',
			type: 'integer',
			defaultValue: 0
		},
		{
			name: 'velocity',
			type: 'float',
			defaultValue: 1
		},
		{
			name: 'UD',
			type: 'integer',
			defaultValue: 0
		},
		{
			name: 'LR',
			type: 'integer',
			defaultValue: 0
		},
		{
			name: 'shieldEnergy',
			type: 'integer',
			defaultValue: 50
		}, {
			name: 'attackComputerDamage',
			type: 'int',
			defaultValue: 0
		}, {
			name: 'shieldDamage',
			type: 'int',
			defaultValue: 0
		}, {
			name: 'engineDamage',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'leftTorpedoDamage',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'rightTorpedoDamage',
			type: 'int',
			defaultValue: 0
		},
		{
			name: 'sectorX',
			type: 'int'
		},
		{
			name: 'sectorY',
			type: 'int'
		}
		]
	},
	reload: function() {
		this.set('totalEnergy',9999);
		this.set('shieldEnergy',50);
		this.set('attackComputerDamage',0);
		this.set('shieldDamage',0);
		this.set('engineDamage',0);
		this.set('torpedoes',50);
		this.set('velocity',1);
		this.set('leftTorpedoDamage',0);
		this.set('rightTorpedoDamage',0);
		this.set('kills', 0);
	}
});
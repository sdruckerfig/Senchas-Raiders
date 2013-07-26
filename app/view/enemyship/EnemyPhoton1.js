Ext.define('MyApp.view.enemyship.EnemyPhoton1', {
	extend: 'MyApp.view.enemyship.EnemyPhoton',
	alias: 'sprite.enemyphotontorpedo1',
	inheritableStatics: {
		def: {
			defaults: {
				src: 'resources/images/photons/enemyphoton1.png'
			}
		}
	},
	photonType: 1
});
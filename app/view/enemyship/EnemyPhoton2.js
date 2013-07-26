Ext.define('MyApp.view.enemyship.EnemyPhoton2', {
	extend: 'MyApp.view.enemyship.EnemyPhoton',
	alias: 'sprite.enemyphotontorpedo2',
	inheritableStatics: {
		def: {
			defaults: {
				src: 'resources/images/photons/enemyphoton2.png'
			}
		}
	},
	photonType: 2
});
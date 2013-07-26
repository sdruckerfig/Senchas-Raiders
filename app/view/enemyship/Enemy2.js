Ext.define('MyApp.view.enemyship.Enemy2', {
	extend: 'MyApp.view.enemyship.Enemy',
	alias: 'sprite.enemy2',
	requires: ['MyApp.view.enemyship.EnemyPhoton2'],
	inheritableStatics: {
		def: {
			defaults: {
				itemId: 'enemy2',
				src: 'resources/images/enemy1/ship2.png',
				enemyType: 2,
				torpedo: "enemyphotontorpedo2"
			}
		}
	}
});
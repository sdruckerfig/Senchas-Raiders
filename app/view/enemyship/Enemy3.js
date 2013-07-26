Ext.define('MyApp.view.enemyship.Enemy3', {
	extend: 'MyApp.view.enemyship.Enemy',
	requires: ['MyApp.view.enemyship.EnemyPhoton3'],
	alias: 'sprite.enemy3',
	inheritableStatics: {
		def: {
			defaults: {
				itemId: 'enemy3',
				src: 'resources/images/enemy1/ship3.png',
				enemyType: 3,
				torpedo: "enemyphotontorpedo3"
			}
		}
	}
});
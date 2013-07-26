Ext.define('MyApp.view.enemyship.Enemy1', {
	extend: 'MyApp.view.enemyship.Enemy',
	alias: 'sprite.enemy1',
	requires: ['MyApp.view.enemyship.EnemyPhoton1'],
	inheritableStatics: {
		def: {
			defaults: {
				itemId: 'enemy1',
				src: 'resources/images/enemy1/ship1.png',
				enemyType: 1,
				torpedo: "enemyphotontorpedo1"
			}
		}
	}
});
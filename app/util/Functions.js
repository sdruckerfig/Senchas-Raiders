Ext.define('MyApp.util.Functions', {
	statics: {
		CDHelperHitboxes: function(enemyBox, photonBox) {
			var cond1 = enemyBox.x < photonBox.x && photonBox.x < enemyBox.x + enemyBox.width;
			var cond2 = enemyBox.y < photonBox.y && photonBox.y < enemyBox.y + enemyBox.height;
			return (cond1 && cond2);
		},
		distance: function(xArr, yArr) {
			return distance(xArr[0], yArr[0], xArr[1], yArr[1]);
		},
		distance: function(x1, y1, x2, y2) {
			return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
		},
		getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	sizes: [-123, 20,35,50,65,80,95,110,125,140], //sizes[0] is our nonvalue
	cont: function() {return MyApp.app.getController('Controls')}
	}
});
Ext.define('MyApp.view.intro.GameOver', {
    extend: 'Ext.Container',
    xtype: 'gameover',
    
    config: {
        playerScore: 0,
        cls: 'board',
        enemiesRemaining: 1,
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'center'
        },
        items: [{
                xtype: 'container',
                height: 40,
                docked: 'bottom',
                margin: '0 0 5 0',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [{
                        xtype: 'button',
                        text: 'Save',
                        width: 100,
                        margin: '0 20 0 0',
                        handler: function(b,e) {
                            var top =  b.up('gameover');
                            top.fireEvent('savehighscore',top);
                        }
                    }, {
                        xtype: 'button',
                        text: 'Cancel',
                        width: 100,
                        handler: function(b,e) {
                            var top =  b.up('gameover');
                            top.fireEvent('cancelsavehighscore',top);
                        }
                    }
                ]
            }
        ]
    },
    initialize: function() {

        if (this.getEnemiesRemaining() > 0) {
            var s = "<h1>GAME OVER, MAN! GAME OVER!</h1>"
        } else {
            var s = "<h1>You are THE ONE, Neo!</h1>";
        };

        s+="".concat(
            "<table id='gameoverstats'>",
            "<tr><th>Energy Used:</th><td>{0}</td>",
            "<th>Torp Impacts:</th><td>{1}</td></tr>",
            "<tr><th>Starbase Warnings:</th><td>{2}</td>",
            "<th>Starbases Destroyed:</th><td>{3}</td></tr>",
            "<tr><th>Torpedos Fired:</th><td>{4}</td>",
            "<th>Torpedo Hits:</th><td>{5}</td></tr>",
            "<tr><th>Your Score:</th><td>{6}</td></tr>",
            "<tr><th>Your Rank:</th><td colspan='3' class='rank'>{7}</td></tr>",
            "</table>"
        );

       
        var rank = MyApp.Constants.rankings[Ext.Number.constrain(Math.floor(this.getPlayerScore() / 1000), 0, 12)];

        var mod = this.getPlayerScore() % 1000;
        if (mod <= 250) {
            rank += ", Class 4";
        } else if (mod <= 500) {
            rank += ", Class 3";
        } else if (mod <= 750) {
            rank += ", Class 2";
        } else if (mod > 750) {
            rank += ", Class 1";
        }


        this.add({
            xtype: 'component',
            margin: '20 0 0 0',
            html: Ext.String.format(s,
                 MyApp.Stats.get('energy'),
                 MyApp.Stats.get('shipHits'),
                 MyApp.Stats.get('starbaseWarnings'),
                 MyApp.Stats.get('starbasesDestroyed'),
                 MyApp.Stats.get('torpedoesFired'),
                 MyApp.Stats.get('torpedoHits'),
                 this.getPlayerScore(),
                 rank
            ),
            styleHtmlContent: true
        });



    }
});
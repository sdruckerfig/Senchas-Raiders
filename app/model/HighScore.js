Ext.define('MyApp.model.HighScore', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.identifier.Uuid'],
    config: {
        identifier: 'uuid',
        fields: [{
                name: 'name'
            }, {
                name: 'email'
            }, {
                dateFormat: 'm/d/Y H:i',
                name: 'date',
                type: 'date'
            }, {
                name: 'score',
                type: 'int'
            }, {
                name: 'rank',
                type: 'int'
            }, {
                name: 'kills',
                type: 'int'
            }
        ],
        proxy: {
            type: 'ajax',
            api: {
                read: 'http://webapps.figleaf.com/sr/sr.cfc?method=getHighScores',
                create: 'http://webapps.figleaf.com/sr/sr.cfc?method=insertHighScore',
                update: 'http://webapps.figleaf.com/sr/sr.cfc?method=insertHighScore',
                destroy: null
            },
           
            reader: {
                type: 'json',
                rootProperty: 'data',
                successProperty: 'success',
                totalProperty: 'count'
            }
        }
    }
});
Ext.define('MyApp.view.joystick.Joystick', {
    extend: 'Ext.Container',
    xtype: 'joystick',

    requires: [
        'MyApp.view.joystick.Thumb',
        'Ext.fx.easing.EaseOut'
    ],

    config: {
        cls: 'x-joystick',
        margin: '0 0 0 0',
        items: [{
            xtype: 'joystickthumb',
            draggable: true
        }]
    },

    center: 0,

    // @private
    initialize: function() {

        var element = this.element;

        this.callParent();

        this.on('painted', this.onPainted, this, {
            delay: 100
        });

        this.on({
            scope: this,
            delegate: '> joystickthumb',
            tap: 'onTap',
            dragstart: 'onThumbDragStart',
            drag: 'onThumbDrag',
            dragend: 'onThumbDragEnd'
        });
    },

    onPainted: function(cmp) {
        this.center = this.getHeight() / 2 - 15;
        this.down('joystickthumb').getDraggable().setInitialOffset(this.center);
    },


    onThumbDragStart: function() {
        this.fireEvent('dragstart', this);
    },

    onThumbDrag: function(thumb, e, offsetX, offsetY) {
        this.fireEvent('drag', this, thumb, offsetX - this.center, offsetY - this.center, e);
        return true;
    },

    onThumbDragEnd: function(thumb, e) {
        this.fireEvent('dragend', this, thumb, e);
        thumb.getDraggable().setOffset(this.center, this.center);
    },


    // @private
    onTap: function(e) {
        if (this.isDisabled()) {
            return;
        }
    },

    doSetDisabled: function(disabled) {
        this.callParent(arguments);

        var items = this.getItems().items,
            ln = items.length,
            i;

        for (i = 0; i < ln; i++) {
            items[i].setDisabled(disabled);
        }
    }

});
/**
 * @private
 * Utility class used by Ext.slider.Slider - should never need to be used directly.
 */
Ext.define('MyApp.view.verticalslider.Thumb', {
    extend: 'Ext.Component',
    xtype : 'verticalthumb',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'verticalsliderthumb',

        /**
         * @cfg
         * @inheritdoc
         */
        draggable: {
            direction: 'vertical'
        }
    },

    // Strange issue where the thumbs translation value is not being set when it is not visible. Happens when the thumb 
    // is contained within a modal panel.
    platformConfig: [{
        platform: ['ie10'],
        draggable: {
            translatable: {
                translationMethod: 'csstransform'
            }
        }
    }],

    elementWidth: 0,
    elementHeight: 0,

    initialize: function() {
        this.callParent();

        this.getDraggable().onBefore({
            dragstart: 'onDragStart',
            drag: 'onDrag',
            dragend: 'onDragEnd',
            scope: this
        });

        this.element.on('resize', 'onElementResize', this);
    },

    onDragStart: function() {
        
        if (this.isDisabled()) {
            return false;
        }

        this.relayEvent(arguments);
    },

    onDrag: function() {
        if (this.isDisabled()) {
            return false;
        }

        this.relayEvent(arguments);
    },

    onDragEnd: function() {
        if (this.isDisabled()) {
            return false;
        }

        this.relayEvent(arguments);
    },

    onElementResize: function(element, info) {
        this.elementWidth = info.width;
        this.elementHeight = info.height;
    },

    getElementWidth: function() {
        return this.elementWidth;
    },

     getElementHeight: function() {
        return this.elementHeight;
    }
});

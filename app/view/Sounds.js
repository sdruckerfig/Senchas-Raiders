Ext.define('MyApp.view.Sounds', {
    extend: 'Ext.Audio',
    xtype: 'sounds',

    audioSprite: null, // DOM reference
    audioQueue: [],
    canPlayThrough: false,

    config: {
        hidden: true,

        ambientTrack: 'sndThrust',
        playAmbient: false,

        tracks: {
            sndOn: {
                start: 0,
                length: 0.35
            },
            sndOff: {
                start: 1.38,
                length: 0.5
            },
            sndWarp: {
                start: 2.974,
                length: 6.456
            },
            sndWarpExit: {
                start: 9.43,
                length: 6.96
            },
            sndTorp: {
                start: 17.39,
                length: 1.32
            },
            sndRedAlert: {
                start: 19.71,
                length: 2.289
            },
            sndExplosion: {
                start: 22.862,
                length: 0.984
            },
            sndDamage: {
                start: 24.846,
                length: 1.704
            },
            sndDeflect : {
                start: 27.550,
                length: 1.992
            },
            sndHullHit : {
                start: 30.042,
                length: 1.776
            }

        },

        url: 'resources/sounds/audiosprite.mp3',
        itemId: 'sndSprite'
    },

pauseSound: function() {
   // debugger;
},

    initialize: function() {
        this.callParent(arguments);
        this.audioSprite = Ext.get(this.element.select('audio').elements[0]);
        this.audioTimeUpdate = Ext.Function.bind(this.onTimeUpdate, this);
        // Ext.fly(this.element.select('audio').elements[0]).on('canplaythrough',this.onCanPlayThrough,this);
    },

    
    onCanPlayThrough: function() {
        Ext.Msg.alert('can play');
    },
    

    onTimeUpdate: function(e) {

        if (this.audioQueue.length > 0) {
            if (this.getCurrentTime() >= this.audioQueue[0].start + this.audioQueue[0].length) {
                this.pause();
                Ext.Array.erase(this.audioQueue, 0, 1);
                if (this.audioQueue.length > 0)
                    this.playQueue();
                else if (this.getAmbientTrack() != '' && this.getPlayAmbient()) {
                    this.playTrack(this.getAmbientTrack());
                }
            }

            Ext.Function.defer(function() {
                requestAnimationFrame(this.audioTimeUpdate);
            },250,this);
           
        }

    },

    updatePlayAmbient: function(bool) {
        if (bool) {
           // this.playTrack(this.getAmbientTrack());
        }
    },

    playQueue: function(bNow, err) {

        try {
            this.setCurrentTime(this.audioQueue[0].start);
           
           this.play();
            requestAnimationFrame(this.audioTimeUpdate);
        } catch (e) {
            // overcome potential ios seeking issue
            this.play();
            this.pause();
        }

    },

    playTrack: function(name, bNow) {

        if (bNow) {
            this.audioQueue = [];
        }
        this.audioQueue.push(
            this.getTracks()[name]);

        this.playQueue(bNow);

    }
})
'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
	locations: [
        {
            lat: String,
            lng: String
        }
    ],
    time: Number, // in seconds
	distance: Number, // in meters
    pace: Number,   // in min/km
    runner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    privacy: {
    	type: String,
    	enum: ['private', 'friends', 'public'],
    	required: true,
    	default: 'public'
    },
    ghost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ghost',
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

});

// validates bestRun, bestRunner and time on the run's ghost
schema.pre('save', function (next) {
    mongoose.model('Ghost').findById(this.ghost)
    .then(ghost => {
        if (!ghost.bestRun) {
            ghost.bestRun = this._id;
            ghost.bestRunner = this.runner;
            ghost.save().then(next)
        } else if (this.time < ghost.time) {
            ghost.bestRun = this._id;
            ghost.bestRunner = this.runner;
            ghost.time = this.time;
            ghost.save().then(next)
        } else next();
    }).then(null, next)
});

mongoose.model('Run', schema);
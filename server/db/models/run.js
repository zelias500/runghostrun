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

mongoose.model('Run', schema);
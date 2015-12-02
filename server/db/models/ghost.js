'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
    },
    bestRun: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run'
    },
    best: { // either time or distance
        type: Number
    },
    bestRunner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    runs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run'
    }],
    locations: [
        {
            lat: String,
            lng: String
        }
    ],
    totalDistance: Number, // in METERS
    privacy: {
    	type: String,
    	enum: ['private', 'friends', 'public'],
    	required: true,
    	default: 'public'
    },
    ghostType: {
    	type: String,
    	enum: ['route', 'time', 'distance'],
    	required: true,
    	default: 'route'
    }
});

schema.methods.addNewRun = function(run){
    if (!this.best || run.time < this.best){
        this.bestRun = run._id;
        this.best = run.time;
        this.bestRunner = run.runner;
    }
	this.runs.push(run._id);
	return this.save();
}

mongoose.model('Ghost', schema);
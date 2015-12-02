'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var earthRadius = 6371000 // in km
function toRad (degrees){
    return degrees * Math.PI/180;
};
function calcGeoDistance(loc1, loc2){
    var latRads1 = toRad(loc1.lat);
    var latRads2 = toRad(loc2.lat);
    var latDeltaRads = toRad(loc2.lat-loc1.lat);
    var longDeltaRads = toRad(loc2.lng-loc1.lng);
    var a = Math.sin(latDeltaRads/2) * Math.sin(latDeltaRads/2) + Math.cos(latRads1) * Math.cos(latRads2) * Math.sin(longDeltaRads/2) * Math.sin(longDeltaRads/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Number((earthRadius * c).toFixed(1));
};

var schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String
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

schema.statics.getGhostsNear = function (locationObject) {
    return this.find().populate('owner runs bestRunner').then(allGhosts => {
        return allGhosts.filter(ghost => {
            if (ghost.locations.length){
                return calcGeoDistance(ghost.locations[0], locationObject) < 5000            
            } else return false;
        })
        .sort( (a,b) => { // closest ghosts appear first
            return calcGeoDistance(a.locations[0], locationObject) - calcGeoDistance(b.locations[0], locationObject)
        })
    })
}

mongoose.model('Ghost', schema);
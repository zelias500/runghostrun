'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var Run = mongoose.model('Run');

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
        required: true,
        index: true
    },
    title: {
        type: String
    },
    bestRun: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run'
    },
    time: { // either time or distance
        type: Number
    },
    bestRunner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locations: [
        {
            lat: String,
            lng: String
        }
    ],
    distance: Number, // in meters
    privacy: {
    	type: String,
    	enum: ['private', 'friends', 'public'],
    	required: true,
    	default: 'public'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

schema.methods.getRuns = function () {
    return Run.find({ghost: this._id}).populate('runner').exec();
}

schema.statics.getGhostsNear = function (locationObject) {
    return this.find().populate('owner bestRunner').then(allGhosts => {
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
'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
	locations: [{lat: String, lng: String}],
	totalDistance: Number, // in METERS
	previousTimes: [{time: Number, challenger: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} }], // in seconds
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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
})

schema.methods.getBestTime = function(){
	return this.previousTimes.reduce(function(prev, curr){
		return Math.max(prev.time, curr.time);
	})
}

schema.methods.addNewTime = function(data){
	this.previousTimes.push(data);
	return this.save();
}

schema.virtual('timesRun').get(function(){
	return this.previousTimes.length;
})

schema.virtual('totalKM').get(function(){
	return this.totalDistance/1000;
})

schema.virtual('totalMiles').get(function(){
	return Math.round(this.totalKM*0.621371*100)/100;
})

mongoose.model('Ghost', schema)
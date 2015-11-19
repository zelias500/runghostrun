'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var _ = require('lodash');

var schema = new mongoose.Schema({
	locations: [{lat: String, lng: String}],
    best: {time: Number, challenger: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}},
	totalDistance: Number, // in METERS
	previousTimes: [{time: Number, challenger: {type: mongoose.Schema.Types.ObjectId, ref: 'User'} }], // in seconds
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
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


schema.pre('save', function(next){
    if (this.previousTimes.length){
        this.best = this.previousTimes.reduce(function(prev, curr){
             if(prev.time < curr.time){
                return prev;
             }
             else{
                return curr;
             }
        })        
    }
    next();
})

// return all one challenger's previous time on this ghost
schema.methods.getChallengerTime = function(id){
   return this.previousTimes.filter(function(time){
       return time.challenger == id
   })
}

//return all ghost where user has a time

schema.statics.getChallenger = function(id){
    return this.find({previousTimes:{$elemMatch:{challenger : id}}}).exec()
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
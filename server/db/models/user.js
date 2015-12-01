'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Ghost = mongoose.model('Ghost');
var Run = mongoose.model('Run');
var _ = require('lodash');

var schema = new mongoose.Schema({
    email: {
        type: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    displayName: String,
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    ghosts: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Ghost'
        }
    ],
    runs: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Run'
        }
    ]
});

schema.methods.addGhost = function(data){
    var self = this;
    return Ghost.create(data).then(function(ghost){
        self.ghosts.push(ghost);
        return self.save();
    });
}

schema.methods.recentFriendActivity = function () {
    return Promise.all(this.friends.map(friend => Run.find({runner: friend})))
    .then(runArray => {
        return _.flatten(runArray).sort((a,b) => {
            return a.timestamp > b.timestamp;
        }).slice(0, 3);
    }).then(null, error => {console.error(error)})
}

mongoose.model('User', schema);
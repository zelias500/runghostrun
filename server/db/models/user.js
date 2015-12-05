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
    picture: {
        type: String,
        default: 'img/ghost_profile.jpg'
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
    privacy: {
        type: String,
        enum: ['Private', 'Friends', 'Public'],
        required: true,
        default: 'public'
    },
    isMetric: {
        type: Boolean,
        default: true
    }
});

schema.methods.getGhosts = function () {
    return Ghost.find({owner: this._id}).exec();
}

schema.methods.getRuns = function () {
    return Run.find({runner: this._id}).populate('ghost owner').exec();
}

schema.methods.getRecentFriendActivity = function () {
    return Promise.all(this.friends.map(friendId => {
        return this.model('User').find({_id: friendId}).exec();
    }))
    .then(friends => {
        friends = _.flatten(friends);
        return Promise.all(friends.map(friend => {
            return friend.getRuns();
        }));
    })
    .then(runs => {
        runs = _.flatten(runs);
        return Ghost.populate(runs, {path: 'ghost'});
    })
    .then(runs => {
        return this.model('User').populate(runs, {path: 'runner'});
    })
    .then(runs => {
        return runs.sort((a,b) => {
            return b.timestamp > a.timestamp;
        }).slice(0, 3);
    }).then(null, error => {
        console.error(error)
    })
}

mongoose.model('User', schema);

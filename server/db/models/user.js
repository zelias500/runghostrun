'use strict';
const mongoose = require('mongoose');
const Ghost = mongoose.model('Ghost');     
const Run = mongoose.model('Run');
const _ = require('lodash');

const schema = new mongoose.Schema({
    email: {
        type: String,
        index: true
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
        default: 'Public'     
    },        
    isMetric: {       
        type: Boolean,        
        default: true     
    },        
    speechEnabled: {      
        type: Boolean,        
        default: true     
    },        
    newChallenges: [      
        {     
            type: mongoose.Schema.Types.ObjectId,     
            ref: 'Ghost'      
        }     
    ]     
});
          
schema.methods.getGhosts = function () {      
    return Ghost.find({owner: this._id}).exec();      
}     
      
schema.methods.getRuns = function () {        
    return Run.find({runner: this._id}).populate('ghost owner').exec();       
}     
      
schema.methods.getRecentFriendActivity = function () {        
    return Promise.all(this.friends.map(friendId => {     
        return this.model('User').findById(friendId).exec();      
    }))       
    .then(friends => {        
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
      
schema.methods.challengeFriends = function (ghostId) {        
    return Promise.all(this.followers.map(friendId => {       
        return this.model('User').findById(friendId).exec();      
    }))       
    .then(friends => {        
        return Promise.all(friends.map(friend => {        
            if (friend.newChallenges.indexOf(ghostId) === -1) friend.newChallenges.push(ghostId)      
            return friend.save();     
        }))       
    })        
    .then(null, error => {        
        console.error(error)      
    })        
}

mongoose.model('User', schema);

'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Ghost = mongoose.model('Ghost');

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
    ghosts: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Ghost'
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

mongoose.model('User', schema);
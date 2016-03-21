'use strict';
const mongoose = require('mongoose');
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
    displayName: String
});


mongoose.model('User', schema);

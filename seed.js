/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

require('babel/register');

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Ghost = Promise.promisifyAll(mongoose.model('Ghost'));
var Run = Promise.promisifyAll(mongoose.model('Run'));

var RunLocations = [
    {
        lat: "40.692390",
        lng: "-73.977133"
    },    
    {
        lat: "40.692967",
        lng: "-73.976415"
    },
    {
        lat: "40.692789",
        lng: "-73.976092"
    },
    {
        lat: "40.692261",
        lng: "-73.976760"
    },
    {
        lat: "40.692275",
        lng: "-73.977078"
    }]

connectToDb.then(function () {
    var zackId, tomId, theGhost;
    User.create({
        email: 'zack@gmail.com', 
        displayName: 'Zack'
    }).then(function (user) {
        zackId = user._id;
        return User.create({
            email: 'tom@gmail.com', 
            displayName: 'Tom'
        })
    })
    .then(function (user) {
        tomId = user._id;
        return Ghost.create({
            owner: zackId,
            title: 'Quick Sprint',
            locations: RunLocations,
            distance: 240,
            time: 110,
            privacy: 'Public'
        })
    })
    .then(function (ghost) {
        theGhost = ghost;
        var runArray = [{
          locations: RunLocations,
            distance: 240,
            time: 100,
            ghost: ghost._id,
            runner: zackId
        },
        {
          locations: RunLocations,
            distance: 240,
            time: 95,
            ghost: ghost._id,
            runner: zackId
        },
        {
          locations: RunLocations,
            distance: 240,
            time: 90,
            ghost: ghost._id,
            runner: zackId
        },
        {
          locations: RunLocations,
            distance: 240,
            time: 89,
            ghost: ghost._id,
            runner: tomId
        }]
        return Run.create(runArray)
    })
    .then(function () {
            console.log(chalk.green('Seed successful!'));
            process.kill(0);
        }).then(null, function (err) {
            console.error(err);
            process.kill(1);
        });
});





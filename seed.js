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

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

connectToDb.then(function () {
    var userId, theGhost;
    User.create({email: 'zack@123.com', displayName: 'Zack'}).then(function (user) {
        userId = user._id;
        return Ghost.create({
            owner: user._id,
            title: 'Seed run',
            locations: [{
                    lat: '40.7048981',
                    lng: '-74.012385'
                },
                {
                  lat: '40.7069985',
                  lng: '-74.012384'  
                }
            ],
            distance: 2336,
            time: 60,
            privacy: 'Public'
        })
    })
    .then(function (ghost) {
        theGhost = ghost;
        var runArray = [{
          locations: [{
                lat: '40.7048981',
                lng: '-74.012385'
                },
                {
                  lat: '40.7069985',
                  lng: '-74.012384'  
                }
            ],
            distance: 2336,
            time: 60,
            ghost: ghost._id,
            runner: userId
        },
        {
          locations: [{
                lat: '40.7048981',
                lng: '-74.012385'
                },
                {
                  lat: '40.7069985',
                  lng: '-74.012384'  
                }
            ],
            distance: 2336,
            time: 71,
            ghost: ghost._id,
            runner: userId
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





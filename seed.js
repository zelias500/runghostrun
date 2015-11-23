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

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Ghost = Promise.promisifyAll(mongoose.model('Ghost'));

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
    User.create({email: 'zack@123.com'}).then(function(user){
        return user.addGhost({
            locations: [
            {lat: '40.704570', lng: '-74.009413'}, 
            {lat:'40.780168', lng:'-73.975204'}, 
            {lat:'40.752981',lng:'-73.940470'}],
            totalDistance: 6598,
            owner: user,
        })
    })
    .then(function(){
        // User.findAsync({}).then(function (users) {
        //     if (users.length === 0) {
        //         return seedUsers();
        //     } else {
        //         console.log(chalk.magenta('Seems to already be user data, exiting!'));
        //         process.kill(0);
        //     }
        // })
        // .then(function () {
            console.log(chalk.green('Seed successful!'));
            process.kill(0);
        }).then(null, function (err) {
            console.error(err);
            process.kill(1);
        });
    });        
// })





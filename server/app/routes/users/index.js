'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");


// GET all users
router.get('/', function(req,res,next){
	User.find({}).then(function(users){
		res.status(200).json(users)
	}).then(null, next)
});

// POST new user
router.post('/', function(req, res, next){
   var newUser = new User(req.body);
      return newUser.save().then(function(newuser){
      	res.status(201).json(newuser)
      }).then(null, next);
});

// id parameter
router.param('id', function(req, res, next, id){
	 User.findById(id).then(function(user){
	 	 req.targetUser = user;
	 	 next();
	 }).then(null, next);
});

// GET single user by id
router.get('/:id', function(req,res, next){
     res.status(200).json(req.targetUser)
});

// GET user friends by id
router.get('/:id/friends', function(req,res, next){
	 req.targetUser.populate('friends').execPopulate().then(function(fd){
         res.status(200).json(fd)
	 }).then(null, next);
});

// GET user challenges by id
router.get('/:id/challenges', function(req, res, next){
    Ghost.getChallenger(req.params.id).then(function(challenges){
    	 res.status(200).json(challenges)
    }).then(null, next);
});

// GET user challenges by challenge id
router.get('/:id/challenges/:challengeId', function(req, res, next){
	Ghost.findById(req.params.challengeId).then(function(ghost){
		return ghost.getChallengerTime(req.params.id);
	}).then(function(user){
		  res.status(200).json(user);
	}).then(null, next);
});

// PUT user by id
router.put('/:id', function(req, res, next){
	_.extend(req.targetUser, req.body);
	req.targetUser.save().then(function(update){
		res.status(201).json(update);
	}).then(null, next);

});

// POST new ghost
router.post('/:id/ghost', function(req,res, next){
	req.targetUser.addGhost(req.body).then(function(update){
		res.status(201).json(update);
	}).then(null, next)
});

router.delete('/:id', function(req, res, next){
    User.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.targetUser);
    });
});

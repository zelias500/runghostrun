'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");
var Run = mongoose.model("Run");


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
	req.targetUser.populate('friends').execPopulate().then(function(user){
    	res.status(200).json(user.friends)
	}).then(null, next);
});

router.get('/:id/friends/recent', function(req, res, next){
	if (req.targetUser.friends.length){
		req.targetUser.recentFriendActivity().then(recentActivity => {
			res.status(200).json(recentActivity);
		})
	} else res.status(200).end();
})

// GET user runs
router.get('/:id/runs', function(req, res, next){
	req.targetUser.populate('runs').execPopulate().then(function(user){
		var runsToPopulate = user.runs.map(function(run){
			return run.populate('ghost').execPopulate()
		})
		return Promise.all(runsToPopulate)
	})
	.then(function(runs){
		res.status(200).json(runs)
	})
	.then(null, next);
});

// GET user ghosts
router.get('/:id/ghosts', function(req, res, next){
	req.targetUser.populate('ghosts').execPopulate().then(function(user){
		res.status(200).json(user.ghosts);
	}).then(null, next);
});

// PUT user settings update
router.put('/:id', function (req, res, next){
	_.extend(req.targetUser, req.body);
	req.targetUser.save().then(function(update){
		res.status(201).json(update);
	}).then(null, next);

});

// POST a new friend
router.post('/:id/friends', function (req, res, next) {
	var friendId = req.body.friendId;
	var userToReturn;

	req.targetUser.friends.addToSet(friendId);
	req.targetUser.save()
	.then(function (user) {
		userToReturn = user;
		return User.findById(friendId).exec();
	})
	.then(function (friend) {
		friend.followers.addToSet(userToReturn._id);
		return friend.save();
	})
	.then(function (friend) {
		res.status(201).json(userToReturn);
	}).then(null, next)
});

// PUT to remove a friend
router.put('/:id/friends/remove', function (req, res, next) {
	var friendId = req.body.friendId;
	var userToReturn;

	req.targetUser.friends.pull(friendId);
	req.targetUser.save()
	.then(function (user) {
		userToReturn = user;
		return User.findById(friendId).exec();
	})
	.then(function (friend) {
		friend.followers.pull(userToReturn._id);
		return friend.save();
	})
	.then(function (friend) {
		res.status(201).json(userToReturn);
	}).then(null, next)
});

// POST new ghost (create a new ghost with rundata)
router.post('/:id/ghosts', function (req, res, next){
	var ourRun;
	Run.create(req.body)
	.then(function (run){
		// add run to users runs array
		ourRun = run;
		req.targetUser.runs.push(run);
		return req.targetUser.save();
	})
	.then(function () {
		// create the ghost that matches this run
		return Ghost.create({
			owner: req.targetUser._id,
			locations: ourRun.locations,
			totalDistance: ourRun.distance
		})
	})
	.then(function (ghost){
		return ghost.addNewRun(ourRun)
	})
	.then(function (ghost){
		res.status(201).json(ghost);
	})
	.then(null, next);
});

router.delete('/:id', function(req, res, next){
    User.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.targetUser);
    });
});

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");
var Run = mongoose.model("Run");

// GET all users
router.get('/', function (req,res,next) {
	User.find({})
	.then(users => res.status(200).json(users))
	.then(null, next)
});

// POST new user
router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(newUser => res.status(201).json(newUser))
    .then(null, next);
});

// id parameter
router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(user => {
	 	req.targetUser = user;
	 	next();
	}).then(null, next);
});

// GET single user by id
router.get('/:id', function (req,res, next) {
     res.status(200).json(req.targetUser)
});

// GET user friends by id
router.get('/:id/friends', function (req,res, next) {
	req.targetUser.populate('friends').execPopulate()
	.then(user => res.status(200).json(user.friends))
	.then(null, next);
});

// GET a user's followers
router.get('/:id/followers', function (req,res, next) {
	req.targetUser.populate('followers').execPopulate()
	.then(user => res.status(200).json(user.followers))
	.then(null, next);
});

// GET recent friend activity
router.get('/:id/friends/recent', function (req, res, next) {
	if (req.targetUser.friends.length) {
		req.targetUser.getRecentFriendActivity()
		.then(recentActivity => {
			res.status(200).json(recentActivity);
		}).then(null, next);
	} else res.status(200).end();
})

// GET user runs
router.get('/:id/runs', function (req, res, next) {
	req.targetUser.getRuns()
	.then(runs => {
		return Ghost.populate(runs, {path: 'ghost'})
	})
	.then(runs => {
		return User.populate(runs, {path: 'ghost.owner'})
	})
	.then(runs =>res.status(200).json(runs))
	.then(null, next)
});

// GET user ghosts
router.get('/:id/ghosts', function (req, res, next) {
	req.targetUser.getGhosts()
	.then(ghosts => res.status(200).json(ghosts))
	.then(null, next);
});

// PUT user settings update
router.put('/:id', function (req, res, next){
	_.extend(req.targetUser, req.body);
	req.targetUser.save()
	.then(update => res.status(201).json(update))
	.then(null, next);

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

// contact sync route
router.post('/:id/friends/sync', function (req, res, next){
	User.find().then(allUsers => {
		var validContacts = allUsers.filter(user => {
			return _.find(req.body.contacts, function(i){
				return req.body.contacts[i].emails.some(email => {
					return email.value == user.email;
				})
			})
		})
		req.user.friends.push(validContacts);
		req.user.save().then(user => {
			res.status(200).json(user);
		})
	})
})

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

// DELETE a single user by id
router.delete('/:id', function(req, res, next){
    User.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.targetUser);
    }).then(null, next)
});

// PUT to challenge friends
router.put('/:id/friends/challenge', function (req, res, next) {
	req.targetUser.challengeFriends(req.body.ghostId)
	.then(function (friends){
		return res.status(201).json("Success");
	}).then(null, next)
});

// PUT to remove newChallenges
router.put('/:id/emptychallenges', function (req, res, next) {
	req.targetUser.newChallenges = [];
	req.targetUser.save()
	.then(function (user){
		return res.status(201).json(user);
	})
});

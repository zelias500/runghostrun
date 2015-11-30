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
	 req.targetUser.populate('friends').execPopulate().then(function(user){
	 	var myFriend = user.friends;
        res.status(200).json(myFriend)
	 }).then(null, next);
});

router.get('/:id/friends/recent', function(req, res, next){
	if (req.targetUser.friends.length){
		req.targetUser.recentFriendActivity().then(recentActivity => {
			res.status(200).json(recentActivity);
		})
	}
	else {
		res.status(200).end();
	}

})

// GET user challenges by id
router.get('/:id/challenges', function(req, res, next){
	//I can only get all myown challenges now
     User.findById(req.params.id).populate('ghosts').then(function(user){
          var allGhost = user.ghosts
          res.status(200).json(allGhost)
     }).then(null, next)

    // Ghost.getChallenger(req.params.id).then(function(challenges){
    // 	 res.status(200).json(challenges)
    // }).then(null, next);
});

// GET user challenges by challenge id
router.get('/:id/challenges/:challengeId', function(req, res, next){
	Ghost.findById(req.params.challengeId).then(function(ghost){
		return ghost.getChallengerTime(req.params.id);
	}).then(function(ghost){
		  res.status(200).json(ghost);
	}).then(null, next);
});

// PUT user by id
router.put('/:id', function(req, res, next){
	_.extend(req.targetUser, req.body);
	req.targetUser.save().then(function(update){
		res.status(201).json(update);
	}).then(null, next);

});

// PUT user friend list

router.post('/:id/addFriend', function(req, res, next){
	req.targetUser.friends.addToSet(req.body.friendid)
	req.targetUser.save().then(function(user){
		res.status(201).json(user)
	}).then(null, next)
})

// POST new ghost
router.post('/:id/ghosts', function(req,res, next){
	req.targetUser.addGhost(req.body).then(function(update){
		res.status(201).json(update);
	}).then(null, next)
});

router.delete('/:id', function(req, res, next){
    User.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.targetUser);
    });
});

'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");
var Run = mongoose.model("Run");

// GET all ghosts
router.get('/', function (req,res,next) {
	Ghost.find({}).populate('owner bestRunner')
	.then(ghosts => res.status(200).json(ghosts))
	.then(null, next);
});

// POST new ghost
router.post('/', function (req, res, next) {
	Ghost.create(req.body)
	.then(ghost => res.status(201).json(ghost))
	.then(null, next);
});

// GET nearby ghosts
router.get('/nearby/:lat?/:lng?', function (req, res, next) {
	Ghost.getGhostsNear({
		lat: Number(req.query.lat), 
		lng: Number(req.query.lng)
	})
	.then(function(nearbyGhosts) {
		var privacyCheck = nearbyGhosts.filter(ghost => {
			if (ghost.privacy == 'friends' && req.user) return req.user.friends.indexOf(ghost.owner._id) !== -1;
			else return ghost.privacy == 'public'
		})
		res.status(200).json(privacyCheck);
	}).then(null, next);
});

// id parameter
router.param('id', function (req, res, next, id) {
	 Ghost.findById(id).populate('owner bestRunner bestRun').exec()
	 .then(function (ghost) {
	 	req.ghost = ghost;
	 	next();
	 }).then(null, next);
});

// GET users best time for that ghost, if any
router.get("/:id/users/:userId", function (req, res, next) {
	req.ghost.getRuns()
	.then(runs => {
		var userBest = runs.reduce((best, run) => {
			if (run.runner != req.params.userId) return best;
			else {
				if (!best) return run;
				else {
					if (best.time > run.time) return run;
					else return best;
				}
			}
		}, null);
		res.status(200).json(userBest);
	})
	.then(null, next)
});

// GET single ghost by id
router.get('/:id', function (req, res, next) {
     res.status(200).json(req.ghost);
});

// GET all runs for a ghost
router.get('/:id/runs', function (req, res, next) {
	req.ghost.getRuns()
	.then(runs => res.status(200).json(runs))
	.then(null, next);
});

// PUT ghost by id
router.put('/:id', function (req, res, next) {
	console.log(req.ghost)
	console.log(req.body)
	_.extend(req.ghost, req.body);
	req.ghost.save()
	.then(function (update) {
		res.status(200).json(update)
	}).then(null, next);
});

// DELETE a ghost by id
router.delete('/:id', function (req, res, next) {
    Ghost.remove({_id:req.params.id})
    .then(() => res.status(200).json(req.ghost))
    .then(null, next);
});

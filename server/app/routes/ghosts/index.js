'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");
var Run = mongoose.model("Run");

// GET all ghosts
router.get('/', function(req,res,next){
	Ghost.find({}).populate('owner bestRunner').then(function(ghosts){
		res.status(200).json(ghosts)
	}).then(null, next);
});

// POST is done via User as they can choose to transform a run into a ghost

// testing: http://localhost:3000/api/ghosts/nearby?lat=40.7052076&lng=-74.0091257
// GET nearby ghosts (req.query)
router.get('/nearby', function(req, res, next){
	Ghost.getGhostsNear({lat: Number(req.query.lat), lng: Number(req.query.lng)}).then(function(nearbyStuff){
		res.status(200).json(nearbyStuff);
	}).then(null, next);
})

// id parameter
router.param('id', function(req, res, next, id){
	 Ghost.findById(id).populate('owner bestRunner bestRun').then(function(ghost){
	 	 req.ghost = ghost
	 	 next()
	 }).then(null, next);
});

// GET users best time for that ghost, if any
router.get("/:id/users/:userId", function (req, res, next){
	return Run.populate(req.ghost, {path: 'runs'})
	.then(function(){
		var userBest = req.ghost.runs.reduce(function(best, run){
			if (run.runner != req.params.userId) return best;
			else {
				if (!best) return run;
				else {
					if (best.time > run.time) return run;
					else return best;
				}
			}
		}, null)
		res.status(200).json(userBest);
	})
})


// GET single ghost by id
router.get('/:id', function (req, res, next){
     res.status(200).json(req.ghost);
});


// POST new run
router.post('/:id', function(req, res, next){
	var ourUpdatedGhost;
	var ourRun;
	Run.create(req.body)
	.then(function (run){
		ourRun = run;
		return req.ghost.addNewRun(run);
	})
	.then(function (updatedGhost){
		ourUpdatedGhost = updatedGhost;
		return User.findById(req.body.runner).exec();
	})
	.then(function (runner){
		runner.runs.push(ourRun);
		return runner.save();
	})
	.then(function(){
		res.status(201).json(ourUpdatedGhost);
	})
	.then(null, next);
});

// PUT ghost by id
router.put('/:id', function(req, res, next){
	_.extend(req.ghost, req.body)
	req.ghost.save().then(function(update){
		res.status(200).json(update)
	}).then(null, next);
});

router.delete('/:id', function(req, res, next){
    Ghost.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.ghost);
    });
});

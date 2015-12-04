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

// GET nearby ghosts (req.query)
router.get('/nearby', function(req, res, next){
	Ghost.getGhostsNear({lat: Number(req.query.lat), lng: Number(req.query.lng)}).then(function(nearbyStuff){
		var privacyCheck = nearbyStuff.filter(ghost => {
		if (ghost.privacy == 'friends' && req.user) return req.user.friends.indexOf(ghost.owner._id) != -1;
			return ghost.privacy == 'public'
		})
		res.status(200).json(privacyCheck);
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
	req.body.timestamp = Date.now();
	req.body.ghost = req.ghost._id;
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
		return Run.populate(ourUpdatedGhost, {path: 'runs'})
	})
	.then(function (ghost) {
		res.status(201).json(ghost);
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

//PUT delete ghost reference
// router.put('/:id/removeRun', function(req, res, next){
//    var ghost = req.ghost;
//     Run.find({}).then(function(runs){
//     	console.log(runs)
//     	var promise = []
//     	runs.forEach(function(run){
//     		console.log(run)
//     		// if(run.ghost == req.params.id){
//     		// 	promise.push(Run.remove({_id:run._id}))
//     		// }
//     	})
//         Promise.all(promise).then(function(){
//         	res.status.json(ghost)
//         })
//     })

// })

router.delete('/:id', function(req, res, next){
    Ghost.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.ghost);
    });
});

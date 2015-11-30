'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");
var Run = mongoose.model("Run");


// GET all runs
router.get('/', function (req, res, next){
	Run.find({}).populate('runner ghost').then(function(runs){
		res.status(200).json(runs)
	}).then(null, next);
});

// POST is done via Ghosts as they are properties of them.

// id parameter
router.param('id', function (req, res, next, id){
	 Run.findById(id).populate('runner ghost').then(function(run){
	 	 req.run = run
	 	 next()
	 }).then(null, next);
});

// GET single run by id
router.get('/:id', function (req, res, next){
     res.status(200).json(req.run);
});


// PUT Run by id
router.put('/:id', function (req, res, next){
	_.extend(req.run, req.body)
	req.run.save().then(function(update){
		res.status(200).json(update)
	}).then(null, next);
});

router.delete('/:id', function(req, res, next){
    Run.remove({_id :req.params.id}).then(function(){
      return res.status(200).json(req.run);
    });
});

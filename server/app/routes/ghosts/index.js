'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model("User");
var Ghost = mongoose.model("Ghost");


// GET all ghosts
router.get('/', function(req,res,next){
	Ghost.find({}).populate('owner').then(function(ghosts){
		res.status(200).json(ghosts)
	}).then(null, next);
});

// id parameter
router.param('id', function(req, res, next, id){
	 Ghost.findById(id).then(function(ghost){
	 	 req.ghost = ghost
	 	 next()
	 }).then(null, next);
});

// GET single ghost by id
router.get('/:id', function(req,res, next){
     res.status(200).json(req.ghost);
});



// POST new time
router.post('/:id', function(req, res, next){
	req.ghost.addNewTime(req.body).then(function(update){
		 res.status(201).json(update)
	}).then(null, next);
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

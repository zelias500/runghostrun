'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose')
var _ = require('lodash');
var User = mongoose.Model("User")
var Ghost = mongoose.Model("Ghost")


//find all ghosts
router.get('/', function(req,res,next){
	Ghost.find({}).then(function(ghosts){
		res.status(200).json(ghosts)
	}).then(null, next)

})


/**
 * Get a single ghost
 */

router.param('id', function(req, res, next, id){
	 Ghost.findById(id).then(function(ghost){
	 	 req.ghost = ghost
	 	 next()
	 }).then(null, next)
})

router.get('/:id', function(req,res, next){
     res.status(200).json(req.ghost)
})



//Add new time
router.post('/:id', function(req, res, next){
	req.ghost.addNewTime(req.body).then(function(update){
		 res.status(201).json(update)
	}).then(null, next)
})

// update ghost settings
router.put('/:id', function(req, res, next){
	_.extend(req.ghost, req.body)
	req.ghost.save().then(function(update){
		res.status(201).json(update)
	}).then(null, next)

})



router.delete('/:id', function(req, res, next){
    Ghost.remove({_id :req.params.id}).then(function(){
      return res.status(204).end()
    })
})




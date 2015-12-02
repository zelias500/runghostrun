var dbURI = 'mongodb://localhost:27017/ghost';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Ghost = mongoose.model('Ghost');

var locationObject = {
	lat:"40.7052076",
	lng:"-74.0091257"
}

describe('Ghost model', function() {

	describe('get nearby static', function(){
		it('should find ghosts nearby a given location', function(done){
			





		})
	})

})
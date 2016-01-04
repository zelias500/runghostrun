'use strict';
const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/ghosts', require('./ghosts'));
router.use('/runs', require('./runs'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

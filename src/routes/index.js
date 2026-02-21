const express = require('express');
const router = express.Router();
const usersRouter = require('./users.router');
const utilitiesRouter = require('./utilities.router');

router.use('/api/users', usersRouter);
router.use('/api/utilities', utilitiesRouter);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

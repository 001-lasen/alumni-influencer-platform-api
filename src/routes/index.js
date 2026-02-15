const express = require('express');
const router = express.Router();
const usersRouter = require('./users.router');

router.use('/api/users', usersRouter);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

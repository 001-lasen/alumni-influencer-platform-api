const express = require('express');
const router = express.Router();

// These routes just serve the EJS shell.
// Auth is handled client-side — if no token, JS redirects to /dashboard/login.

router.get('/login', (req, res) => res.render('dashboard/login', { title: 'Login' }));
router.get('/', (req, res) => res.render('dashboard/index', { title: 'Dashboard' }));
router.get('/alumni', (req, res) => res.render('dashboard/alumni', { title: 'View Alumni' }));
router.get('/graphs', (req, res) => res.render('dashboard/graphs', { title: 'Analytics & Graphs' }));

module.exports = router;

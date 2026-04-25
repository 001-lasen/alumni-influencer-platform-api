const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getAlumni,
    getSummary,
    getProgrammes,
    getGraduationTrend,
    getSectors,
    getJobTitles,
    getTopEmployers,
    getCertifications,
    getProfessionalCourses,
} = require('../controllers/analyticsController');

// All analytics endpoints require login
// DEVELOPER role = university analytics dashboard client
router.get('/alumni', authMiddleware(['ADMIN', 'DEVELOPER']), getAlumni);
router.get('/summary', authMiddleware(['ADMIN', 'DEVELOPER']), getSummary);
router.get('/programmes', authMiddleware(['ADMIN', 'DEVELOPER']), getProgrammes);
router.get('/graduation-trend', authMiddleware(['ADMIN', 'DEVELOPER']), getGraduationTrend);
router.get('/sectors', authMiddleware(['ADMIN', 'DEVELOPER']), getSectors);
router.get('/job-titles', authMiddleware(['ADMIN', 'DEVELOPER']), getJobTitles);
router.get('/top-employers', authMiddleware(['ADMIN', 'DEVELOPER']), getTopEmployers);
router.get('/certifications', authMiddleware(['ADMIN', 'DEVELOPER']), getCertifications);
router.get('/professional-courses', authMiddleware(['ADMIN', 'DEVELOPER']), getProfessionalCourses);

module.exports = router;

const db = require('../models');
const {Op, fn, col, literal} = require('sequelize');

// GET /api/analytics/alumni
// Returns all alumni with their latest degree and current employment
const getAlumni = async (req, res) => {
    try {
        const {programme, graduationYear, sector} = req.query;

        const degreeWhere = {};
        if (programme) degreeWhere.degreeName = {[Op.like]: `%${programme}%`};
        if (graduationYear) {
            degreeWhere.completionDate = {
                [Op.between]: [
                    `${graduationYear}-01-01`,
                    `${graduationYear}-12-31`
                ]
            };
        }

        const employmentWhere = {isCurrent: true};
        if (sector) employmentWhere.sector = {[Op.like]: `%${sector}%`};

        const alumni = await db.UserDetails.findAll({
            include: [
                {
                    model: db.Degrees,
                    as: 'degrees',
                    where: Object.keys(degreeWhere).length ? degreeWhere : undefined,
                    required: Object.keys(degreeWhere).length > 0,
                    attributes: ['degreeName', 'institution', 'completionDate'],
                },
                {
                    model: db.EmploymentHistory,
                    as: 'employmentHistory',
                    where: Object.keys(employmentWhere).length ? employmentWhere : {isCurrent: true},
                    required: false,
                    attributes: ['companyName', 'jobTitle', 'sector'],
                },
            ],
            attributes: ['uuid', 'firstName', 'lastName', 'userName', 'email', 'linkedInProfile'],
        });

        res.json({success: true, data: alumni});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/summary
// Returns headline numbers for dashboard cards
const getSummary = async (req, res) => {
    try {
        const totalAlumni = await db.UserDetails.count();
        const totalDegrees = await db.Degrees.count();
        const totalCertifications = await db.Certifications.count();
        const totalEmployed = await db.EmploymentHistory.count({where: {isCurrent: true}});

        res.json({
            success: true,
            data: {totalAlumni, totalDegrees, totalCertifications, totalEmployed}
        });
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/programmes
// Degree name breakdown (bar chart)
const getProgrammes = async (req, res) => {
    try {
        const data = await db.Degrees.findAll({
            attributes: ['degreeName', [fn('COUNT', col('id')), 'count']],
            group: ['degreeName'],
            order: [[literal('count'), 'DESC']],
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/graduation-trend
// Alumni count per graduation year (line chart)
const getGraduationTrend = async (req, res) => {
    try {
        const data = await db.Degrees.findAll({
            attributes: [
                [fn('YEAR', col('completionDate')), 'year'],
                [fn('COUNT', col('id')), 'count']
            ],
            group: [fn('YEAR', col('completionDate'))],
            order: [[literal('year'), 'ASC']],
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/sectors
// Employment sector breakdown (pie/doughnut chart)
const getSectors = async (req, res) => {
    try {
        const data = await db.EmploymentHistory.findAll({
            where: {isCurrent: true},
            attributes: ['sector', [fn('COUNT', col('id')), 'count']],
            group: ['sector'],
            order: [[literal('count'), 'DESC']],
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/job-titles
// Top job titles (horizontal bar chart)
const getJobTitles = async (req, res) => {
    try {
        const data = await db.EmploymentHistory.findAll({
            where: {isCurrent: true},
            attributes: ['jobTitle', [fn('COUNT', col('id')), 'count']],
            group: ['jobTitle'],
            order: [[literal('count'), 'DESC']],
            limit: 10,
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/top-employers
// Top employers (bar chart)
const getTopEmployers = async (req, res) => {
    try {
        const data = await db.EmploymentHistory.findAll({
            where: {isCurrent: true},
            attributes: ['companyName', [fn('COUNT', col('id')), 'count']],
            group: ['companyName'],
            order: [[literal('count'), 'DESC']],
            limit: 10,
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/certifications
// Top certifications (bar chart) — skills gap indicator
const getCertifications = async (req, res) => {
    try {
        const data = await db.Certifications.findAll({
            attributes: ['certificationName', 'issuingBody', [fn('COUNT', col('id')), 'count']],
            group: ['certificationName', 'issuingBody'],
            order: [[literal('count'), 'DESC']],
            limit: 10,
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

// GET /api/analytics/professional-courses
// Top post-grad courses (bar chart) — curriculum gap signal
const getProfessionalCourses = async (req, res) => {
    try {
        const data = await db.ProfessionalCourses.findAll({
            attributes: ['courseName', 'provider', [fn('COUNT', col('id')), 'count']],
            group: ['courseName', 'provider'],
            order: [[literal('count'), 'DESC']],
            limit: 10,
        });
        res.json({success: true, data});
    } catch (err) {
        res.status(500).json({success: false, message: err.message});
    }
};

module.exports = {
    getAlumni,
    getSummary,
    getProgrammes,
    getGraduationTrend,
    getSectors,
    getJobTitles,
    getTopEmployers,
    getCertifications,
    getProfessionalCourses,
};

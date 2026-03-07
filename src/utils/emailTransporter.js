const nodeMailer = require('nodemailer');
const logger = require('./logger');
const logVar = 'Utils | emailTransporter | ';
const constants = require('./constants');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.EMAIL_USER,
        pass: constants.EMAIL_PASSWORD
    }
});

transporter.verify((error) => {
    if (error) {
        logger.error(logVar + 'Error setting up email transporter: ' + error.message);
    } else {
        logger.info(logVar + 'Email transporter is ready to send messages');
    }
})

module.exports = transporter;

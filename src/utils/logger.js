const timestamp = () => new Date().toISOString();

const logger = {
    info: (...args) => console.info(`[INFO] | ${timestamp()} | `, ...args),
    warn: (...args) => console.warn(`[WARN] | ${timestamp()} | `, ...args),
    error: (...args) => console.error(`[ERROR] | ${timestamp()} | `, ...args),
    debug: (...args) => console.debug(`[DEBUG] | ${timestamp()} | `, ...args),
};

module.exports = logger;

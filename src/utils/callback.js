module.exports = function makeExpressCallback(controller) {
    return async (req, res, next) => {
        try {
            const httpRequest = {
                body: req.body,
                query: req.query,
                params: req.params,
                ip: req.ip,
                method: req.method,
                file: req.file || req.files || null,
                path: req.path,
                cookies: req.cookies,
                headers: {
                    'Content-Type': req.get('Content-Type'),
                    Referer: req.get('Referer'),
                    'User-Agent': req.get('User-Agent'),
                    Authorization: req.get('Authorization'),
                },
            };

            const httpResponse = await controller(httpRequest);

            if (httpResponse.headers) {
                res.set(httpResponse.headers);
            }

            if (httpResponse.type === 'binary') {
                return res.status(httpResponse.statusCode).send(httpResponse.body);
            }

            if (httpResponse.type === 'redirect') {
                return res.redirect(httpResponse.statusCode || 302, httpResponse.body);
            }

            if (httpResponse.type === 'html') {
                return res.status(httpResponse.statusCode).render(httpResponse.viewName, httpResponse.body);
            }

            if (httpResponse.cookies) {
                Object.entries(httpResponse.cookies).forEach(([name, { value, options }]) => {
                    res.cookie(name, value, options);
                });
            }

            if (httpResponse.clearCookies) {
                httpResponse.clearCookies.forEach(name => res.clearCookie(name));
            }

            return res
                .status(httpResponse.statusCode || 200)
                .json(httpResponse.body);

        } catch (err) {
            console.error('Controller error:', err);
            return res.status(err.statusCode || 500).json({
                error: err.message || 'An unknown error occurred',
            });
        }
    };
};

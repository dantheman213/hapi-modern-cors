const defaultCorsHeaders = [{
    key: 'Access-Control-Allow-Methods',
    value: 'GET,POST,PUT,DELETE',
}, {
    key: 'Access-Control-Allow-Headers',
    value: 'Accept, Authorization, Content-Type, If-None-Match, X-Requested-With',
}, {
    key: 'Access-Control-Max-Age',
    value: 1728000,
}];

function init(server) {
    // setup the CORS pre-flight request paths on all available endpoints

    const routes = server.table().map(item => item.path);
    // if there is a GET and POST, etc then remove dupes at same path.
    const dedupeRoutes = [...(new Set(routes))];

    for (const route of dedupeRoutes) {
        server.route({
            method: 'OPTIONS',
            path: route,
            config: {
                cors: {
                    maxAge: 1728000,
                    headers: ['Origin', 'Accept', 'X-Requested-With', 'Content-Type'],
                    credentials: false,
                    origin: ['*'],
                },
                handler() {
                    return {
                        cors: 'true',
                    };
                },
            },
        });
    }
}

const cors = {
    name: 'cors',
    version: '1.0.3',
    async register(server) {
        init(server);

        server.ext('onPreResponse', async (request, h) => {
            let origin = '*';
            let allowCreds = false;

            if (request.headers.origin) {
                // CORS spec requires 'Allow-Credentials' header can't be set
                // to 'true' when using '*" in 'Allow-Origin' for security purposes.
                origin = request.headers.origin; // eslint-disable-line prefer-destructuring
                allowCreds = true;
            }

            // boom requests handles response obj differently
            const response = request.response.isBoom ? request.response.output : request.response;

            response.headers['Access-Control-Allow-Origin'] = origin;
            response.headers['Access-Control-Allow-Credentials'] = allowCreds;
            for (const defaultHeader of defaultCorsHeaders) {
                response.headers[defaultHeader.key] = defaultHeader.value;
            }

            return h.continue;
        });
    },
};

module.exports = cors;

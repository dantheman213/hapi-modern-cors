let customOptions;

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
                    maxAge: customOptions.maxAge || 1728000,
                    headers: ['Origin', 'Accept', 'X-Requested-With', 'Content-Type'],
                    credentials: customOptions.allowCreds || false,
                    origin: [customOptions.overrideOrigin || '*'],
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

function setConfig(o) {
    customOptions = {};

    if (o) {
        if (o.allowCreds) {
            customOptions.allowCreds = o.allowCreds;
        }

        if (o.allowMethods) {
            customOptions.allowMethods = o.allowMethods;
        }

        if (o.allowHeaders) {
            customOptions.allowHeaders = o.allowHeaders;
        }

        if (o.allowOriginResponse) {
            customOptions.allowOriginResponse = o.allowOriginResponse;
        }

        if (o.overrideOrigin) {
            customOptions.overrideOrigin = o.overrideOrigin;
        }

        if (o.maxAge) {
            customOptions.maxAge = o.maxAge;
        }
    }
}

async function appendHeaders(request, h) {
    let origin = '*';
    let allowCreds = false;

    if (customOptions.overrideOrigin || (request.headers.origin && customOptions.allowOriginResponse)) {
        if (customOptions.overrideOrigin) {
            origin = customOptions.overrideOrigin;
        } else if(request.headers.origin && customOptions.allowOriginResponse) {
            origin = request.headers.origin;
        }

        allowCreds = customOptions.allowCreds || true;

        // CORS spec requires 'Allow-Credentials' header can't be set
        // to 'true' when using '*" in 'Allow-Origin' for security purposes.
        if (origin === '*' && allowCreds)
            allowCreds = false;
    }

    // boom requests handles response obj differently
    const response = request.response.isBoom ? request.response.output : request.response;

    response.headers['Access-Control-Allow-Origin'] = origin;
    response.headers['Access-Control-Allow-Credentials'] = allowCreds;
    response.headers['Access-Control-Allow-Methods'] = customOptions.allowMethods || 'GET,POST,PUT,DELETE';
    response.headers['Access-Control-Allow-Headers'] = customOptions.allowHeaders || 'Accept, Authorization, Content-Type, If-None-Match, X-Requested-With';
    response.headers['Access-Control-Max-Age'] = customOptions.maxAge || 1728000;

    return h.continue;
}

const cors = {
    name: 'cors',
    version: '1.1.0',
    async register(server, options) {
        setConfig(options);
        init(server);
        server.ext('onPreResponse', appendHeaders);
    },
};

module.exports = cors;

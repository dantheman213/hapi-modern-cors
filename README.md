# hapi-modern-cors

Dead simple CORS responses for hapi.

https://www.npmjs.com/package/hapi-modern-cors

### Description

This plugin adds cors support for your [hapi](https://github.com/hapijs/hapi) project. There was a major refactor of the hapi project in v17+ that
broke previously working paradigms. This plugin supports the very latest versions of hapi.

### Requirements

* NodeJS v6.4.0 or higher (ES6 support)

### How does it work?

This plugin, by default, will append open and permissive CORS headers on all of your existing endpoints and responses.
Additionally, `OPTIONS` will be enabled on all of your existing routes in order to ensure CORS pre-flight works.

### Installation

    npm install hapi-modern-cors --save

### Usage

Add `cors` reference and add the register plugin code to your hapi initialization:

    // ...
    const cors = require('hapi-modern-cors');
    // ...

    // sample startup method
    const server = Hapi.server(...);

    // routes and config should go here BEFORE calling the plugin
    // and finally...
    
    // ...

    // register plugin code here
    await server.register({
        plugin: cors,
        options: {}, // Can leave empty. To customize, see `Custom Options` below
    });

    await server.start();

### Default headers for responses

`Access-Control-Allow-Origin` : `*`

`Access-Control-Allow-Credentials` : `false`

`Access-Control-Allow-Methods` : `GET,POST,PUT,DELETE`

`Access-Control-Allow-Headers` : `Accept, Authorization, Content-Type, If-None-Match, X-Requested-With`

`Access-Control-Max-Age` : `1728000`

### Custom Options

All fields are optional and don't need to be included if you're not customizing that value. If a value is not present
then the corresponding default value is used.

###### Sample:

    {
        allowCreds: <boolean>,
        allowMethods: "<string>",
        allowHeaders: "<string>",
        allowOriginResponse: <boolean>,
        overrideOrigin: "<string>",
        maxAge: <int>,
    }

###### Full Example:

    await server.register({
        plugin: cors,
        options: {
            maxAge: 500,
            allowCreds: false,
            allowOriginResponse: false
        },
    });

##### allowCreds

Allow credentials to be passed?

###### Example:

    true

##### allowMethods

What methods do you want to allow?

###### Example:

    'GET,POST'

##### allowHeaders

What headers do you want to allow in your CORS responses?

###### Example:

    'Accept, Content-Type'

##### allowOriginResponse

If a request has an `origin` attached to it should your response attach it as the allowed `origin`?

###### Example:

    false

By default, if a request has an `origin` attached, it will be passed back as the allowed `origin` in the response and
credentials will be allowed.

##### overrideOrigin

Do you want to set an explicit origin, always?

    'https://google.com'

##### maxAge

How long should these CORS headers be cached?

###### Example:

    600

### FAQs

##### Is Boom supported?

[Boom](https://github.com/hapijs/boom) is fully supported.

##### How do CORS pre-flight work?

Before requests can begin to use CORS a pre-flight request is typically sent to the server at the same path you're 
requesting. However, the request will use `OPTIONS` rather than `GET`, `POST`, etc. The response to this request should
contain some default CORS headers. This plugin will automatically create all `OPTIONS` routes to enable pre-flight
requests to all your existing endpoints.

##### What happens when the origin is set?

When `origin` is set in the request header then the response will set the origin from `*` to that origin and
`Allow-Credentials` will be set from `false` to `true`. For security reasons, `Allow-Credentials` cannot be set to
`true` when `*` is used for `origin`.

### Contribute

The easiest way you can contribute is to report problems, bugs, or issues when you see them. Please use tags when you
create your issues in Github. Pull requests are welcome.

### License

Licensed under the GNU GENERAL PUBLIC LICENSE (Version 3, 29th June 2007)

https://www.gnu.org/licenses/gpl-3.0.en.html

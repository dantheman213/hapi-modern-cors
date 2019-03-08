# hapi-modern-cors

Dead simple CORS responses for hapi.

https://www.npmjs.com/package/hapi-modern-cors

### Description

This plugin adds cors support for your hapi project. There was a major refactor of the hapi project in v17+ that
broke previously working paradigms. This plugin supports the very latest versions of hapi.

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
        options: {},
    });

    await server.start();

### Default headers for responses

`Access-Control-Allow-Origin` : `*`

`Access-Control-Allow-Credentials` : `false`

`Access-Control-Allow-Methods` : `GET,POST,PUT,DELETE`

`Access-Control-Allow-Headers` : `Accept, Authorization, Content-Type, If-None-Match, X-Requested-With`

`Access-Control-Max-Age` : `1728000`

### FAQs

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

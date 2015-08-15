
var request = require('request');
var assert = require('assert');


/**
 * Vulcan
 *
 * @class
 */
function Vulcan(apiUrl) {

    this.request = request.defaults({
        baseUrl: apiUrl,
        json: true
    });
}

/**
 * Add a host to the proxy
 *
 * @param {Object}   options
 * @param {String}   options.hostname Hostname to add
 * @param {Function} cb
 */
Vulcan.prototype.addHost = function(options, cb) {

    if (typeof(options) == 'string') {

        options = {
            hostname: options
        };
    }

    if (!options.settings) {

        options.settings = {};
    }

    var options = {
        url: '/v2/hosts',
        method: 'post',
        body: {
            Host: {
                Name: options.hostname,
                Settings: options.settings
            }
        }
    };

    this.request(options, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Remove a host from the proxy
 *
 * @param {Object}   options
 * @param {String}   options.hostname Hostname to add
 * @param {Function} cb
 */
Vulcan.prototype.removeHost = function(options, cb) {

    var options = {
        url: '/v2/hosts/' + options.hostname,
        method: 'delete'
    };

    this.request(options, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Add a backend to the proxy
 *
 * @param {Object}   options
 * @param {String}   options.name Name of the backend to add
 * @param {String}   options.type http or tcp
 * @param {Function} cb
 */
Vulcan.prototype.addBackend = function(options, cb) {

    if (typeof(options) == 'string') {

        options = {
            name: options
        };
    }

    if (!options.type) {

        options.type = 'http';
    }

    if (!options.settings) {

        options.settings = {};
    }

    var payload = {
        url: '/v2/backends',
        method: 'post',
        body: {
            Backend: {
                Id: options.name,
                Type: options.type,
                Settings: options.settings
            }
        }
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Remove a backend from the proxy
 *
 * @param {Object}   options
 * @param {String}   options.name Name of the backend to remove
 * @param {Function} cb
 */
Vulcan.prototype.removeBackend = function(options, cb) {

    if (typeof(options) == 'string') {

        options = {
            name: options
        };
    }

    var payload = {
        url: '/v2/backends/' + options.name,
        method: 'delete'
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Add a frontend to the proxy
 *
 * @param {Object}   options
 * @param {String}   options.name Name of the frontend to add
 * @param {String}   options.hostname Hostname of the frontend to add
 * @param {String}   options.type http or tcp
 * @param {String}   options.route Vulcand routing matcher
 * @param {Function} cb
 */
Vulcan.prototype.addFrontend = function(options, cb) {

    if (!options.route) {

        options.route = 'PathRegexp(\'/.*\')';
    }

    if (!options.type) {

        options.type = 'http';
    }

    if (!options.settings) {

        options.settings = {};
    }

    if (!options.settings.hostname) {

        options.settings.Hostname = options.hostname;
    }

    var payload = {
        url: '/v1/hosts/' + options.hostname + '/frontends',
        method: 'POST',
        body: {
            Frontend: {
                Id: options.name,
                Route: options.route,
                BackendId: options.backend,
                Type: options.type,
                Settings: options.settings
            }
        }
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Remove a frontend from the proxy
 *
 * @param {Object}   options
 * @param {String}   options.name Name of the frontend to remove
 * @param {Function} cb
 */
Vulcan.prototype.removeFrontend = function(options, cb) {

    if (typeof(options) == 'string') {

        options = {
            name: options
        };
    }

    var payload = {
        url: '/v2/frontends/' + options.name,
        method: 'DELETE'
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Add a server to the proxy
 *
 * @param  {Object}   options
 * @param  {String}   options.name     Name of the server to add
 * @param  {String}   options.url      Url of the server to add (Must be routable from vulcand host machine)
 * @param  {String}   options.backend  Backend to add this server to
 * @param  {Function} cb
 */
Vulcan.prototype.addServer = function(options, cb) {

    var payload = {
        url: '/v1/upstreams/' + options.backend + '/endpoints',
        method: 'POST',
        body: {
            Server: {
                Id: options.name,
                Url: options.url
            }
        }
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

/**
 * Remove a server from the proxy
 *
 * @param  {Object}   options
 * @param  {String}   options.name     Name of the server to remove
 * @param  {String}   options.backend  Backend to remove this server from
 * @param  {Function} cb
 */
Vulcan.prototype.removeServer = function(options, cb) {

    var payload = {
        url: '/v2/backends/' + options.backend + '/servers/' + options.name,
        method: 'DELETE'
    };

    this.request(payload, function(err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

module.exports = Vulcan;

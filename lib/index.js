
var request = require('request');
var assert = require('assert');

function Vulcan(apiUrl) {

    this.request = request.defaults({
        baseUrl: apiUrl,
        json: true
    });
}

Vulcan.prototype.addHost = function (options, cb) {

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
        body: {
            Host: {
                Name: options.hostname,
                Settings: options.settings
            }
        }
    };

    this.request.post(options, function (err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

Vulcan.prototype.addBackend = function (options, cb) {

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
        body: {
            Backend: {
                Id: options.name,
                Type: options.type,
                Settings: options.settings
            }
        }
    };

    this.request.post(payload, function (err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
}

Vulcan.prototype.addFrontend = function (options, cb) {

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

    this.request.post(payload, function (err, response, body) {

        if (err) {

            return cb(err);
        }

        return cb(null, response, body);
    });
};

module.exports = Vulcan;

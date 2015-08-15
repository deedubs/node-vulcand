
var expect = require('chai').expect;
var nock = require('nock');
var Vulcand = require('..');

describe('Vulcand', function () {
    var vulcand;

    before(function () {

        vulcand = new Vulcand('http://127.0.0.1:1234');
    });

    it('should be able to add a new host', function (done) {

        nock('http://127.0.0.1:1234')
            .post('/v2/hosts',{
                Host: {
                    Name: 'deedubs.com',
                    Settings: {}
                }
            })
            .reply(201, {
                "Name": "deedubs.com"
            });

            vulcand.addHost('deedubs.com', function (err, response, body) {

                expect(err).to.eql(null);

                expect(body.Name).to.eql('deedubs.com');

                done();
            });
    });

    it('should be able to add a new backend', function (done) {

        nock('http://127.0.0.1:1234')
            .post('/v2/backends',{
                Backend: {
                    Id: 'deedubs.com',
                    Type: 'http',
                    Settings: {}
                }
            })
            .reply(201, {
                "Id": "deedubs.com",
                "Type": "http"
            });

        vulcand.addBackend('deedubs.com', function (err, response, body) {

            expect(err).to.eql(null);

            expect(body.Id).to.eql('deedubs.com');

            done();
        });
    })

    it('should be able to add a new frontend', function (done) {

        nock('http://127.0.0.1:1234')
            .post('/v1/hosts/deedubs.com/frontends',{
                Frontend: {
                    Id: 'deedubs.com-widgets',
                    Route: 'PathRegexp(\'/widgets.*\')',
                    Type: 'http',
                    BackendId: 'deedubs.com',
                    Settings: {
                        Hostname: 'deedubs.com'
                    }
                }
            })
            .reply(201, {
                "Id": "deedubs.com",
                "Type": "http"
            });

        var payload = {
            name: 'deedubs.com-widgets',
            hostname: 'deedubs.com',
            backend: 'deedubs.com',
            route: 'PathRegexp(\'/widgets.*\')'
        }

        vulcand.addFrontend(payload, function (err, response, body) {

            expect(err).to.eql(null);

            expect(body.Id).to.eql('deedubs.com');

            done();
        });
    });

    it('should be able to add a new server', function (done) {

        nock('http://127.0.0.1:1234')
            .post('/v1/upstreams/deedubs.com/endpoints',{
                Server: {
                    Id: 'deedubs.com@galvatron',
                    Url: 'http://deedubs.internal:9000'
                }
            })
            .reply(201, {
                "Id": 'deedubs.com@galvatron',
                "Url": 'http://deedubs.internal:9000'
            });

        var payload = {
            name: 'deedubs.com@galvatron',
            url: 'http://deedubs.internal:9000',
            backend: 'deedubs.com'
        }

        vulcand.addServer(payload, function (err, response, body) {

            expect(err).to.eql(null);

            expect(body.Id).to.eql('deedubs.com@galvatron');

            done();
        });
    });

    it('should be able to remove a host', function (done) {

        nock('http://127.0.0.1:1234')
            .delete('/v2/hosts/deedubs.com')
            .reply(200);

        var payload = {
            hostname: 'deedubs.com'
        }

        vulcand.removeHost(payload, function (err, response, body) {

            expect(err).to.eql(null);

            done();
        });
    });

    it('should be able to remove a backend', function(done) {

        nock('http://127.0.0.1:1234')
            .delete('/v2/backends/deedubs.com')
            .reply(200);

        var payload = {
            name: 'deedubs.com'
        }

        vulcand.removeBackend(payload, function (err, response, body) {

            expect(err).to.eql(null);

            done();
        });
    });

    it('should be able to remove a frontend', function(done) {

        nock('http://127.0.0.1:1234')
            .delete('/v2/frontends/deedubs.com')
            .reply(200);

        var payload = {
            name: 'deedubs.com'
        }

        vulcand.removeFrontend(payload, function (err, response, body) {

            expect(err).to.eql(null);

            done();
        });
    });

    it('should be able to remove a server', function(done) {

        nock('http://127.0.0.1:1234')
            .delete('/v2/backends/deedubs.com/servers/deedubs.com@galvatron')
            .reply(200);

        var payload = {
            name: 'deedubs.com@galvatron',
            backend: 'deedubs.com'
        }

        vulcand.removeServer(payload, function (err, response, body) {

            expect(err).to.eql(null);

            done();
        });
    });
});

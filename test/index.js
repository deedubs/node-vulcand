
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

    it('should be able to add a new server');

    it('should be able to remove a server');
});

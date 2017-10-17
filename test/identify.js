const expect = require('chai').expect;
const acrcloud = require('../src/index.js');

describe('Create a new ACRCloud instance', () => {
    it('Imports module with no settings', () => {
        const acr = new acrcloud({});
        expect(acr.host).to.equal(undefined);
    });
    it('Sets host to acr host', () => {
        const host = 'identify-us-west-2.acrcloud.com';
        const acr = new acrcloud({host});
        expect(acr.host).to.equal(host);
    });
    it('Sets access key', () => {
        const access_key = 'ABC-123';
        const acr = new acrcloud({access_key});
        expect(acr.access_key).to.equal(access_key);
    });
    it('Sets access secret', () => {
        const access_secret = 'ABC-123';
        const acr = new acrcloud({access_secret});
        expect(acr.access_secret).to.equal(access_secret);
    });
    it('Fails on invalid host', () => {
        const acr = new acrcloud({
            host: 'localhost',
            access_key: '',
            access_secret: ''
        });

        acr.identify().then(response => console.log(response))
            .catch(error => {
                expect(error.success);
            });
    });
});

describe('Connect to acr-cloud API', () => {
    it('Returns a 3001 status code with improper settings', () => {
        const acr = new acrcloud({});

        acr.identify().then(response => {
            console.log(response)
            expect(response.status.code).to.equal(3001);
        }).catch(() => {});
    });
});
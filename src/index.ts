const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

interface acr {
    host: string;
    access_key: string;
    access_secret: string;
    data_type: string;
    audio_format: string;
    sample_rate: string;
    audio_channels: string;
}
class acr {
    host: string;
    access_key: string;
    access_secret: string;
    data_type: string;
    audio_format: string;
    sample_rate: string;
    audio_channels: string;
    endpoint: string = '/v1/identify';
    signature_version: string = '1';

    constructor(config: acr) {
        const {
            host,
            access_key,
            access_secret,
            data_type,
            audio_format,
            sample_rate,
            audio_channels
        } = config;
        this.host = host || 'identify-us-west-2.acrcloud.com';
        this.access_key = access_key;
        this.access_secret = access_secret;
        this.data_type = data_type || 'audio';

        // Optional settings
        this.audio_format = audio_format || '';
        this.sample_rate = sample_rate || '';
        this.audio_channels = audio_channels || '';
    }

    //  Builds a signature string for making API requests
    buildStringToSign(method: string, uri: string, accessKey: string, dataType: string, signatureVersion: string, timestamp: number) {
        return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
    }

    //  Signs a signature string
    sign(string: string, access_secret: string): string {
        return crypto.createHmac('sha1', access_secret)
            .update(Buffer.from(string, 'utf-8'))
            .digest().toString('base64');
    }

    //  Generates form data from an object
    generateFormData(object) {
        const form = new FormData();
        Object.keys(object).forEach(key => {
            form.append(key, object[key]);
        });
        return form;
    }

    /**
     * Identify an audio track from a file path
     * @param {Buffer} audio_sample a buffer from an audio sample of the audio you want to identify
     * @returns {Promise<object>} response JSON from ACRCloud https://www.acrcloud.com/docs/acrcloud/metadata/music/
     */
    identify(audio_sample) {
        const current_date = new Date();
        const timestamp = current_date.getTime() / 1000;

        const stringToSign = this.buildStringToSign(
            'POST',
            this.endpoint,
            this.access_key,
            this.data_type,
            this.signature_version,
            timestamp
        );

        const signature = this.sign(stringToSign, this.access_secret);
        const sample = Buffer.from(audio_sample);

        const formData = {
            sample,
            access_key: this.access_key,
            data_type: this.data_type,
            signature_version: this.signature_version,
            signature,
            sample_bytes: sample.length,
            timestamp
        };

        return fetch(`https://${this.host}/${this.endpoint}`, {
            method: 'POST', 
            body: this.generateFormData(formData)
        }).then(response => response.json());
    }
}

module.exports = acr;
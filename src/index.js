const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

class acr {
    constructor(props) {
        const {
            host,
            access_key,
            access_secret,
            data_type,
            audio_format,
            sample_rate,
            audio_channels
        } = props;
        this.host = host;
        this.access_key = access_key;
        this.access_secret = access_secret;
        this.endpoint = '/v1/identify';
        this.signature_version = '1';
        this.data_type = data_type || 'audio';

        // Optional settings
        this.audio_format = audio_format || '';
        this.sample_rate = sample_rate || '';
        this.audio_channels = audio_channels || '';
    }

    //  Builds a signature string for making API requests
    buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
        return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n')
    }

    //  Signs a signature string
    sign(string) {
        return crypto.createHmac('sha1', this.access_secret)
            .update(new Buffer(string, 'utf-8'))
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

    // Identification
    identify(filePath) {
        return new Promise((resolve, reject) => {
            try {
                const current_date = new Date();
                const timestamp = current_date.getTime()/1000;
    
                const stringToSign = this.buildStringToSign(
                    'POST',
                    this.endpoint,
                    this.access_key,
                    this.data_type,
                    this.signature_version,
                    timestamp
                );
    
                const signature = this.sign(stringToSign, this.access_secret);
                const sample = new Buffer(filePath);
    
                const formData = {
                    sample,
                    access_key: this.access_key,
                    data_type: this.data_type,
                    signature_version: this.signature_version,
                    signature,
                    sample_bytes: sample.length,
                    timestamp
                };

                const body = this.generateFormData(formData);
                fetch(`https://${this.host}/${this.endpoint}`, {method: 'POST', body})
                    .then(response => response.json())
                    .then(json => resolve(json))
                    .catch(error => reject({
                        success: false,
                        error
                    }));
            }
            catch(error) {
                reject(error);
            }
        });
    }
}

module.exports = acr;
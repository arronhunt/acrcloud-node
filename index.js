var crypto = require('crypto');
var request = require('request')
var fs = require('fs');

function acr(props) {
    this.defaultOptions = {
        host: props.host,
        endpoint: '/v1/identify',
        signature_version: '1',
        data_type: props.data_type || 'audio',
        access_key: props.access_key,
        access_secret: props.access_secret,
        audio_format: props.audio_format || '',
        sample_rate: props.sample_rate || '',
        audio_channels: props.audio_channels || ''
    };
}

acr.prototype.buildStringToSign = function(method, uri, accessKey, dataType, signatureVersion, timestamp) {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}
acr.prototype.sign = function(signString, accessSecret) {
    return crypto.createHmac('sha1', accessSecret)
        .update(new Buffer(signString, 'utf-8'))
        .digest().toString('base64');
}

acr.prototype.identify = function(path, callback) {
    var current_date = new Date();
    var timestamp = current_date.getTime()/1000;

    var stringToSign = this.buildStringToSign('POST',
        this.defaultOptions.endpoint,
        this.defaultOptions.access_key,
        this.defaultOptions.data_type,
        this.defaultOptions.signature_version,
        timestamp);

    var signature = this.sign(stringToSign, this.defaultOptions.access_secret);

    var sampleData = new Buffer(fs.readFileSync(path));

    var formData = {
        sample: sampleData,
        access_key:this.defaultOptions.access_key,
        data_type:this.defaultOptions.data_type,
        signature_version:this.defaultOptions.signature_version,
        signature:signature,
        sample_bytes:sampleData.length,
        timestamp:timestamp,
    }

    console.log("Posting track to "+this.defaultOptions.host)

    request.post({
        url: "http://"+this.defaultOptions.host + this.defaultOptions.endpoint,
        method: 'POST',
        formData: formData
    }, callback);
}

module.exports = acr

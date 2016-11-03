# ACRCloud API npm module

## How to use
Before you can begin identifying audio with ACRCloud's API, you need to sign up for a free trial over at https://www.acrcloud.com and create an Audio & Video recognition project. This will generate a `host`, `access_key`, and `access_secret` for you to use.

### Set up
To create a new instance of ACRCloud, all you need to do is install the module and require it in the head of your project.

```
var acrcloud = require('acrcloud')

var acr = new acrcloud({
    host: 'us-west-2.api.acrcloud.com',
    access_key: '*****',
    access_secret: '*****'
})
```
### Usage
To identify an audio file, use the `identify()` function and pass it a file name from a local directory.
```
let path = "/path-to-file.wav"

acr.identify(path, function (err, metadata) {
    if (err) console.log(err)
    console.log(metadata)
})
```
NOTE: At the time of writing, this function only returns the response body. You will need to write your own error handling and JSON parsing until this is included with the package.

### Audio file vs Audio fingerprint
The ACRCloud API accepts either a raw audio file (WAV, MP3, AIFC, etc), or an audio fingerprint as the POST body. *At the time of writing, this module is only set up to accept a raw audio file.* Finterprints will be included in a future update, or you can modify the script yourself to accept them.

### Optional parameters
By default, creating a new instance will assume that your audio file has all the necessary headers in order to successfully parse and identify the file. There are additional optional parameters you can use when creating the acr instance.

* `audio_format` The format of your audio data, like "mp3, wav, ma4, pcm, amr" etc, If your audio file does not have audio header, this parameter should be included
* `sample_rate` If your audio file does not have audio header, this parameter should be included
* `audio_channels` If your audio file does not have audio header, this parameter should be included. Allowed values: 1, 2

```
var acr = new acrcloud({
    host: 'us-west-2.api.acrcloud.com',
    access_key: '*****',
    access_secret: '*****',
    audio_format: 'wav',
    sample_rate: 44100,
    audio_channels: 2
})
```

## TODO

- ☐ Accept audio fingerprints in addition to audio files
- ☐ All around error handling

## Changelog:

### 1.0.0
```
Initial commit
```

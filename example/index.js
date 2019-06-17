const ACRCloud = require('../src');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const acr = new ACRCloud({
    host: 'identify-us-west-2.acrcloud.com',
    access_key: '9624db86f5f98fd102bf901387891b1f',
    access_secret: 'svC40GDVeVO63oUMIxQBq4YhKPqbdqxirXI35kaO',
});

const filePath = path.join(__dirname, '/sample.m4a');
const sample = fs.readFileSync(filePath);

acr.identify(sample)
    .then(response => console.log(JSON.stringify(response, 3, ' ')))
    .catch(error => console.error(error));
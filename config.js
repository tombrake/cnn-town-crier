/*
 * Copyright 2016 Turner Broadcasting System, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


const nconf = require('nconf'),
    pkg = require('./package.json');

let config;



// whitelist environment variables
nconf.env([
    'CLOUDAMQP_AUTH',
    'CONTENT_TYPES',
    'DATA_SOURCES',
    'ENVIRONMENT',
    'MONGODB_AUTH',
    'PORT',
    'QUERY_LIMIT'
]);


// These are required to be set to start up
if (!nconf.get('ENVIRONMENT') || !nconf.get('PORT') || !nconf.get('CLOUDAMQP_AUTH') || !nconf.get('MONGODB_AUTH')) {
    console.error('ENVIRONMENT, PORT, MONGODB_AUTH, and/or CLOUDAMQP_AUTH are not set');
    process.exit(1);
}



config = {
    default: {
        cloudamqpConnectionString: `amqp://${nconf.get('CLOUDAMQP_AUTH')}@red-rhino.rmq.cloudamqp.com/cnn-towncrier`,
        contentTypes: (nconf.get('CONTENT_TYPES')) ? JSON.parse(nconf.get('CONTENT_TYPES')) : ['article', 'blogpost', 'gallery', 'image', 'video'],
        dataSources: (nconf.get('DATA_SOURCES')) ? JSON.parse(nconf.get('DATA_SOURCES')) : ['api.greatbigstory.com', 'cnn', 'cnnespanol.cnn.com', 'money'],
        mongoConnectionString: `${nconf.get('MONGODB_AUTH')}@ds025782.mlab.com:25782/mss-towncrier-v2-dev`,
        pollingIntervalMS: (nconf.get('POLLING_INTERVAL_MS')) ? parseInt(nconf.get('POLLING_INTERVAL_MS')) : 1000 * 10,
        queryLimit: (nconf.get('QUERY_LIMIT')) ? parseInt(JSON.parse(nconf.get('QUERY_LIMIT'))) : 10
    },
    prod: {}
};



// load the correct config based on environment
switch (nconf.get('ENVIRONMENT').toLowerCase()) {
    case 'prod':
        nconf.defaults(config.prod);
        break;

    default:
        nconf.defaults(config.default);
}



// Load overrides that don't override anything, they fill in the blanks
nconf.overrides(config.default);



module.exports = nconf;

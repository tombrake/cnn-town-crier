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


const nconf = require('nconf');



// whitelist environment variables
nconf.env([
    'CLOUDAMQP_AUTH',
    'ENVIRONMENT',
    'MONGODB_AUTH',
    'PORT',
    'QUERY_CONTENT_TYPES',
    'QUERY_DATA_SOURCES',
    'QUERY_LIMIT'
]);



// These are required to be set to start up
if (!nconf.get('ENVIRONMENT') || !nconf.get('PORT') || !nconf.get('CLOUDAMQP_AUTH') || !nconf.get('MONGODB_AUTH')) {
    console.error('ENVIRONMENT, PORT, MONGODB_AUTH, and/or CLOUDAMQP_AUTH are not set');
    process.exit(1);
}



let config = {
    default: {
        cloudamqpConnectionString: `amqp://${nconf.get('CLOUDAMQP_AUTH')}@red-rhino.rmq.cloudamqp.com/cnn-towncrier`,
        cloudamqpExchangeName: 'cnn-town-crier',
        mongoDatabase: 'ds023064.mlab.com:23064/cnn-town-crier-dev',
        mongoConnectionString: `${nconf.get('MONGODB_AUTH')}@ds023064.mlab.com:23064/cnn-town-crier-dev`,
        pollingIntervalMS: (nconf.get('POLLING_INTERVAL_MS')) ? parseInt(nconf.get('POLLING_INTERVAL_MS')) : 1000 * 10,
        queryContentTypes: (nconf.get('QUERY_CONTENT_TYPES')) ? JSON.parse(nconf.get('QUERY_CONTENT_TYPES')) : ['article', 'blogpost', 'gallery', 'image', 'video'],
        queryDataSources: (nconf.get('QUERY_DATA_SOURCES')) ? JSON.parse(nconf.get('QUERY_DATA_SOURCES')) : ['api.greatbigstory.com', 'cnn', 'cnnespanol.cnn.com', 'money'],
        queryLimit: (nconf.get('QUERY_LIMIT')) ? parseInt(JSON.parse(nconf.get('QUERY_LIMIT'))) : 100
    },
    ref: {
        mongoDatabase: 'ds011429.mlab.com:11429/cnn-town-crier-ref',
        mongoConnectionString: `${nconf.get('MONGODB_AUTH')}@ds011429.mlab.com:11429/cnn-town-crier-ref`,
    },
    prod: {
        mongoDatabase: 'ds023464-a0.mlab.com:23464,ds023464-a1.mlab.com:23464/cnn-town-crier?replicaSet=rs-ds023464',
        mongoConnectionString: `${nconf.get('MONGODB_AUTH')}@ds023464-a0.mlab.com:23464,ds023464-a1.mlab.com:23464/cnn-town-crier?replicaSet=rs-ds023464`
    }
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

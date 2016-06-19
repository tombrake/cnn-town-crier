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

let environment,
    port,
    config;



config = {
    default: {
        name: pkg.name,
        cloudamqpConnectionString: `amqp://${process.env.CLOUDAMQP_AUTH}@red-rhino.rmq.cloudamqp.com/cnn-towncrier`,
        hypatia: {
            host: `http://${process.env.HYPATIA_HOST || 'ref.hypatia.services.dmtio.net'}/`
        }
    },
    prod: {
        hypatia: {
            host: `http://${process.env.HYPATIA_HOST || 'hypatia.api.cnn.com/'}/`
        }
    }
};



// whitelist environment variables
nconf.env([
    'CLOUDAMQP_AUTH',
    'ENVIRONMENT',
    'HYPATIA_HOST',
    'PORT'
]);



// make sure we have an environment set or die
environment = nconf.get('ENVIRONMENT');
port = nconf.get('PORT');

if (typeof environment === 'undefined' || typeof port === 'undefined') {
    console.error(`ENVIRONMENT and/or PORT are not set. Shutting down.  ENVIRONMENT: ${environment} - PORT: ${port}`);
    process.exit(1);
}


// load the correct config based on environment
switch (environment.toLowerCase()) {
    case 'prod':
        nconf.defaults(config.prod);
        break;

    default:
        nconf.defaults(config.default);
}



// Load overrides that don't override anything, they fill in the blanks
nconf.overrides(config.default);



module.exports = nconf;

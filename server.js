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

const hapi = require('cnn-hapi'),
    pkg = require('./package.json');

let server = module.exports = hapi({
    directory: __dirname,
    port: process.env.PORT,
    withSwagger: true,
    withNavigation: false,
    layoutsDir: `${__dirname}/views/`
});



server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.redirect('/documentation');
    }
});


server.route({
    method: 'GET',
    path: '/_healthcheck',
    handler: (request, reply) => {
        reply(pkg);
    },
    config: {
        description: 'Healthcheck',
        notes: 'Get status of the application',
        tags: ['api', 'healthcheck']
    }
});



server.start(() => {
    console.log(`Server running at ${server.info.uri}`);
    console.log(JSON.stringify(process.env));
    require('./.ignore/tasks/start-rabbit-publisher.js');
});

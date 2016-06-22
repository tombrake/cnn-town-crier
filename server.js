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
    Boom = require('boom'),
    Joi = require('joi'),
    debug = require('debug')('mss-towncrier:server'),
    config = require('./config.js'),
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



server.route({
    method: 'POST',
    path: '/api/v1/publishes/add-record',
    handler: (request, reply) => {
        const db = request.server.plugins['hapi-mongodb'].db,
            sourceId = request.payload.sourceId,
            query = {sourceId: sourceId},
            sort = [['url', 1]],
            options = {upsert: true},
            update = {
                $set: {
                    contentType: request.payload.contentType,
                    firstPublishDate: request.payload.firstPublishDate,
                    lastModifiedDate: request.payload.lastModifiedDate,
                    schemaVersion: '2.0.0',
                    sourceId: sourceId,
                    url: request.payload.url
                }
            };

        db.collection('publishes').findAndModify(query, sort, update, options, (error, response) => {
            if (error) {
                return reply(Boom.internal(`MongoDB error: ${error}`));
            }

            reply(response).code(response.ok ? 200 : 500);
        });
    },
    config: {
        description: 'Add/update record in datastore',
        tags: ['api', 'publishes'],
        validate: {
            payload: {
                contentType: Joi.string()
                    .required()
                    .description('The content type')
                    .example('article'),

                firstPublishDate: Joi.string()
                    .required()
                    .description('The first publish date for the content')
                    .example('2016-06-20T21:23:44Z'),

                lastModifiedDate: Joi.string()
                    .required()
                    .description('The last modified date for the content')
                    .example('2016-06-20T21:23:44Z'),

                sourceId: Joi.string()
                    .required()
                    .description('Unique identifier for the content')
                    .example('article_0F464167-5ABB-8925-4BC3-6F289C58A52F'),

                url: Joi.string()
                    .required()
                    .description('Url to the content')
                    .example('http://www.cnn.com/2016/06/17/travel/national-parks-movies-nps-100/index.html')
            }
        }
    }
});



server.register([
    {
        register: require('hapi-mongodb'),
        options: {url: config.get('mongoConnectionString')}
    },
    {
        register: require('good'),
        options: {
            ops: {interval: 1000},
            reporters: {
                console: [
                    {module: 'good-squeeze', name: 'Squeeze', args: [{log: '*', response: '*'}]},
                    {module: 'good-console'},
                    'stdout'
                ]
            }
        }
    }
], (error) => {
    if (error) {
        console.error(error.stack);
        throw error;
    }

    server.start(() => {
        console.log(`Server running at ${server.info.uri}`);
        require('./tasks/start-rabbit-publisher.js');
    });
});

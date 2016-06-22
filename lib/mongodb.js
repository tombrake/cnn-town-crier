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

const mongojs = require('mongojs'),
    debug = require('debug')('mss-towncrier:mongodb'),
    config = require('../config.js'),
    db = mongojs(
        config.get('mongoConnectionString'),
        ['publishes'],
        {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 1000 * 5
            },
            auto_reconnect: true
        }
    );

db.on('error', (error) => {
    console.error(`Mongo error: ${error.stack}`);
});

db.on('connect', () => {
    debug('MongoDB connection established');
});

process.on('SIGINT', () => {
    debug('MongoDB connection terminated');
    db.close();
    process.exit();
});

module.exports = db;

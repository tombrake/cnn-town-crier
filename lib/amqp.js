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

const amqp = require('amqplib'),
    config = require('../config.js'),
    exchangeName = `${config.get('cloudamqpExchangeName')}-${config.get('ENVIRONMENT')}`;

function AmqpClient() {}

AmqpClient.prototype.start = function start() {
    return amqp.connect(config.get('cloudamqpConnectionString'))
        .then((conn) => {
            this.connection = conn;
            return conn.createChannel();
        })
        .then((channel) => {
            this.channel = channel;
            return channel.assertExchange(exchangeName, 'topic', {durable: true});
        });
};

module.exports = new AmqpClient();

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

const amqp = require('amqplib/callback_api'),
    config = require('../config.js'),
    connectionString = config.get('cloudamqpConnectionString');

amqp.connect(connectionString, (error, connection) => {
    connection.createChannel((error, channel) => {
        const exchangeName = `${config.get('cloudamqpExchangeName')}-${config.get('ENVIRONMENT')}`,
            keys = [
                'cnn.article',
                'cnn.video',
                'cnn.gallery',
                'money.article',
                'api-greatbigstory-com.article'
            ];

        channel.assertExchange(exchangeName, 'topic', {durable: true});
        channel.assertQueue(`apple-news-${config.get('ENVIRONMENT')}`, {durable: true}, (error, queueName) => {

            keys.forEach((key) => {
                channel.bindQueue(queueName.queue, exchangeName, key);
            });

            channel.consume(queueName.queue, (message) => {
                console.log(`${message.fields.routingKey}: ${message.content.toString()}`);
                channel.ack(message);
            }, {noAck: false});
        });
    });
});

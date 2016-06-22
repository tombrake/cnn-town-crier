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
    debug = require('debug')('mss-towncrier:start-rabbit-publisher'),
    db = require('../lib/mongodb.js'),
    ContentRetriever = require('cnn-content-retriever'),
    cr = new ContentRetriever(),
    config = require('../config.js');


console.log('Starting Rabbit Publisher');
console.log(`- Polling Interval: ${config.get('pollingIntervalMS')} milliseconds / ${config.get('pollingIntervalMS') / 1000} seconds`);
console.log(`- Query Data Sources: ${JSON.stringify(config.get('dataSources'))}`);
console.log(`- Query Content Types: ${JSON.stringify(config.get('contentTypes'))}`);
console.log(`- Query Limit: ${config.get('queryLimit')}`);


amqp.connect(config.get('cloudamqpConnectionString'), (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }

        const contentTypes = config.get('contentTypes'),
            dataSources = config.get('dataSources'),
            exchangeName = 'town_crier_v2',
            limit = config.get('queryLimit');

        setInterval(() => {
            cr.getRecentPublishes(limit, contentTypes, dataSources).then((response) => {
                response.docs.forEach((doc) => {
                    const amqpMessage = {
                            contentType: doc.type,
                            schemaVersion: '2.0.0',
                            sourceId: doc.sourceId,
                            url: doc.url
                        },
                        mongoRecord = {
                            contentType: doc.type,                       // was objectType
                            firstPublishDate: doc.firstPublishDate,
                            lastModifiedDate: doc.lastModifiedDate,
                            schemaVersion: '2.0.0',                      // was Version
                            sourceId: doc.sourceId,                      // was sourceID
                            url: doc.url
                            // activityIndex: 0,                         // ???
                            // CreatedDateTime: new Date(),              // date mongo record created - can pull this from _id
                            // isActive: true,                           // ???
                            // isLocked: false,                          // ???
                            // isRemoved: false,                         // ???
                            // lastStatus: 'updated'                     // first publish or update
                            // ModifiedDateTime: new Date(),             // date mongo record modified - can pull this from _id
                            // slug: doc.slug,
                        };

                    db.publishes.findAndModify({
                        query: {sourceId: doc.sourceId},
                        update: {$set: mongoRecord},
                        upsert: true
                    }, (error, document, lastErrorObject) => {
                        if (error) {
                            debug(`Error: ${error}`);
                            throw error;
                        }

                        const key = `${doc.dataSource.replace(/\./g, '-')}.${doc.type}`;

                        if (!document || (document && (document.lastModifiedDate !== doc.lastModifiedDate))) {
                            channel.assertExchange(exchangeName, 'topic', {durable: true});
                            channel.publish(exchangeName, key, new Buffer(JSON.stringify(amqpMessage)));
                            console.log(`${(lastErrorObject.updatedExisting) ? 'UPDATED' : 'PUBLISHED'}: ${key}: ${JSON.stringify(amqpMessage)}`);
                        } else {
                            debug(`NOT published ${doc.url} - ${(document) ? document.lastModifiedDate : 'null'} vs. ${doc.lastModifiedDate}`);
                        }
                    });
                });
            });
        }, config.get('pollingIntervalMS'));
    });
});

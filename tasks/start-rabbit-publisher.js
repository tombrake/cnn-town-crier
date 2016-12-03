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
    debug = require('debug')('cnn-town-crier:start-rabbit-publisher'),
    db = require('../lib/mongodb.js'),
    ContentRetriever = require('cnn-content-retriever'),
    cr = new ContentRetriever(),
    config = require('../config.js');


console.log('Starting Rabbit Publisher');
console.log(`- Polling Interval: ${config.get('pollingIntervalMS')} milliseconds / ${config.get('pollingIntervalMS') / 1000} seconds`);
console.log(`- Query Data Sources: ${JSON.stringify(config.get('queryDataSources'))}`);
console.log(`- Query Content Types: ${JSON.stringify(config.get('queryContentTypes'))}`);
console.log(`- Query Limit: ${config.get('queryLimit')}`);


amqp.connect(config.get('cloudamqpConnectionString'), (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }

        setInterval(() => {
            cr.getRecentPublishes(config.get('queryLimit'), config.get('queryContentTypes'), config.get('queryDataSources')).then((response) => {
                response.docs.forEach((doc) => {
                    const amqpMessage = {
                            branding: (doc.attributes) ? doc.attributes.branding : '',
                            contentType: doc.type,
                            schemaVersion: '2.1.0',
                            slug: doc.slug,
                            sourceId: doc.sourceId,
                            url: doc.url
                        },
                        mongoRecord = {
                            branding: (doc.attributes) ? doc.attributes.branding : '',
                            contentType: doc.type,                       // was objectType
                            firstPublishDate: doc.firstPublishDate,
                            lastModifiedDate: doc.lastModifiedDate,
                            schemaVersion: '2.0.0',                      // was Version
                            slug: doc.slug,
                            sourceId: doc.sourceId,                      // was sourceID
                            url: doc.url
                            // activityIndex: 0,                         // ???
                            // CreatedDateTime: new Date(),              // date mongo record created - can pull this from _id
                            // isActive: true,                           // ???
                            // isLocked: false,                          // ???
                            // isRemoved: false,                         // ???
                            // lastStatus: 'updated'                     // first publish or update
                            // ModifiedDateTime: new Date(),             // date mongo record modified - can pull this from _id
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

                        // The key format should be [datasource].[contenttype]
                        // A datasource with a . in it needs to have all the
                        // dots in it converted to dashes.
                        const key = `${doc.dataSource.replace(/\./g, '-')}.${doc.type}`,
                            exchangeName = `${config.get('cloudamqpExchangeName')}-${config.get('ENVIRONMENT')}`;

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

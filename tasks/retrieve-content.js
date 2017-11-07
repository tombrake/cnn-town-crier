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

const amqp = require('../lib/amqp'),
    sns = require('../lib/sns'),
    messenger = require('../lib/messenger'),
    Message = require('cnn-messaging').Message,
    debug = require('debug')('cnn-town-crier:start-rabbit-publisher'),
    moment = require('moment'),
    db = require('../lib/mongodb.js'),
    ContentRetriever = require('cnn-content-retriever'),
    cr = new ContentRetriever(),
    config = require('../config.js'),
    pkg = require('../package');


console.log('Starting Content Retriever');
console.log(`- ENVIRONMENT: ${config.get('ENVIRONMENT')}`);
console.log(`- Datastore: ${config.get('mongoDatabase')}`);
console.log(`- Polling Interval: ${config.get('pollingIntervalMS')} milliseconds / ${config.get('pollingIntervalMS') / 1000} seconds`);
console.log(`- Query Data Sources: ${JSON.stringify(config.get('queryDataSources'))}`);
console.log(`- Query Content Types: ${JSON.stringify(config.get('queryContentTypes'))}`);
console.log(`- Query Limit: ${config.get('queryLimit')}`);

Promise.all([amqp.start(), sns.start(), messenger.start()])
.then(() => {
    setInterval(() => {
        // Defaults:
        // queryLimit: 100
        // queryContentTypes: ['article', 'blogpost', 'gallery', 'image', 'video']
        // queryDataSources: ['api.greatbigstory.com', 'cnn', 'cnnespanol.cnn.com', 'money']
        // query URL: http://hypatia.api.cnn.com/svc/content/v2/search/collection1/type:article;blogpost;gallery;image;video/dataSource:api.greatbigstory.com;cnn;cnnespanol.cnn.com;money/rows:10/sort:lastPublishDate
        // curl: curl -sS 'http://hypatia.api.cnn.com/svc/content/v2/search/collection1/type:article;blogpost;gallery;image;video/dataSource:api.greatbigstory.com;cnn;cnnespanol.cnn.com;money/rows:100/sort:lastPublishDate' | jq .
        // curl -sS 'http://hypatia.api.cnn.com/svc/content/v2/search/collection1/type:article;blogpost;gallery;image;video/dataSource:api.greatbigstory.com;cnn;cnnespanol.cnn.com;money/rows:100/sort:lastPublishDate' | jq '.docs[] | {dataSource, type, url}'
        cr.getRecentPublishes(config.get('queryLimit'), config.get('queryContentTypes'), config.get('queryDataSources')).then((response) => {
            response.docs.forEach((doc) => {
                const record = {
                    branding: (doc.attributes) ? doc.attributes.branding : '',
                    contentType: doc.type,
                    schemaVersion: '2.1.0',
                    slug: doc.slug,
                    sourceId: doc.sourceId,
                    url: doc.url,
                    firstPublishDate: doc.firstPublishDate,
                    lastModifiedDate: doc.lastModifiedDate
                };

                db.publishes.findAndModify({
                    query: {sourceId: doc.sourceId},
                    update: {$set: record},
                    new: false,
                    upsert: true
                }, (error, dbRecord, lastErrorObject) => {
                    if (error) {
                        debug(`Error: ${error}`);
                        throw error;
                    }


                    // The key format should be [datasource].[contenttype]
                    // A datasource with a . in it needs to have all the
                    // dots in it converted to dashes.
                    const key = `${doc.dataSource.replace(/\./g, '-')}.${doc.type}`,
                        exchangeName = `${config.get('cloudamqpExchangeName')}-${config.get('ENVIRONMENT')}`,
                        eventMessage = new Message({
                            context: {
                                systemId: pkg.name,
                                environment: config.get('ENVIRONMENT'),
                                model: doc.type,
                                objectId: doc.sourceId,
                                action: 'update'
                            },
                            event: {
                                source: doc.dataSource,
                                section: doc.section,
                                id: doc.id,
                                branding: doc.branding,
                                record
                            }
                        });

                    if (!dbRecord) {
                        eventMessage.context.action = 'new';
                    }

                    if (!dbRecord || (dbRecord && (moment(dbRecord.lastModifiedDate).isBefore(doc.lastModifiedDate)))) {
                        console.log(`${(dbRecord) ? dbRecord.lastModifiedDate : null} isBefore ${doc.lastModifiedDate}`);
                        const message = JSON.stringify(record);
                        amqp.channel.publish(exchangeName, key, new Buffer(message));
                        sns.publish(key, message);
                        messenger.publish(eventMessage.getTopic(), eventMessage);
                        console.log(`\x1b[32m${(lastErrorObject.updatedExisting) ? 'UPDATED' : 'PUBLISHED'}: ${exchangeName} : ${key}: ${JSON.stringify(record)} - dbRecord: ${JSON.stringify(dbRecord)}\x1b[0m`);
                    } else {
                        console.log(`\x1b[31mNOT published ${doc.url} - ${(dbRecord) ? dbRecord.lastModifiedDate : 'null'} vs. ${doc.lastModifiedDate}\x1b[0m`);
                    }
                });
            });
        });
    }, config.get('pollingIntervalMS'));
})
.catch((err) => {
    console.error(err);
    process.exit(1);
});

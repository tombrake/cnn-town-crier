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
    if (error) {
        throw error;
    }

    connection.createChannel((error, channel) => {
        if (error) {
            throw error;
        }

        // TODO - hypatia query here
        //
        // app_id:
        // type:	com.turner.cnn.article
        // message_id:
        // reply_to:	0c0105f0-34fe-11e6-b396-eb62fea28691.response.queue
        // correlation_id:
        // delivery_mode:	2
        // headers:
        // content_encoding:	utf8
        // content_type:	application/json
        //
        // {
        //     "payload": {
        //         "_id": "5766baeb4dad7b0500761b7a",
        //         "__t": "objectTracker",
        //         "firstPublishDate": "2016-06-19T15:31:46.000Z",
        //         "lastModifiedDate": "2016-06-19T16:06:25.000Z",
        //         "url": "http://www.cnn.com/2016/06/19/politics/uss-monsoor-zumwalt-destroyer-christened/index.html",
        //         "slug": "USS Monsoor Zumwalt destroyer christened",
        //         "activityIndex": 0,
        //         "sourceID": "article_0A66FAD7-5C56-5356-2CC0-68666F4C8CAE",
        //         "objectType": "article",
        //         "Version": 1,
        //         "ModifiedDateTime": "2016-06-19T16:06:45.417Z",
        //         "CreatedDateTime": "2016-06-19T15:31:55.478Z",
        //         "isLocked": false,
        //         "isRemoved": false,
        //         "isActive": true,
        //         "lastStatus": "updated"
        //     }
        // }

        // const exchangeName = 'topic_logs',
        //     args = process.argv.slice(2),
        //     key = (args.length > 0) ? args[0] : 'anonymous.info',
        //     message = args.slice(1).join(' ') || 'Hello World!';
        //
        // channel.assertExchange(exchangeName, 'topic', {durable: false});
        // channel.publish(exchangeName, key, new Buffer(message));
        // console.log(` [x] Sent ${key}: '${message}'`);

        // keys (that we care about)             (that we dont' care about)
        // cnn.article                           cnn.image
        // cnn.gallery                           cnn$.gallery
        // cnn.video                             cnn$.video
        // cnn$.article                          cnn$.image

        const exchangeName = 'town_crier_v2',
            key = 'cnn.article',
            message = {
                firstPublishDate: '2016-06-19T15:31:46.000Z',
                lastModifiedDate: '2016-06-19T16:06:25.000Z',
                url: 'http://www.cnn.com/2016/06/19/politics/uss-monsoor-zumwalt-destroyer-christened/index.html',
                slug: 'USS Monsoor Zumwalt destroyer christened',
                activityIndex: 0,
                sourceID: 'article_0A66FAD7-5C56-5356-2CC0-68666F4C8CAE',
                objectType: 'article',
                Version: 1,
                ModifiedDateTime: '2016-06-19T16:06:45.417Z',
                CreatedDateTime: '2016-06-19T15:31:55.478Z',
                isLocked: false,
                isRemoved: false,
                isActive: true,
                lastStatus: 'updated'
            };

        channel.assertExchange(exchangeName, 'topic', {durable: true});
        channel.publish(exchangeName, key, new Buffer(JSON.stringify(message)));
        console.log(`Sent ${key}: ${message}`);
    });
});




/*
{
    "fields": {
        "consumerTag": "amq.ctag-aEZYL2ZOgwsMgriAd_ukTg",
        "deliveryTag": 1,
        "redelivered": true,
        "exchange": "objectExchange-dev",
        "routingKey": "objectKey"
    },
    "properties": {
        "contentType": "application/json",
        "contentEncoding": "utf8",
        "headers": {},
        "deliveryMode": 2,
        "correlationId": "",
        "replyTo": "0c0105f0-34fe-11e6-b396-eb62fea28691.response.queue",
        "messageId": "",
        "type": "com.turner.cnn.article",
        "appId": ""
    },
    "content": {
        "type": "Buffer",
        "data": []
    },
    "body": {
        "payload": {
            "_id": "5766baeb4dad7b0500761b7a",
            "__t": "objectTracker",
            "firstPublishDate": "2016-06-19T15:31:46.000Z",
            "lastModifiedDate": "2016-06-19T16:06:25.000Z",
            "url": "http://www.cnn.com/2016/06/19/politics/uss-monsoor-zumwalt-destroyer-christened/index.html",
            "slug": "USS Monsoor Zumwalt destroyer christened",
            "activityIndex": 0,
            "sourceID": "article_0A66FAD7-5C56-5356-2CC0-68666F4C8CAE",
            "objectType": "article",
            "Version": 1,
            "ModifiedDateTime": "2016-06-19T16:06:45.417Z",
            "CreatedDateTime": "2016-06-19T15:31:55.478Z",
            "isLocked": false,
            "isRemoved": false,
            "isActive": true,
            "lastStatus": "updated"
        }
    },
    "type": "com.turner.cnn.article"
}
*/

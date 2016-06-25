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

/*
 * The job of the CONSUMER, which is what the app is that processes the queue,
 * is to do the following.  This example is an example of a CONSUMER.
 *
 *     1. Connect to CloudAMQP
 *     2. Create a Channel
 *     3. Assert an Exchange
 *     4. Assert a Queue
 *     5. Bind Routing Keys (Topics) to the Queue
 *     6. Consume the items that are published by the PUBLISHER, Town Crier
 *
 * Whaa??  Why does the CONSUMER need to care about asserting the Exchange?  It
 * only needs to create a Channel, assert a Queue, bind Routing Keys to it, and
 * consume it right?  Yes, that is technically all that it needs to do.  Due to
 * the way AMQP works (and this is going to gloss over the details, so don't get
 * all pedantic on me here) both the PUBLISHER and the CONSUMER will have their
 * own Channel to AMQP but create the same Exchange so it does not matter which
 * one starts first or if either need to be restarted independently. There are
 * other reasons as well, however this is the one we most care about.
 *
 * It is important that the PUBLISHER and the CONSUMER assert the Exchange
 * consistently.  The single source of truth in this case is how Town Crier
 * configures the Exchange.  This can be found at:
 *
 * > https://github.com/cnnlabs/cnn-town-crier/blob/develop/tasks/start-rabbit-publisher.js#L83
 *
 * The following should match:
 *
 *     - The Exchange Name, in this case `cnn-town-crier-$ENVIRONMENT`
 *     - The Exchange Type, in this case `topic`
 *     - The Exchange Options, in this case `{durable: true}`
 *
 * The Queue Name, Queue options, and Routing Keys are up to the CONSUMER to
 * set.  The Queue options are typically `{noAck: true}` or `{noAck: false}`.
 *
 * There is also a specific set of Routing Keys that can be consumed.  The
 * Routing Keys are set by Town Crier configuration.  The defaults can be found
 * here:
 *
 * > https://github.com/cnnlabs/cnn-town-crier/blob/develop/config.js#L51
 *
 * The Routing Key is the combintion of the data sources and the content types
 * in the format of `datasource.contenttype`.  Any dots (.) in the data source
 * are converted to a dash (-).  The current set of Routing Keys set by default
 * is:
 *
 *     - api-greatbigstory-com.article
 *     - api-greatbigstory-com.blogpost
 *     - api-greatbigstory-com.gallery
 *     - api-greatbigstory-com.image
 *     - api-greatbigstory-com.video
 *     - cnn.article
 *     - cnn.blogpost
 *     - cnn.gallery
 *     - cnn.image
 *     - cnn.video
 *     - cnnespanol-cnn-com.article
 *     - cnnespanol-cnn-com.blogpost
 *     - cnnespanol-cnn-com.gallery
 *     - cnnespanol-cnn-com.image
 *     - cnnespanol-cnn-com.video
 *     - money.article
 *     - money.blogpost
 *     - money.gallery
 *     - money.image
 *     - money.video
 *
 * IMPORTANT: Many of these combinations may never have qualifying content.  For
 * example, all Great Big Story content is video, so there will probably never
 * be an api-greatbigstory-com.article, blogpost, gallery, or image.
 *
 * Start this example with:
 *
 *     $ CLOUDAMQP_AUTH=user:pass ENVIRONMENT=ref PORT=5000 node example/ksa-consumer.js
 *
 * It is very possible the `cnn-town-crier-ref` Queue that this will create /
 * connect to will be empty.  This will connect to the REF Town Crier
 * environment, which should always be running.  You may need to wait for
 * someone to publish some content to see it do anything.
 *
 * Alternatively you can run Town Crier locally by starting it up with a custom
 * environment and then run this example with the same custom environment.  This
 * will create a new Exchange and Queue for the custom environment.  You will
 * still need to wait around for a publish to happen, but at least you will know
 * that another consumer is not going to steal your queue items.
 *
 *     $ CLOUDAMQP_AUTH=user:pass MONGODB_AUTH=user:pass ENVIRONMENT=foo PORT=5000 node server.js
 *     $ CLOUDAMQP_AUTH=user:pass ENVIRONMENT=foo PORT=5000 node example/ksa-consumer.js
 *
 * You can see all of the Exchanges and Queues that have been created in the
 * CloudAMPQ UI.
 */

const amqp = require('amqplib/callback_api'),
    config = require('../config.js'),
    connectionString = config.get('cloudamqpConnectionString');

amqp.connect(connectionString, (error, connection) => {
    connection.createChannel((error, channel) => {
        const exchangeName = `${config.get('cloudamqpExchangeName')}-${config.get('ENVIRONMENT')}`,
            routingKeys = [
                'cnn.article',
                'cnn.video',
                'cnn.gallery',
                'money.article',
                'api-greatbigstory-com.article'
            ];

        channel.assertExchange(exchangeName, 'topic', {durable: true});
        channel.assertQueue(`apple-news-${config.get('ENVIRONMENT')}`, {durable: true}, (error, queueName) => {

            routingKeys.forEach((routingKey) => {
                channel.bindQueue(queueName.queue, exchangeName, routingKey);
            });

            channel.consume(queueName.queue, (message) => {
                console.log(`${message.fields.routingKey}: ${message.content.toString()}`);

                // this simulates processing time
                setTimeout(() => {
                    channel.ack(message);
                }, 1000 * 10); // 10 seconds

            }, {noAck: false});
        });
    });
});

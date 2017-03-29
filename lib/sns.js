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

const AWS = require('aws-sdk'),
    config = require('../config.js');

function SnsClient() {
    this.topics = {};
}

SnsClient.prototype.start = function start() {
    if (!config.get('awsKey') || !config.get('awsSecret')) {
        // skip init if no AWS keys
        return Promise.resolve();
    }

    this.sns = new AWS.SNS({region: config.get('awsRegion')});

    const sources = config.get('queryDataSources'),
        types = config.get('queryContentTypes'),
        promises = [];

    sources.forEach((source) => {
        types.forEach((type) => {
            const topicName = `town-crier_${config.get('ENVIRONMENT')}_${source.replace(/\./g, '-')}_${type}`;
            promises.push(this.createTopic(topicName));
        });
    });

    return Promise.all(promises);
};

SnsClient.prototype.createTopic = function createTopic(topicName) {
    return this.sns.createTopic({Name: topicName}, (err, result) => {
        if (err) {
            return Promise.reject(err);
        }
        this.topics[topicName] = result.TopicArn;
        return Promise.resolve();
    });
};

SnsClient.prototype.publish = function publish(topic, message) {
    if (!config.get('awsKey') || !config.get('awsSecret')) {
        // skip publish if no AWS keys
        return Promise.resolve();
    }

    const topicName = `town-crier_${config.get('ENVIRONMENT')}_${topic.replace(/\./g, '_')}`,
        publishParams = {
            TopicArn: this.topics[topicName],
            Message: message
        };
    return this.sns.publish(publishParams, (err) => {
        if (err) {
            return Promise.reject(err);
        }
        return Promise.resolve();
    });
};

module.exports = new SnsClient();

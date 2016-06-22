// /*
//  * Copyright 2016 Turner Broadcasting System, Inc.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// 'use strict';
//
// const mongoose = require('mongoose'),
//     debug = require('debug')('mss-towncrier:mongodb');
//
// mongoose.connect('mongodb://mss-towncrier-v2-dev:hellomss@ds025782.mlab.com:25782/mss-towncrier-v2-dev', {
//     server: {
//         socketOptions: {keepAlive: 1, connectTimeoutMS: 5000},
//         auto_reconnect: true
//     }
// });
//
// mongoose.connection.on('connected', () => {
//     debug('Mongoose connection open');
// });
//
// mongoose.connection.on('error', (error) => {
//     console.error(`Mongoose connection error: ${error}`);
// });
//
// mongoose.connection.on('disconnected', () => {
//     debug('Mongoose default connection disconnected');
// });
//
// process.on('SIGINT', () => {
//     mongoose.connection.close(() => {
//         console.error('Mongoose connection disconnected through app termination');
//         process.exit();
//     });
// });
//
// module.exports = mongoose;

# CNN Town Crier

A service for listening to CNN content publishes from a variety of sources to AMQP and AWS SNS Topics

[![dependency-status](https://gemnasium.com/cnnlabs/cnn-town-crier.svg)](https://gemnasium.com/cnnlabs/cnn-town-crier)
[![build-status-master](https://img.shields.io/travis/cnnlabs/cnn-town-crier/master.svg?style=flat-square&label=master)](https://travis-ci.org/cnnlabs/cnn-town-crier)
[![build-status-develop](https://img.shields.io/travis/cnnlabs/cnn-town-crier/master.svg?style=flat-square&label=develop)](https://travis-ci.org/cnnlabs/cnn-town-crier)



## Requirements

Read these "_requirements_" as "_only tested with_".

- [Node.js](https://nodejs.org/) 6.x+



## How to get it going (AMQP Only)

```shell
$ npm install
$ CLOUDAMQP_AUTH=user:pass MONGODB_AUTH=user:pass npm start
```

## Enabling SNS support

To enable SNS support, you have to provide 3 additional environment variables for AWS.

```shell
$ npm install
$ CLOUDAMQP_AUTH=user:pass MONGODB_AUTH=user:pass AWS_REGION=us-east-1 AWS_KEY=SomeAwsKey AWS_SECRET=SomeSecretKey npm start
```


## How to write an AMQP consumer

Town Crier is a PUBLISHER.  For an app to process the items that have been
published a CONSUMER will need to be implemented.

See the [example/ksa-consumer.js](./example/ksa-consumer.js) for an example on
how to create a consumer that only cares about specific Routing Keys.

There should be no need to configure anything in the CloudAMQP UI.  All
Exchanges, Queues, and Routing Keys should be created dynamically by Town Crier
and the consuming app.

## SNS consumers

SNS subscriptions can be consumed as HTTP, Email, SQS, Lambda, etc. Please see AWS SNS documentation.


## ESDoc Documentation

You can generate and view the docs locally with the commands below.  The `open`
command will only work on macOS.

```shell
$ npm run generate-docs
$ open docs/index.html
```



## NPM scripts

- `generate-authors` - Generates [AUTHORS.md](./AUTHORS.md).
- `generate-changelog` - Generates output to put in [CHANGELOG.md](./CHANGELOG.md).
- `generate-coverage` - Generates a code coverage report in `/coverage`.
- `generate-docs` - Generates ESDoc documentation in `/docs`.
- `start` - Starts it up for local development.
- `test` - Runs all tests.
- `update-apply` - Updates [package.json](./package.json) with dependency updates.
- `update-check` - Outputs if any dependency updates are needed.



## Environment variables

- `CLOUDAMQP_AUTH` - **REQUIRED** - Authentication for connecting to
[  CloudAMQP](https://www.cloudamqp.com).  Format should be `user:pass`.

- `ENVIRONMENT` - **REQUIRED** - The environment to run in.  Use `prod` for
  production.  Any other values will use the `default` config.

- `MONGODB_AUTH` - **REQUIRED** - Authentication for connecting to
  [mLab](https://mlab.com).  Format should be `user:pass`.

- `PORT` - **REQUIRED** - The port the service runs on.

- `DEBUG=cnn-town-crier:*` - Set to enable visible
  [debug](https://www.npmjs.com/package/debug) logging to console.

- `QUERY_CONTENT_TYPES` - The content types to query for.  Defaults to
  `["article", "blogpost", "gallery", "image", "video"]`.  If set, the value
  will be `JSON.parse()`ed, make sure it is valid JSON.

- `QUERY_DATA_SOURCES` - The data sources to query for.  Defaults to
  `["api.greatbigstory.com", "cnn", "cnnespanol.cnn.com", "money"]`. If set, the
  value will be `JSON.parse()`ed, make sure it is valid JSON.

- `QUERY_LIMIT` - The number of items of content to query for over 10 seconds.
  Defaults to 10

- `AWS_REGION` - **OPTIONAL** - If not set, defaults to `us-east-1`

- `AWS_KEY` - **OPTIONAL** - If set, along with `AWS_SECRET`, then AWS SNS support will be enabled

- `AWS_SECRET` - **OPTIONAL** - If set, along with `AWS_KEY`, then AWS SNS support will be enabled.



## Developer notes

- Always develop on the node version specified in the [.nvmrc](./.nvmrc) file.
  If [nvm](https://github.com/creationix/nvm) is used typing `nvm install`
  in the terminal will insure the correct version is used.

- Contributors should be familiar with the [Contributors Guide](https://github.com/cnnlabs/organization-docs/blob/master/CONTRIBUTING.md)

- Collaborators should be familiar with the [Collaborator Guide](https://github.com/cnnlabs/organization-docs/blob/master/COLLABORATOR_GUIDE.md)

- The current Project Owner (PO) of this project is Jamie Young
([@jamsyoung](https://github.com/jamsyoung/)).



## Licensing

See [LICENSE.md](./LICENSE.md) for details.


---
♥︎ Like a lemon to a lime a lime to a lemon - MCA

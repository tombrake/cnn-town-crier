# MSS Town Crier

A service for listening to CNN content publishes from a variety of sources that
populates an AMQP exchange.



## Requirements

Read these "_requirements_" as "_only tested with_".

- [Node.js](https://nodejs.org/) 6.x+



## How to get it going

```shell
$ npm install
$ CLOUDAMQP_AUTH=user:pass MONGODB_AUTH=user:pass npm start
```



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

- `DEBUG=mss-town-crier:*` - Set to enable visible
  [debug](https://www.npmjs.com/package/debug) logging to console.

- `CONTENT_TYPES` - The content types to query for.  Defaults to
  `["article", "blogpost", "gallery", "image", "video"]`.  If set, the value
  will be `JSON.parse()`ed, make sure it is valid JSON.

- `DATA_SOURCES` - The data sources to query for.  Defaults to
  `["api.greatbigstory.com", "cnn", "cnnespanol.cnn.com", "money"]`. If set, the
  value will be `JSON.parse()`ed, make sure it is valid JSON.


- `QUERY_LIMIT` - The number of items of content to query for over 10 seconds.
  Defaults to 10



## Developer notes

- Always develop on the node version specified in the [.nvmrc](./.nvmrc) file.
  If [nvm](https://github.com/creationix/nvm) is used typing `nvm install`
  in the terminal will insure the correct version is used.

- Contributors should read [CONTRIBUTING.md](./CONTRIBUTING.md).

- Collaborators should read [COLLABORATOR_GUIDE.md](./COLLABORATOR_GUIDE.md).

- The current Project Owner (PO) of this project is Jamie Young
([@jamsyoung](https://github.com/jamsyoung/)).



## Licensing

See [LICENSE.md](./LICENSE.md) for details.



♥︎ Like a lemon to a lime a lime to a lemon ♥︎



[![build](https://img.shields.io/travis/cnnlabs/mss-town-crier/master.svg?style=flat-square)](https://travis-ci.org/cnnlabs/mss-town-crier)
![node](https://img.shields.io/node/v/mss-town-crier.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/mss-town-crier.svg?style=flat-square)](https://www.npmjs.com/package/mss-town-crier)
[![npm-downloads](https://img.shields.io/npm/dm/mss-town-crier.svg?style=flat-square)](https://www.npmjs.com/package/mss-town-crier)
[![dependency-status](https://gemnasium.com/cnnlabs/mss-town-crier.svg)](https://gemnasium.com/cnnlabs/mss-town-crier)

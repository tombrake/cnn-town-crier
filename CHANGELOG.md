# CNN Town Crier Changelog
CNN Town Crier is version 2+ of MSS Town Crier.


## 2017-11-06, Version 2.4.3

### Commits

* [[`38bd5ec2eb`](https://github.com/cnnlabs/cnn-town-crier/commit/38bd5ec2eb)] - Add id to payload (#15) (Tom)
* [[`09606271d7`](https://github.com/cnnlabs/cnn-town-crier/commit/09606271d7)] - add section to mercury message (#13) (niahmiah)
* [[`a457543d61`](https://github.com/cnnlabs/cnn-town-crier/commit/a457543d61)] - **fix**: package.json to reduce vulnerabilities (#11) (Snyk bot)
* [[`92cd7373d8`](https://github.com/cnnlabs/cnn-town-crier/commit/92cd7373d8)] - add branding property (#14) (niahmiah)



## 2017-05-25, Version 2.4.1, @jamsyoung

### Commits
* [[`45598927f6`](https://github.com/cnnlabs/cnn-town-crier/commit/45598927f6)] - **(SEMVER-MINOR)** whitelist env vars (#7) (niahmiah) [#7](https://github.com/cnnlabs/cnn-town-crier/pull/7)




## 2017-05-24, Version 2.4.0, @jamsyoung

### Notable changes

- Add support for CNN Messaging

### Commits

* [[`1c2841f891`](https://github.com/cnnlabs/cnn-town-crier/commit/1c2841f891)] - **(SEMVER-MINOR)** Feature/cnn messaging (#6) (niahmiah) [#6](https://github.com/cnnlabs/cnn-town-crier/pull/6)




## 2017-04-03, Version 2.3.3, @niahmiah

### Notable changes

- Correctly authenticate to SNS

### Commits

* [[`2f2c24e48b`](https://github.com/cnnlabs/cnn-town-crier/commit/2f2c24e48b)] - fix sns auth (Ian Patton)
* [[`273ebd6124`](https://github.com/cnnlabs/cnn-town-crier/commit/273ebd6124)] - more SNS debug logging (Ian Patton)


## 2017-03-29, Version 2.3.0, @niahmiah

### Notable changes

- Add optional support for publishing to SNS topics, for Lambda consumption

### Commits

* [[`3f6be31eeb`](https://github.com/cnnlabs/cnn-town-crier/commit/3f6be31eeb)] - Add optional support for publishing to SNS topics, for Lambda consumption (Ian Patton)

## 2017-03-01, Version 2.2.0, @jamsyoung

### Notable changes

- Update to Node 7.6.0
- adjusted logic that determins if content needs to go to the queue or not
- test environments now have more DBs to talk to (created a REF one)


### Commits

* [[`6334bedac2`](https://github.com/cnnlabs/cnn-town-crier/commit/6334bedac2)] - Refresh (Jamie Young) [#3](https://github.com/cnnlabs/cnn-town-crier/pull/3)
* [[`817d41c349`](https://github.com/cnnlabs/cnn-town-crier/commit/817d41c349)] - **config**: update default mongoConnectionString (Katie Owen)



## 2016-06-25, Version 2.1.1, @jamsyoung

### Notable changes

- Error handling of documents that are missing attributes


### Commits

* [[`7de703ed67`](https://github.com/cnnlabs/cnn-town-crier/commit/7de703ed67)] - **docs**: update README (James Young)
* [[`b6cfc6378d`](https://github.com/cnnlabs/cnn-town-crier/commit/b6cfc6378d)] - **example**: hard coded some values (James Young)
* [[`fb7ef750f5`](https://github.com/cnnlabs/cnn-town-crier/commit/fb7ef750f5)] - **example**: minor refactor (James Young)
* [[`e5a33e5db1`](https://github.com/cnnlabs/cnn-town-crier/commit/e5a33e5db1)] - **example**: stylistic editing (James Young)
* [[`857a40a4cf`](https://github.com/cnnlabs/cnn-town-crier/commit/857a40a4cf)] - **publisher**: add new values to message (James Young)
* [[`32666dca80`](https://github.com/cnnlabs/cnn-town-crier/commit/32666dca80)] - **publisher**: add branding and slug values to message (James Young)
* [[`99aad1769d`](https://github.com/cnnlabs/cnn-town-crier/commit/99aad1769d)] - **publisher**: handle documents missing attributes (James Young)




## 2016-06-25, Version 2.1.0, @jamsyoung

### Notable changes

- Completley rewritten
- See the documentation written in the [README.md](./README.md) and the example
  consumer in the [/example](./example) directory.


### Known issues

See https://github.com/cnnlabs/cnn-town-crier/labels/defect for complete and
current list of known issues.


### Commits

All of them before the 2.1.0 tag.

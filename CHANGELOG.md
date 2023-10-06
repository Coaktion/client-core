# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.5.0](https://github.com/Coaktion/client-core/compare/v1.4.1...v1.5.0) (2023-10-06)


### Features

* add default headers to be used on endpoints construct requests ([6f4d8d3](https://github.com/Coaktion/client-core/commit/6f4d8d31068d67fab8c83621d3b789d36276f51b))

### [1.4.1](https://github.com/Coaktion/client-core/compare/v1.4.0...v1.4.1) (2023-09-27)


### Bug Fixes

* add headers to bearer auth options ([5e669f8](https://github.com/Coaktion/client-core/commit/5e669f82e1325e61d823777551ffca38b009eafa))
* allow basic auth for bearer auth ([270f32d](https://github.com/Coaktion/client-core/commit/270f32de5c8571e4628a558945d61e9cf3978157))
* making the retryDelay method throw the error when it has a response key ([5b725e1](https://github.com/Coaktion/client-core/commit/5b725e10ffd77b3243e915b233478424c7075af1))
* making ZendeskRequestError return the API error when ZafClient ([eb46b9e](https://github.com/Coaktion/client-core/commit/eb46b9e53eaef2d96d203239dd7a39296fcb2cef))

## [1.4.0](https://github.com/Coaktion/client-core/compare/v1.3.3...v1.4.0) (2023-08-18)


### Features

* add payload to axios request and removing unecessary DataOptions ([fa23acc](https://github.com/Coaktion/client-core/commit/fa23acc6e13e673f756761cfd3c3d92b56a454e3))
* add searchAllPages paginations strategies helpers ([fc02b8c](https://github.com/Coaktion/client-core/commit/fc02b8c39cd58521d5d42c50396e48d7ae306d8e))
* add searchAllPages types ([b2f3211](https://github.com/Coaktion/client-core/commit/b2f321193b8a1f7579b6099ddcdbb0e46b5b6d4c))
* adding new payload to all request methods, added searchAllPages method and added option to pass PATCH to update method ([43916d1](https://github.com/Coaktion/client-core/commit/43916d1cd8a4a007096338e996c88dd5e043395c))
* change payload params, added timeout and headers to Zendesk request ([6fc3e78](https://github.com/Coaktion/client-core/commit/6fc3e785856bdef9e08d45971cdca40161371567))

### [1.3.3](https://github.com/Coaktion/client-core/compare/v1.3.2...v1.3.3) (2023-08-15)


### Bug Fixes

* add contentType from payload type and data as conditional to the request ([899c8a2](https://github.com/Coaktion/client-core/commit/899c8a217660a8b243bc7b04f282a5be177944f5))

### [1.3.2](https://github.com/Coaktion/client-core/compare/v1.3.1...v1.3.2) (2023-05-24)


### Bug Fixes

* ajustando instanciacao classe Zendesk ([042c73f](https://github.com/Coaktion/client-core/commit/042c73f398f61380529e90ae1d4fa8b27a76a65e))

### [1.3.1](https://github.com/Coaktion/client-core/compare/v1.3.0...v1.3.1) (2023-05-11)

## [1.3.0](https://github.com/Coaktion/client-core/compare/v1.2.0...v1.3.0) (2023-05-11)


### Features

* add npmjs.com and github.com actions ([34d1c9d](https://github.com/Coaktion/client-core/commit/34d1c9d36d7d02aa6233b21050a1b46635992188))
* Adding config for npm publish ([d2b68ef](https://github.com/Coaktion/client-core/commit/d2b68ef8c8482f1941bcf22635fb8c392f8ca9d7))


### Bug Fixes

* **workflows:** Ajustanto o pipeline de testes para utilizar a variável NPM_TOKEN corretamente ([cc90327](https://github.com/Coaktion/client-core/commit/cc90327c8c2d625d482504933aeb19015a0feccc))

## [1.2.0](https://github.com/Coaktion/client-core/compare/v1.1.2...v1.2.0) (2023-04-01)


### Features

* Adding retry and retry delay to ZendeskClient ([05a5ac1](https://github.com/Coaktion/client-core/commit/05a5ac18db6e3ab1384d49adb4498577c40f82b8))
* Adding workflow ([0a4280b](https://github.com/Coaktion/client-core/commit/0a4280b69de0cdfcb35a36df6bd36c8e2ac33bd4))
* Adding Zendesk Client to libary ([c0910dc](https://github.com/Coaktion/client-core/commit/c0910dcd999417fa6bb479149db4bc0446ea1561))

### [1.1.2](https://github.com/Coaktion/client-core/compare/v1.1.1...v1.1.2) (2023-01-27)

### Bug Fixes

- Adding default values to clientOptions ([73f50b7](https://github.com/Coaktion/client-core/commit/73f50b73e2a1cd7d6c837e8c1844ef0c53dce67f))

### [1.1.1](https://github.com/Coaktion/client-core/compare/v1.1.0...v1.1.1) (2023-01-26)

### Bug Fixes

- tuning authentication integration ([4ab0299](https://github.com/Coaktion/client-core/commit/4ab029929553103d42c8686e78b162529ac980c0))

## [1.1.0](https://github.com/Coaktion/client-core/compare/v1.0.0...v1.1.0) (2023-01-22)

## [1.0.0](https://github.com/Coaktion/client-core/compare/v0.1.11...v1.0.0) (2023-01-20)

### [0.1.11](https://github.com/Coaktion/client-core/compare/v0.1.8...v0.1.11) (2023-01-20)

### Features

- Adding auth system ([325182e](https://github.com/Coaktion/client-core/commit/325182ec5fb23c2b0e11e8c878e7f8c714f2c3d4))

### [0.1.10](https://github.com/Coaktion/client-core/compare/v0.1.8...v0.1.10) (2023-01-20)

### Features

- Adding auth system ([325182e](https://github.com/Coaktion/client-core/commit/325182ec5fb23c2b0e11e8c878e7f8c714f2c3d4))

### [0.1.9](https://github.com/Coaktion/client-core/compare/v0.1.8...v0.1.9) (2023-01-20)

### Features

- Adding auth system ([325182e](https://github.com/Coaktion/client-core/commit/325182ec5fb23c2b0e11e8c878e7f8c714f2c3d4))

### [0.1.8](https://github.com/Coaktion/client-core/compare/v0.1.7...v0.1.8) (2023-01-19)

### [0.1.7](https://github.com/Coaktion/client-core/compare/v0.1.6...v0.1.7) (2023-01-19)

### Bug Fixes

- Adding defaultClientOptions ([377550e](https://github.com/Coaktion/client-core/commit/377550e56137f2b34b43d56f7c89330b30ac5edc))

### [0.1.6](https://github.com/Coaktion/client-core/compare/v0.1.5...v0.1.6) (2023-01-19)

### Bug Fixes

- Adjusting search ([38d4278](https://github.com/Coaktion/client-core/commit/38d427851201a8585e75bec78064d09c8c2b98e4))

### [0.1.5](https://github.com/Coaktion/client-core/compare/v0.1.4...v0.1.5) (2023-01-19)

### [0.1.4](https://github.com/Coaktion/client-core/compare/v0.1.3...v0.1.4) (2023-01-19)

### [0.1.3](https://github.com/Coaktion/client-core/compare/v0.1.2...v0.1.3) (2023-01-18)

### 0.1.2 (2023-01-18)

### Bug Fixes

- Adding test ([f919aa5](https://github.com/Coaktion/client-core/commit/f919aa54d03f5f266f1c7823d02ba3ec08b63473))
- Adding workflow and pre-commit ([c8524d0](https://github.com/Coaktion/client-core/commit/c8524d0e5dbc8e19a8c23a4a5de8322ecb8e9bae))
- Adjustings ([1d09b7d](https://github.com/Coaktion/client-core/commit/1d09b7dd8f61a0406fc0a93c4777962a95ec20b1))
- lint ([0226550](https://github.com/Coaktion/client-core/commit/022655037007ced09182f119139e7b0355c9ca4f))
- Removing workflow cov ([e6132f2](https://github.com/Coaktion/client-core/commit/e6132f23ab7c285a0154a60b9e992bedf72fbb2e))
- Removing workflow docs ([8038d01](https://github.com/Coaktion/client-core/commit/8038d01a2cd9f5c56498eab317f7cca7e7a1a647))

### 0.1.0 (2023-01-18)

### Bug Fixes

- Adding test ([f919aa5](https://github.com/Coaktion/client-core/commit/f919aa54d03f5f266f1c7823d02ba3ec08b63473))
- Adding workflow and pre-commit ([c8524d0](https://github.com/Coaktion/client-core/commit/c8524d0e5dbc8e19a8c23a4a5de8322ecb8e9bae))
- Adjustings ([1d09b7d](https://github.com/Coaktion/client-core/commit/1d09b7dd8f61a0406fc0a93c4777962a95ec20b1))
- lint ([0226550](https://github.com/Coaktion/client-core/commit/022655037007ced09182f119139e7b0355c9ca4f))
- Removing workflow cov ([e6132f2](https://github.com/Coaktion/client-core/commit/e6132f23ab7c285a0154a60b9e992bedf72fbb2e))
- Removing workflow docs ([8038d01](https://github.com/Coaktion/client-core/commit/8038d01a2cd9f5c56498eab317f7cca7e7a1a647))

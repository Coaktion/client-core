# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.10.0](https://github.com/Coaktion/client-core/compare/v1.9.1...v1.10.0) (2024-11-19)


### Features

* enhance retryCondition to handle undefined errors and improve status checks ([247e36b](https://github.com/Coaktion/client-core/commit/247e36b50c6e9c2a6f279a57da6b12019e581985))
* enhance retryDelay method to improve error handling and support rate limit delays ([197fac8](https://github.com/Coaktion/client-core/commit/197fac82ee51b55e065028c437b8db4398be3ded))


### Bug Fixes

* improve error handling in retryDelay method to support optional chaining ([42db061](https://github.com/Coaktion/client-core/commit/42db061a690346dc239a62dc60dbacc7ef33b17d))

### [1.9.1](https://github.com/Coaktion/client-core/compare/v1.9.0...v1.9.1) (2024-11-18)


### Bug Fixes

* adding suport to amazon JSON content type in the getToken request ([a892610](https://github.com/Coaktion/client-core/commit/a892610696bba7e130f60eff3b4a7a42994fc13e))
* using enum content-types ([408bdfb](https://github.com/Coaktion/client-core/commit/408bdfb8d703efcebc7527082c0a0ab227fc74c9))

## [1.9.0](https://github.com/Coaktion/client-core/compare/v1.8.3...v1.9.0) (2024-09-26)


### Features

* add httpsAgent to axios client ([657b017](https://github.com/Coaktion/client-core/commit/657b017c84023c1f30d35063cdfea3ed70a74a5c))

### [1.8.3](https://github.com/Coaktion/client-core/compare/v1.8.2...v1.8.3) (2024-08-05)

### [1.8.1](https://github.com/Coaktion/client-core/compare/v1.8.0...v1.8.1) (2024-08-02)

## [1.8.0](https://github.com/Coaktion/client-core/compare/v1.7.2...v1.8.0) (2023-12-27)


### Features

* add zendesk helper methods ([60339e8](https://github.com/Coaktion/client-core/commit/60339e85c2ed118a3caee6f68124ba8867f4c4e9))

### [1.7.2](https://github.com/Coaktion/client-core/compare/v1.7.1...v1.7.2) (2023-12-08)

### [1.7.1](https://github.com/Coaktion/client-core/compare/v1.7.0...v1.7.1) (2023-11-30)


### Bug Fixes

* get current ticket ([3e42d9e](https://github.com/Coaktion/client-core/commit/3e42d9e2b8cd69add0610bf1f32efda5f97630c0))

## [1.7.0](https://github.com/Coaktion/client-core/compare/v1.6.0...v1.7.0) (2023-11-30)


### Features

* add get current ticket method to zendesk client ([43d5d70](https://github.com/Coaktion/client-core/commit/43d5d70f2450f3398c7f64728fbdcee35bc9f5b5))

## [1.6.0](https://github.com/Coaktion/client-core/compare/v1.5.5...v1.6.0) (2023-11-29)


### Features

* add baseBearer auth class to share the logic of bearerToken property ([a342c84](https://github.com/Coaktion/client-core/commit/a342c84dd3c2739dcf498d918fac5b0c57d78e21))

### [1.5.5](https://github.com/Coaktion/client-core/compare/v1.5.4...v1.5.5) (2023-11-22)


### Bug Fixes

* make request params ([5daeb67](https://github.com/Coaktion/client-core/commit/5daeb67a82a9aa5dd2592200ec01126da59599e7))

### [1.5.4](https://github.com/Coaktion/client-core/compare/v1.5.3...v1.5.4) (2023-11-22)


### Bug Fixes

* add catch to retry request ([1b20281](https://github.com/Coaktion/client-core/commit/1b202810ff96cf359491dea83b9a6d68b7a2bb5f))
* removing axios-retry dependency ([66e4e8f](https://github.com/Coaktion/client-core/commit/66e4e8f332d8a4532f9ed87de69a3c8943a03710))

## [1.5.3](https://github.com/Coaktion/client-core/compare/v1.5.2...v1.6.0) (2023-11-16)


### Features

* add code quality check ([9f42611](https://github.com/Coaktion/client-core/commit/9f426117a941ba52661e52019054e6ab42900ea2))


### Bug Fixes

* fix zendesk makeRequest on catch ([26301c1](https://github.com/Coaktion/client-core/commit/26301c1af361f4260ce013657190d0a150d55446))

## [1.5.2](https://github.com/Coaktion/client-core/compare/v1.5.1...v1.6.0) (2023-10-23)


### Features

* change method to type on Zendesk requests ([a78c20b](https://github.com/Coaktion/client-core/commit/a78c20b65e65a7f33b1b6b626fbf65770b7ea0e4))

## [1.5.1](https://github.com/Coaktion/client-core/compare/v1.5.0...v1.6.0) (2023-10-20)


### Features

* add BearerAuthZendesk auth method ([ca37f34](https://github.com/Coaktion/client-core/commit/ca37f348b4527c5e477ea3db23cd9ac700cce7e2))


### Bug Fixes

* calling authentication on makeRequest ZendeskClient ([04e3132](https://github.com/Coaktion/client-core/commit/04e31321b9840461329e8337537c2a6e471cbaf5))

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

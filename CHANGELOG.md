# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="3.2.0"></a>
# [3.2.0](https://github.com/martinheidegger/i18n-core/compare/v3.1.6...v3.2.0) (2017-06-19)


### Features

* **events:** Added event system to be able to be informed in case the context changes ([4343cfa](https://github.com/martinheidegger/i18n-core/commit/4343cfa))



<a name="3.1.6"></a>
## [3.1.6](https://github.com/martinheidegger/i18n-core/compare/v3.1.5...v3.1.6) (2017-06-09)


### Bug Fixes

* **simple:** Allow replacing multiple tokens in translations, contributed by Alex Potsides ([@achingbrain](https://github.com/achingbrain)) ([a69e02a](https://github.com/martinheidegger/i18n-core/commit/a69e02a))



<a name="3.1.5"></a>
## [3.1.5](https://github.com/martinheidegger/i18n-core/compare/v3.1.3...v3.1.5) (2017-05-30)


### Bug Fixes

* properly escaping strings in simplified html rendering using ‘escape-html’ ([8b52f94](https://github.com/martinheidegger/i18n-core/commit/8b52f94))



<a name="3.1.3"></a>
## [3.1.3](https://github.com/martinheidegger/i18n-core/compare/v3.1.2...v3.1.3) (2017-05-30)


### Bug Fixes

* sections and absSection are now not interfering with each other ([d841df5](https://github.com/martinheidegger/i18n-core/commit/d841df5))



<a name="3.1.2"></a>
## [3.1.2](https://github.com/martinheidegger/i18n-core/compare/v3.1.1...v3.1.2) (2017-05-29)



<a name="3.1.1"></a>
## [3.1.1](https://github.com/martinheidegger/i18n-core/compare/v3.1.0...v3.1.1) (2017-05-29)


### Bug Fixes

* **fallback:** In case of a fallback it now shows the proper absolute key. ([d0bf9f0](https://github.com/martinheidegger/i18n-core/commit/d0bf9f0))
* **simple:** Fixed simple mustache lookups for escaped content. ([0114a92](https://github.com/martinheidegger/i18n-core/commit/0114a92))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/martinheidegger/i18n-core/compare/v3.0.0...v3.1.0) (2017-05-29)


### Features

* **api:** Added absPrefix and absSection api methods for more convenient use of ‘abs’ ([787e33f](https://github.com/martinheidegger/i18n-core/commit/787e33f))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/martinheidegger/i18n-core/compare/v2.1.1...v3.0.0) (2017-02-19)


### Bug Fixes

* **api:** `one` will not be used as fallback for multiples. ([343f01c](https://github.com/martinheidegger/i18n-core/commit/343f01c))
* **api:** `undefined` arguments are considered “non” arguments ([2c07575](https://github.com/martinheidegger/i18n-core/commit/2c07575))
* **sections:** Prevent the creation of multiple sibling sections from influencing each other. ([ff5ad72](https://github.com/martinheidegger/i18n-core/commit/ff5ad72))


### Features

* **api:** BREAKING CHANGE: removed translateFirst from API ([80b9ee9](https://github.com/martinheidegger/i18n-core/commit/80b9ee9))
* **api:** Made mustache & sprintf are now peers ([01e527d](https://github.com/martinheidegger/i18n-core/commit/01e527d))
* **api:** renamed `lang` to `section` ([5405628](https://github.com/martinheidegger/i18n-core/commit/5405628))
* **docs:** Added Changelog ([807317c](https://github.com/martinheidegger/i18n-core/commit/807317c))
* **hierarchy:** Added support for absolute lookups and locks. ([97252bd](https://github.com/martinheidegger/i18n-core/commit/97252bd))
* **hierarchy:** allowed changePrefix to be undefined ([381c2af](https://github.com/martinheidegger/i18n-core/commit/381c2af))
* **lookup:** Automatic conversion of a function to a handler ([fed4903](https://github.com/martinheidegger/i18n-core/commit/fed4903))
* **lookup:** renamed lookup `raw` to `get` for better cascadability ([9ef14f3](https://github.com/martinheidegger/i18n-core/commit/9ef14f3))
* **translation:** translator changed into translation function ([1cb0a92](https://github.com/martinheidegger/i18n-core/commit/1cb0a92))


### Performance Improvements

* **api:** Limiting regular arguments max 10 ([0602425](https://github.com/martinheidegger/i18n-core/commit/0602425))
* **internal:** lazy initialization of sections ([4dacdde](https://github.com/martinheidegger/i18n-core/commit/4dacdde))
* **internal:** Using Object.create for quicker instantiation ([52691ae](https://github.com/martinheidegger/i18n-core/commit/52691ae))


### BREAKING CHANGES

* api: api for `lang` is renamed to `section` and `sub` becomes `prefix`, `prefix` - a undocumented public variable - becomes `currentPrefix`
* api: To reduce the weight of the package mustache and sprintf are now peer dependencies.
* lookup: With this change every node also implements the lookup interface which means that you can mix, extend and merge any kind of lookup & translation input
* api: Plurals used to be able to have a `one` property that would be used if only one node is available. This results in weird specifications that are hard to read so it has been streamlined.
* api: For performance reasons, instead of relying on arguments.length, regular arguments (used for sprintf style lookups) can be maximum 10
* api: For performance reasons there is no lookup anymore for `arguments.length` instead trailing `undefined` arguments are considered and equal non-existent.



<a name="2.1.1"></a>
## [2.1.1](https://github.com/martinheidegger/i18n-core/compare/v2.0.0...v2.1.1) (2017-02-17)

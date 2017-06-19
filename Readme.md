# i18n-core

[![Join the chat at https://gitter.im/martinheidegger/i18n-core](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/martinheidegger/i18n-core?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/martinheidegger/i18n-core.svg)](https://travis-ci.org/martinheidegger/i18n-core)
[![Code Climate](https://codeclimate.com/github/martinheidegger/i18n-core/badges/gpa.svg)](https://codeclimate.com/github/martinheidegger/i18n-core)
[![Test Coverage](https://codeclimate.com/github/martinheidegger/i18n-core/badges/coverage.svg)](https://codeclimate.com/github/martinheidegger/i18n-core/coverage)

[i18n-core](https://github.io/martinheidegger/i18n-core) is a no-fuzz Node.js
implementation of i18n. It doesn't connect to express or any other fancy Node
framework and is extensible where it needs to be and allows to reduce the
complexity of other i18n implementations (thus the name).

It implements basic variable replacements in the mustache and sprintf manner.

## Installation

To use *i18n-core* all you need to do is install it using ```npm```

```bash
npm i i18n-core --save
```

## Usage

```JavaScript
var i18n_core = require('i18n-core')
var i18n = i18n_core({greeting: 'hello!'})
i18n.__('greeting') // hello!
```

To have different namespaces for different languages you can get a prefixed
translations using `.section()`.

```javascript

var i18n = i18n_core({
  en: { greeting: 'hello!' },
  de: { greeting: 'guten tag!' }
})

var en = i18n.section('en')
en.__('greeting') // hello!

var de = i18n.section('de')
de.__('greeting') // guten tag!
```

_Note:_ `.section(<section>)` is the same thing as `.prefix(<section> + '.')`

## Lookups

The system is based on `lookup` implementations that allow the system to use
different sources to get its strings from. The examples before used an object
and because of this the former example would be equal to:

```javascript
var i18n = i18n_core(require('i18n-core/lookup/object')({greeting: 'hello!'}))
```

If you were to pass in a string to `i18n-core` instead like this:

```javascript
var i18n = i18n_core('./')
```

Then it would be equal the primitive **file-system** lookup same like this:

```javascript
var i18n = i18n_core(require('i18n-core/lookup/fs')('./'))
```

You can pass in your own strategy by given an object to the constructor that
contains a "get"-method:

```javascript
var i18n = i18n_core({
  get: function (key) {
    return null // Who needs translation anyway?
  }
})
```

In case you need to have several strategies that need to be chained you can use
the **chain lookup**:

```javascript
var i18nChain = require('i18n-core/lookup/chain')
var i18nObject = require('i18n-core/lookup/object')
var i18n = i18n_core(i18nChain(i18nObject({a: 'x'}), i18nObject({a: 0, b: 1})))
i18n.__('a') // x
i18n.__('b') // 1
```

In case you have an `i18n` object that you want to use as lookup for another
`i18` object you can **extend** them:

```javascript
var i18nExtend = require('i18n-core/lookup/extend')
var i18nObject = require('i18n-core/lookup/object')
var i18nA = i18n({a: 'x'})
var i18nB = i18n(i18nExtend(i18nA, i18nObject({
  b: 1
})))

i18n.__('a') // x
i18n.__('b') // 1
```

## Substitution

*i18n-core* does implement basic placeholder replacements like:

```javascript
en.__('%s is cool', 'he') // 'he is cool'
```

following the logic of [`sprintf`](https://github.com/maritz/node-sprintf).

It also offers [`mustache`](https://github.com/janl/mustache.js)-like pattern
replacement like this:

```javascript
en.__('{{name}} are cool too', {name: 'you'}) // 'you are cool too'
```

### Substitution variants

By default `i18n-core` does not have any dependencies and the default
substitution is `mustache`-like and `sprintf`-like with limited compatibility.

_Note:_ Without `mustache` and `sprintf` installed, it will use
`require('i18n-core/simple')`

In order to get full compatibility you can simply install the peer dependency.

```
npm i mustache sprintf --save
```

_Note:_ **With** `mustache` and `sprintf` installed, it will use
`require('i18n-core/full')`

It is furthermore possible to customize the formatting by specifying own
implementations:

```javascript
var i18n_core = require('i18n-core')
i18n_core.mustache = require('mustache')
i18n_core.vsprintf = require('sprintf').vsprintf
```

## Advanced Namespaces

It is possible to chain translation prefixes like this:

```javascript
var at = i18n_core({de:{at: {hello: 'Zewas!'}}}).section('de').section('at')
at.__('hello') // Zewas!
```

and you can also change the chain if you want to.

```javascript
var translate = i18n_core({
  de: {title: 'Meine Webseite'},
  en: {title: 'My Website'}
}).section('de', true) // <- this true is important :)
translate.__('title') // Meine Website
translate.changeSection('en')
translate.__('title') // My Website
```

To prevent malicious use the changing of the section is prevented unless you
pass a `true` flag to it.

In some instances it is necessary to know in advance if a key has a value or
not, in this case you can use `has`.

```javascript
var translate = i18n_core({title: 'My Website'})
translate.has('title') // true
translate.has('subtitle') // false
```

Additionally, for module development, its possible to access the raw data
using `raw`:

```javascript
var translate = i18n_core({no: {val: 5}})
translate.raw('no') // {val: 5}
```

## Listening to changes

Since you can change translation nodes it is, in an interactive environment,
good to have a way to be informed about changes. `i18n-core` has a **very**
light-weight and fast event implementation tailored to the process.

```javascript
const parent = i18n_core({
  de: {
    site: {
      title: 'Meine Webseite'
    }
  },
  en: {
    site: {
      title: 'My Website'
    }
  }
}).section('de', true)
const translate = parent.section('site')
translate.__('title') // Meine Webseite
translate.on('contextChange', function () {
  translate.__('title') // My Website
})
parent.changeSection('en')
```

## Absolute Lookups

`i18n-core` supports the use of absolute roots. Absolute roots allow to lookup
entries in absolute locked roots rather than the given level.

```javascript
var translate = i18n_core({
  title: 'Meine Webseite',
  sectionA: {
    title: 'Lebenslauf'
  }
})

var sub = translate.section('sectionA')
sub('title') // Lebenslauf
sub.abs('title') // Meine Webseite
```

This allows to crate things like footers where you can pass one section to a
module and it is still able to access absolute code.

However, this also creates the problem that subsections _(for languages)_ can be
escaped from. In order to prevent that, you can lock the absolute root to
`.lock()`. You can lock any section and any subsequent sections will get the
same root.

```javascript
var translate = i18n_core({
  de: {
    title: 'Meine Webseite',
    sectionA: { title: 'Lebenslauf' }
  },
  en: {
    title: 'My Website',
    sectionA: { title: 'Curriculum Vitae' }
  }
})
var lang = translate
  .section('de', true)
  .lock() // This locks the absolute root to the language level

var sub = lang.section('sectionA')
sub('title') // Lebenslauf
sub.abs('title') // Meine Webseite

lang.changeSection('en')
sub('title') // Curriculum Vitae
sub.abs('title') // My Website
```

Prefixing every absolute lookup with `abs` can get tedious that is why there is
also the possibility to use `absSection` that, like `section`, returns a new
translation object where every call assumes a particular absolute section.

```javascript
var translate = i18n_core({
  en: {
    sectionA: {
      title: 'Curriculum Vitae'
    },
    menu: {
      about: 'About Me'
    }
  }
})
var lang = translate.section('en', true).lock()

var sectionA = lang.section('sectionA')
sectionA('title') // Curriculum Vitae
var menu = sectionA.absSection('menu')
menu('about') // About Me
```

For your convenience there is also the `.root()` alias for `.absSection('')`.

## Core API's

The default API is made to provide a simple solutions to common problems but
`i18n-core` also offers a reduced, faster API without conveniences. You can get
access to the core by using `require('i18n-core/core')`.

```javascript
var core = require('i18n-core/core')({
  get: function lookupValue (key) {
    return // Return a value for the key or undefined
  }
}, function translate (value, fallbackKey, namedArgs, args) {
  // value ......... value that should be translated
  // fallbackKey ... fallbackKey that should be passed on to `fallback`
  // namedArgs ..... named arguments passed in through the API, can be undefined
  // args .......... regular arguments passed in through the API, can be undefined
})
core.get(key) // looks up a key
core.has(key) // .get(key) !== undefined

// translate the key with named & regular args
core.translate(key, namedArgs, args)

// translate the first found entry with a fallback
// keys .......... Array of keys to test
// fallbackKey ... Key to be passed on to `fallback`
// namedArgs ..... `namedArgs` to be used when translating
// args .......... `args` to be used when translating
core.translateFirst(keys, fallbackKey, namedArgs, args)

// Creates an api node where each key is prefixed
// prefix .............. prefix to be set for each translation request
// allowModification ... allows changePrefix API
core.prefix(prefix, allowModification)

// Creates an api node where each key is prefixed to an absolute root
// prefix .............. prefix to be set for each translation request
// allowModification ... allows changePrefix API
core.absPrefix(prefix, allowModification)

// Changes the prefix of the API (undefined when modification forbidden)
core.changePrefix(prefix)
core.lock(locked) // Locks, unlocks the absolute root.
core.absRoot // Holds the root fallback

// Fields used for internal processing
core.parent // Parent node (or undefined)
core.translator // Quick lookup of the translation method
core.currentPrefix // Prefix of the current node '' == null

core.on(type, handler) // Listen to changes of `changeContext`
core.off(type, handler) // Remove the handler
```

## Outro

If you have any questions, please post them as issue, thanks!

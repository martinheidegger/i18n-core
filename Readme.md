# i18n-core

[![Build Status](https://travis-ci.org/martinheidegger/i18n-core.svg)](https://travis-ci.org/martinheidegger/i18n-core)
[![Code Climate](https://codeclimate.com/github/martinheidegger/i18n-core/badges/gpa.svg)](https://codeclimate.com/github/martinheidegger/i18n-core)

[i18n-core](https://github.io/martinheidegger/i18n-core) is a no-fuzz Node.js implementation of i18n. It doesn't connect to express or any other fancy Node framework and is extensible where it needs to be and allows to reduce the complexity of other i18n implementations (thus the name).

It implements basic variable replacements in the mustache and sprintf manner.

# Usage

To use *i18n-core* all you need to do is install it using ```npm```

```bash
$ npm i i18n-core --save
```

To use *i18n-core* you need require it in your javascript file.

```JavaScript
var i18n_core = require("i18n-core")
```

You can then initialize and use the library like this:

```JavaScript
var i18n = i18n_core({a: "b"})
i18n.__("a") // b!
```

To have different namespaces for different language you can get a prefixed subpart using `.lang()`.

```JavaScript
var en = i18n_core({en: {d: "e"}}).lang("en")
en.__("d") // e!
```

*Note: `.lang(<lang>)` is the same thing as `.sub(<lang> + ".")`*

The system is based on `lookup` implementations that allow the system to use different sources to get its strings from. The examples before used an object and because of this the former example would be equal to:

```JavaScript
var i18n = i18n_core(require("i18n-core/lookup/object")({a: "b"}));
```

If you were to pass in a string to `i18n-core` instead like this:

```JavaScript
var i18n = i18n_core("./");
```

Then it would be equal the primitive file-system lookup same like this:

```JavaScript
var i18n = i18n_core(require("i18n-core/lookup/fs")("./"));
```

You can pass in your own strategy by given an object to the constructor that contains a "get"-method:

```JavaScript
var i18n = i18n_core({
    get: function (key) {
        return null; // Who needs translation anyway?
    }
});
```

*i18n-core* does implement basic placeholder replacements like:

```JavaScript
en.__("%s is cool", "he"); // "he is cool"
```

following the logic of [sprintf](https://github.com/maritz/node-sprintf).

It also offers [mustache](https://github.com/janl/mustache.js) pattern replacement like this:

```JavaScript
en.__("{{name}} are cool too", {name: "you"}); // "you are cool too"
```

If you have any questions, please post them as issue, thanks!

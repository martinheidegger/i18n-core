"use strict";

function defaultFallback(key) {
	if (!key) {
		return "(?)";
	}
	return key;
}

function getLookup(data) {
	if (data && typeof data.get === "function") {
		// Direct lookup implementation pass-through
		return data;
	} else if (typeof data === "string") {
		return require("./lookup/fs")(data);
	}
	return require("./lookup/object")(data || {});
}

function _defaultTranslation(that, value, fallbackKey, namedValues, args) {
	if (value === null || value === undefined) {
		value = that.fallback(fallbackKey);
	}
	if (namedValues && (/{{.*}}/).test(value)) {
		value = that.mustache.render(value, namedValues);
	}
	if (args !== null && args !== undefined && args.length > 0 && /%/.test(value)) {
		return that.vsprintf(value, args);
	}
	return value;
}

function defaultTranslation(key, namedValues, args) {
	return _defaultTranslation(this, this.raw(key), key, namedValues, args);
}

function defaultTranslationFirst(keys, fallbackKey, namedValues, args) {
	var value = null,
		keyNo = 0;
	while ((value === undefined || value === null) && keyNo < keys.length) {
		var key = keys[keyNo];
		value = this.raw(key);
		keyNo += 1;
	}
	return _defaultTranslation(this, value, fallbackKey, namedValues, args);
}

function has(key) {
	var val = this.raw(key);
	return val !== undefined && val !== null;
}

function raw(key) {
	return this.lookup.get(key);
}

module.exports = function (data, allowModification) {
	var translator = require("./lib/createTranslator")("", null, allowModification),
	    lookup = getLookup(data);
	translator.lookup = lookup;
	translator.fallback = defaultFallback;
	translator.has = has;
	translator.raw = raw;
	translator.mustache = require("mustache");
	translator.vsprintf = require("sprintf").vsprintf;
	translator.translate = defaultTranslation.bind(translator);
	translator.translateFirst = defaultTranslationFirst.bind(translator)
	return translator;
}
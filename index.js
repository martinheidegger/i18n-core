"use strict";

function defaultFallback(prefix, key, namedValues, args) {
	if (!key) {
		return "(?)";
	}
	return key;
}

function getLookup(data) {
	if (data && data.get) {
		// Direct lookup implementation pass-through
		return data;
	} else if (typeof data === "string") {
		return require("./lookup/fs")(data);
	}
	return require("./lookup/object")(data || {});
}

function defaultTranslation(prefix, keys, fallbackKey, namedValues, args) {
	var result,
		keyNo = 0;
	while (!result && keyNo < keys.length) {
		result = this.lookup.get(prefix + keys[keyNo]);
		keyNo += 1;
	}
	if (result === null
		|| result === undefined) {
		result = this.fallback(prefix, fallbackKey, namedValues, args);
	}
	if (namedValues && (/{{.*}}/).test(result)) {
		result = this.mustache.render(result, namedValues);
	}
	if (args.length > 0 && /%/.test(result)) {
		return this.vsprintf(result, args);
	}
	return result;
}

module.exports = function (data) {
	var translator = require("./lib/createTranslator")("");
	translator.lookup = getLookup(data);
	translator.fallback = defaultFallback;
	translator.mustache = require("mustache");
	translator.vsprintf = require("sprintf").vsprintf;
	translator.translate = defaultTranslation;
	return translator;
}
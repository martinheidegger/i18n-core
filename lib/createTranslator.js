"use strict";

function getStart(namedValues) {
	return (typeof namedValues === "object" && namedValues !== null) ? 2 : 1;
}

function getArgs(startOfArgs, args) {
	return (args.length > startOfArgs) ? Array.prototype.slice.call(args, startOfArgs) : [];
}

module.exports = function createTranslator(prefix, parent) {
	function __(key, namedValues) {
		var startOfArgs = getStart(namedValues),
			args = getArgs(startOfArgs, arguments);
		return this.translate(prefix, [key], key, startOfArgs == 2 ? namedValues : null, args);
	}

	function __n(singular, plural, count, namedValues) {
		var startOfArgs = getStart(namedValues) + 2,
			args,
			keys,
			fallbackKey;

		if (typeof plural !== "object" &&
			typeof plural !== "string") {
			namedValues = count;
			count = plural;
			plural = singular;
			startOfArgs -= 1;
		}
		if (typeof plural === "object") {
			if (plural !== null) {
				plural = plural[count] ||
						 plural.other ||
						 plural.one;
			}
			plural = plural ||
			        (typeof singular === "object" ? 
			        	(singular[count] ||
			        	 singular.other ||
			        	 singular.one)
			        	: singular);
		}
		if (typeof singular === "object") {
			singular = singular[count] ||
			           singular.one;
		}
		args = getArgs(startOfArgs, arguments);
		if (!namedValues || startOfArgs === 3) {
			namedValues = {};
		}
		namedValues.count = count;
		args.unshift(count);
		if (count > 1) {
			keys = [plural, singular + "." + count, singular + ".other", singular, singular + ".one"];
			fallbackKey = plural;
		} else {
			keys = [singular + ".one", singular];
			fallbackKey = singular;
		}
		return this.translate(prefix, keys, fallbackKey, namedValues, args);
	}

	function lang(locale) {
		return this.sub(locale + ".");
	}

	function translate(prefix, keys, fallbackKey, namedValues, args) {
		return parent.translate(prefix, keys, fallbackKey, namedValues, args);
	}

	function sub(prefix) {
		var translator = this.storage[prefix];
		if (!translator) {
			translator = createTranslator(prefix, this);
			this.storage[prefix] = translator;
		}
		return translator;
	}

	var result = {
		storage: {}
	};
	result.translate = translate.bind(result);
	result.lang = lang.bind(result);
	result.sub = sub.bind(result);
	result.__ = __.bind(result);
	result.__n = __n.bind(result);
	return result;
};
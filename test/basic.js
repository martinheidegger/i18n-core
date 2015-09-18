"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	i18n = require("../"),
	path = require("path"),
	fsFolder = path.join(__dirname, "lookup", "fs"),
	expect = code.expect;

test("basic object lookup", function (done) {
	var translator = i18n({a: "b"})
	expect(translator.__("a")).to.equal("b");
	expect(translator.__("c")).to.equal("c");
	done();
});

test("basic existance object lookup", function (done) {
	var translator = i18n({a: "b", c: null, d: {e: "f", g: null}}),
		d = translator.lang('d');
	expect(translator.has("a")).to.equal(true);
	expect(translator.has("b")).to.equal(false);
	expect(translator.has("c")).to.equal(false);
	expect(translator.has("d")).to.equal(true);
	expect(d.has("e")).to.equal(true);
	expect(d.has("g")).to.equal(false);
	expect(d.has("h")).to.equal(false);
	done();
});

test("raw passthrough lookup", function (done) {
	var translator = i18n({a: "b", c: null, d: {e: "f", g: null}}),
		d = translator.lang('d');
	expect(translator.raw("a")).to.equal("b");
	expect(translator.raw("b")).to.equal(undefined);
	expect(translator.raw("c")).to.equal(null);
	expect(translator.raw("d")).to.deep.equal({
		e: "f",
		g: null
	});
	expect(d.raw("e")).to.equal("f");
	expect(d.raw("g")).to.equal(null);
	expect(d.raw("h")).to.equal(undefined);
	done();
});

test("custom lookup", function (done) {
	expect(i18n(require("../lookup/object")({"en": {c:"d"}})).lang("en").__("c")).to.equal("d");
	done();
});

test("basic file lookup is used when string is given", function (done) {
	expect(i18n(fsFolder).lang("en").__("b")).to.equal("c");
	done();
});


test("same translator", function (done) {
	var set = i18n();
	expect(set.lang("en")).to.equal(set.lang("en"));
	done();
});

test("null namespace with key", function (done) {
	try {
		var translator = i18n(fsFolder).sub(null);
	} catch(e) {
		return done();
	}
	throw new Error("Should not be allowed.");
});

test("undefined namespace with key", function (done) {
	try {
		var translator = i18n(fsFolder).sub(undefined);
	} catch(e) {
		return done();
	}
	throw new Error("Should not be allowed.");
});


test("changing of the language should be possible after the fact if allowed", function (done) {
	var translator = i18n(fsFolder).lang("en", true),
		__ = translator.__;

	expect(__("d")).to.equal("e");
	translator.changeLang("gr");
	expect(__("d")).to.equal("g");
	done();
});

test("changing of the prefix should be possible after the fact if allowed", function (done) {
	var translator = i18n(fsFolder).lang("en", true),
		__ = translator.__;

	expect(__("d")).to.equal("e");
	translator.changePrefix("gr.");
	expect(__("d")).to.equal("g");
	done();
});

test("changing of the language should not be possible after the fact", function (done) {
	var translator = i18n(fsFolder).lang("en"),
		__ = translator.__;

	expect(__("d")).to.equal("e");
	try {
		translator.changeLang("gr");
	} catch(e) {
		expect(__("d")).to.equal("e");
		done();
		return;
	}
	throw new Error("Translation should be blocked.")
});

test("changing of the prefix should affect the subprefix", function (done) {
	var translator = i18n(fsFolder).sub("g", true),
		translator2 = translator.lang("n"),
		__ = translator2.__;

	translator.changePrefix("e");

	expect(__("d")).to.equal("e");
	done();
});

test("undefined fallback", function (done) {
	var translator = i18n({a: null, b: undefined});
	expect(translator.__(null)).to.equal("(?)");
	expect(translator.__(undefined)).to.equal("(?)");
	expect(translator.__("a")).to.equal("a");
	expect(translator.__("b")).to.equal("b");
	done();
});

test("sprintf should be ignored when the given array has a length = 0", function (done) {
	expect(i18n().translate("a %2", {}, [])).to.equal("a %2");
	done();
});

test("An undefined sub should work just fine", function (done) {
	expect(i18n({en: "a"}).sub("en").__(undefined)).to.equal("a");
	expect(i18n({en: "a"}).sub("en").__(null)).to.equal("a");
	done();
});

test("multiple keys with one being an empty string", function (done) {
	var translate = i18n({"a": "", "b": "ho"}).translate;
	expect(translate("a")).to.equal("");
	done();
});

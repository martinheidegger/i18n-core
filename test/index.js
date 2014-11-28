"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	i18n = require("../"),
	expect = code.expect;

test("basic object lookup", function (done) {
	expect(i18n({a: "b"}).__("a")).to.equal("b");
	done();
});

test("basic file lookup", function (done) {
	expect(i18n(__dirname + "/lookup").lang("en").__("b")).to.equal("c");
	done();
});

test("missing file lookup", function (done) {
	expect(i18n(__dirname + "/lookup").lang("de").__("b")).to.equal("b");
	done();
});

test("custom lookup", function (done) {
	expect(i18n(require("../lookup/object")({"en": {c:"d"}})).lang("en").__("c")).to.equal("d");
	done();
});

test("mustache testing", function (done) {
	expect(i18n({"en": {a: "{{hello}}"}}).lang("en").__("a", {hello: "d"})).to.equal("d");
	done();
});

test("args testing", function (done) {
	expect(i18n({"en": {a: "%s"}}).lang("en").__("a", "e")).to.equal("e");
	done();
});

test("fallback", function (done) {
	var translator = i18n(),
		__  = translator.__;
	expect(__("a")).to.equal("a");
	expect(__("")).to.equal("(?)");
	done();
});

test("custom root fallback", function (done) {
	var translator = i18n();
	translator.fallback = function () {
		return "x";
	};
	translator = translator.lang("en");
	expect(translator.__("a")).to.equal("x");
	expect(translator.__("")).to.equal("x");
	done();
});

test("custom child fallback should not work!", function (done) {
	var translator = i18n().lang("en");
	translator.fallback = function () {
		return "x";
	};
	expect(translator.__("a")).to.equal("a");
	done();
});

test("args without placeholder", function (done) {
	expect(i18n({"en": {a: ""}}).lang("en").__("a", "e")).to.equal("");
	done();
});

test("mixed mustache & args testing", function (done) {
	expect(i18n({"en": {a: "%s {{hello}}"}}).lang("en").__("a", {hello: "g"}, "f")).to.equal("f g");
	done();
});

test("plurals", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("%s a", "", 1)).to.equal("1 a");
	expect(__n("", "%s b", 2)).to.equal("2 b");
	expect(__n("%s a {{count}}", "", 1)).to.equal("1 a 1");
	expect(__n("", "%s b {{count}}", 2)).to.equal("2 b 2");
	expect(__n("", "{{count}} c", 3)).to.equal("3 c");
	done();
});

test("plurals mixed with args", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("%s a %s", "", 1, "x")).to.equal("1 a x");
	expect(__n("", "%s b %s", 2, "y")).to.equal("2 b y");
	expect(__n("%s c %s {{a}}", "", 1, {a: "b"}, "x")).to.equal("1 c x b");
	expect(__n("", "%s d %s {{c}}", 2, {c: "d"}, "y")).to.equal("2 d y d");
	expect(__n("", "%s e {{e}}", 2, {e: "f"})).to.equal("2 e f");
	done();
});

test("plural objects", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n({one: "a", other: "%s"}, 2, "x")).to.equal("2");
	expect(__n({1: "b %s"}, 1, "x")).to.equal("b 1");
	expect(__n({2: "c %s"}, 2, "x")).to.equal("c 2");
	expect(__n({}, {2: "d %s"}, 2, "x")).to.equal("d 2");
	expect(__n({}, {other: "e %s"}, 2, "x")).to.equal("e 2");
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

test("plural fallbacks", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("a %s", 2, "x")).to.equal("a 2");
	expect(__n({other: "b %s"}, 2, "x")).to.equal("b 2");
	expect(__n({one: "c %s"}, 2, "x")).to.equal("c 2");
	expect(__n({other: "d %s"}, null, 2, "x")).to.equal("d 2");
	expect(__n({2: "e %s"}, null, 2, "x")).to.equal("e 2");
	expect(__n({one: "f %s"}, null, 2, "x")).to.equal("f 2");
	expect(__n("g %s", null, 2, "x")).to.equal("g 2");
	done();
});


test("same translator", function (done) {
	var set = i18n();
	expect(set.lang("en")).to.equal(set.lang("en"));
	done();
});
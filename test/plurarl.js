"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	i18n = require("../"),
	expect = code.expect;

test("plurals", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("%s a", "", 1)).to.equal("en.1 a");
	expect(__n("", "%s b", 2)).to.equal("en.2 b");
	expect(__n("%s a {{count}}", "", 1)).to.equal("en.1 a 1");
	expect(__n("", "%s b {{count}}", 2)).to.equal("en.2 b 2");
	expect(__n("", "{{count}} c", 3)).to.equal("en.3 c");
	expect(__n("", "{{count}} c", 3, null)).to.equal("en.3 c");
	done();
});

test("plurals mixed with args", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("%s a %s", "", 1, "x")).to.equal("en.1 a x");
	expect(__n("", "%s b %s", 2, "y")).to.equal("en.2 b y");
	expect(__n("%s c %s {{a}}", "", 1, {a: "b"}, "x")).to.equal("en.1 c x b");
	expect(__n("", "%s d %s {{c}}", 2, {c: "d"}, "y")).to.equal("en.2 d y d");
	expect(__n("", "%s e {{e}}", 2, {e: "f"})).to.equal("en.2 e f");
	done();
});

test("plural objects", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n({one: "a", other: "%s"}, 2, "x")).to.equal("en.2");
	expect(__n({1: "b %s"}, 1, "x")).to.equal("en.b 1");
	expect(__n({2: "c %s"}, 2, "x")).to.equal("en.c 2");
	expect(__n({}, {2: "d %s"}, 2, "x")).to.equal("en.d 2");
	expect(__n({}, {other: "e %s"}, 2, "x")).to.equal("en.e 2");
	done();
});

test("plural fallbacks", function (done) {
	var translator = i18n().lang("en"),
		__n = translator.__n;
	expect(__n("a %s", 2, "x")).to.equal("en.a 2");
	expect(__n({other: "b %s"}, 2, "x")).to.equal("en.b 2");
	expect(__n({one: "c %s"}, 2, "x")).to.equal("en.c 2");
	expect(__n({other: "d %s"}, null, 2, "x")).to.equal("en.d 2");
	expect(__n({2: "e %s"}, null, 2, "x")).to.equal("en.e 2");
	expect(__n({one: "f %s"}, null, 2, "x")).to.equal("en.f 2");
	expect(__n("g %s", null, 2, "x")).to.equal("en.g 2");
	done();
});

test("plural special fallbacks", function (done) {
	var translator = i18n({a: "b", c: {one: "d", other: "e"}}),
		__n = translator.__n;
	expect(__n("a", 2)).to.equal("b");
	expect(__n("c", 2)).to.equal("e");
	expect(__n("g", {other: "f"}, 2)).to.equal("f");
	done();
});

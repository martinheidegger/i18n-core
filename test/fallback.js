"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	i18n = require("../"),
	expect = code.expect;

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
	expect(translator.__("a")).to.equal("en.a");
	done();
});
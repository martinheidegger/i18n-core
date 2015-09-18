"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	i18n = require("../"),
	path = require("path"),
	fsFolder = path.join(__dirname, "lookup", "fs"),
	expect = code.expect;

test("mustache testing", function (done) {
	expect(i18n({"en": {a: "{{hello}}"}}).lang("en").__("a", {hello: "d"})).to.equal("d");
	done();
});

test("args testing", function (done) {
	expect(i18n({"en": {a: "%s"}}).lang("en").__("a", "e")).to.equal("e");
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

test("empty key", function (done) {
	var translator = i18n(fsFolder);
	expect(translator.__("")).to.equal("(?)");
	done();
});

test("empty key in namespace", function (done) {
	var translator = i18n(fsFolder).lang("en");
	expect(translator.__("")).to.equal("en.");
	done();
});

test("undefined key in namespace", function (done) {
	var translator = i18n(fsFolder).lang("en");
	expect(translator.__(undefined)).to.equal("en.");
	done();
});

test("sprintf strings to be treated as strings", function (done) {
	var __ = i18n().__;
	expect(__('%s', 1)).to.equal("1");
	expect(__('%s', "01")).to.equal("01");
	expect(__('%s', false)).to.equal("false");
	expect(__('%s', "false")).to.equal("false");
	expect(__('%s', true)).to.equal("true");
	expect(__('%s', "true")).to.equal("true");
	expect(__('%s', null)).to.equal("null");
	expect(__('%s', "null")).to.equal("null");
	expect(__('%s', undefined)).to.equal("undefined");
	expect(__('%s', "undefined")).to.equal("undefined");
	done();
});

test("mustache strings to be treated as strings", function (done) {
	var __ = i18n({"$": "{{data}}"}).__;
	expect(__('$', {data: 1})).to.equal("1");
	expect(__('$', {data: "01"})).to.equal("01");
	expect(__('$', {data: false})).to.equal("false");
	expect(__('$', {data: "false"})).to.equal("false");
	expect(__('$', {data: true})).to.equal("true");
	expect(__('$', {data: "true"})).to.equal("true");
	expect(__('$', {data: null})).to.equal("");
	expect(__('$', {data: "null"})).to.equal("null");
	expect(__('$', {data: undefined})).to.equal("");
	expect(__('$', {data: "undefined"})).to.equal("undefined");
	done();
});

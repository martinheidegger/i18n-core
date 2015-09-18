"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	extend = require("../../lookup/extend"),
	i18n = require("../../"),
	expect = code.expect;

test("extend i18n", function (done) {
	var extended = extend(i18n({
		"a": "b"
	}), { get: function () {
		return "c";
	}})
	expect(extended.get("a")).to.be.equals("b");
	expect(extended.get("b")).to.be.equals("c");
	done();
});

test("extend i18n without lookup", function (done) {
	var extended = extend(i18n({
		"a": "b"
	}))
	expect(extended.get("a")).to.be.equals("b");
	expect(extended.get("b")).to.be.equals(null);
	done();
});
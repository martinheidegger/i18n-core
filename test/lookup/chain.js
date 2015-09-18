"use strict";
var code = require('code'),
	lab = exports.lab = require('lab').script(),
	test = lab.test,
	chain = require("../../lookup/chain"),
	expect = code.expect;

test("empty chain", function (done) {
	expect(chain().get("a")).to.be.equals(undefined);
	expect(chain().get("b")).to.be.equals(undefined);
	done();
});

test("chain with one element", function (done) {
	expect(chain({get: function() { return "a"; }}).get("b")).to.be.equals("a");
	done();
});

test("chain with two elements", function (done) {
	var chained = chain(
		{get: function(x) { return x === "a" ? "b" : null; }},
		{get: function(x) { return "c" }}
	);
	expect(chained.get("a")).to.be.equals("b");
	expect(chained.get("b")).to.be.equals("c");
	done();
});

test("chain with null element", function (done) {
	var chained = chain(
		{get: function(x) { return x === "a" ? "b" : null; }},
		null,
		{get: function(x) { return "c" }}
	);
	expect(chained.get("a")).to.be.equals("b");
	expect(chained.get("b")).to.be.equals("c");
	done();
});
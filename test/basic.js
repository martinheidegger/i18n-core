'use strict'
var test = require('tap').test
var i18n = require('../')
var path = require('path')
var fsFolder = path.join(__dirname, 'lookup', 'fs')

test('basic object lookup', function (t) {
  var translator = i18n({a: 'b'})
  t.equals(translator.__('a'), 'b')
  t.equals(translator.__('c'), 'c')
  t.end()
})

test('basic existance object lookup', function (t) {
  var translator = i18n({a: 'b', c: null, d: {e: 'f', g: null}})
  var d = translator.section('d')
  t.equals(translator.has('a'), true)
  t.equals(translator.has('b'), false)
  t.equals(translator.has('c'), false)
  t.equals(translator.has('d'), true)
  t.equals(d.has('e'), true)
  t.equals(d.has('g'), false)
  t.equals(d.has('h'), false)
  t.end()
})

test('get passthrough lookup', function (t) {
  var translator = i18n({a: 'b', c: null, d: {e: 'f', g: null}})
  var d = translator.section('d')
  t.equals(translator.get('a'), 'b')
  t.equals(translator.get('b'), undefined)
  t.equals(translator.get('c'), null)
  t.deepEquals(translator.get('d'), {
    e: 'f',
    g: null
  })
  t.equals(d.get('e'), 'f')
  t.equals(d.get('g'), null)
  t.equals(d.get('h'), undefined)
  t.end()
})

test('custom lookup', function (t) {
  t.equals(i18n(require('../lookup/object')({'en': {c: 'd'}})).section('en').__('c'), 'd')
  t.end()
})

test('custom function lookup', function (t) {
  t.equals(i18n(function (key) {
    t.equals(key, 'en.c')
    return 'd'
  }).section('en').__('c'), 'd')
  t.end()
})

test('section lookup', function (t) {
  var translate = i18n({
    en: {
      sectionA: {
        title: 'Curriculum Vitae'
      },
      menu: {
        about: 'About Me'
      }
    }
  })
  var lang = translate.section('en', true).lock()
  var sectionA = lang.section('sectionA')
  t.equals(lang('sectionA.title'), 'Curriculum Vitae')
  t.equals(sectionA('title'), 'Curriculum Vitae')
  var menu = sectionA.absSection('menu')
  t.equals(lang('menu.about'), 'About Me')
  t.equals(menu('about'), 'About Me')
  t.end()
})

test('basic file lookup is used when string is given', function (t) {
  t.equals(i18n(fsFolder).section('en').__('b'), 'c')
  t.end()
})

test('same translator', function (t) {
  var set = i18n()
  t.equals(set.section('en'), set.section('en'))
  t.end()
})

test('null namespace with key', function (t) {
  try {
    i18n(fsFolder).prefix(null)
  } catch (e) {
    return t.end()
  }
  throw new Error('Should not be allowed.')
})

test('undefined namespace with key', function (t) {
  try {
    i18n(fsFolder).prefix(undefined)
  } catch (e) {
    return t.end()
  }
  throw new Error('Should not be allowed.')
})

test('changing of the section should be possible after the fact if allowed', function (t) {
  var translator = i18n(fsFolder).section('en', true)
  var __ = translator.__

  t.equals(__('d'), 'e')
  translator.changeSection('gr')
  t.equals(__('d'), 'g')
  t.end()
})

test('changing of the prefix should be possible after the fact if allowed', function (t) {
  var translator = i18n(fsFolder).section('en', true)
  var __ = translator.__

  t.equals(__('d'), 'e')
  translator.changePrefix('gr.')
  t.equals(__('d'), 'g')
  t.end()
})

test('changing of the section should not be possible after the fact', function (t) {
  var translator = i18n(fsFolder).section('en')
  var __ = translator.__

  t.equals(__('d'), 'e')
  t.equals(translator.changeSection, undefined)
  try {
    translator.changeSection('gr')
  } catch (e) {
    t.equals(__('d'), 'e')
    t.end()
    return
  }
  throw new Error('Translation should be blocked.')
})

test('changing of the prefix should affect the subprefix', function (t) {
  var translator = i18n(fsFolder).prefix('g', true)
  var translator2 = translator.section('n')
  var __ = translator2.__

  translator.changePrefix('e')

  t.equals(__('d'), 'e')
  t.end()
})

test('undefined fallback', function (t) {
  var translator = i18n({a: null, b: undefined})
  t.equals(translator.__(null), '(?)')
  t.equals(translator.__(undefined), '(?)')
  t.equals(translator.__('a'), 'a')
  t.equals(translator.__('b'), 'b')
  t.end()
})

test('sprintf should be ignored when the given array has a length = 0', function (t) {
  t.equals(i18n().translate('a %2', {}, []), 'a %2')
  t.end()
})

test('An undefined prefix should work just fine', function (t) {
  t.equals(i18n({en: 'a'}).prefix('en').__(undefined), 'a')
  t.equals(i18n({en: 'a'}).prefix('en').__(null), 'a')
  t.end()
})

test('A repeated prefix should work after a changePrefix', function (t) {
  var i = i18n({
    en: {x: '1'},
    de: {x: '2'}
  })
  var enA = i.prefix('en.')
  var enB = i.prefix('en.', true)
  var enC = i.prefix('en.')
  enB.changePrefix('de.')
  t.equals(enA.__('x'), '1')
  t.equals(enB.__('x'), '2')
  t.equals(enC.__('x'), '1')
  t.end()
})

test('A repeated sub should work after a changePrefix on the first', function (t) {
  var i = i18n({
    en: {x: '1'},
    de: {x: '2'},
    ja: {x: '3'}
  })
  var enA = i.prefix('en.', true)
  var enB = i.prefix('en.')
  var enC = i.prefix('en.', true)
  enA.changePrefix('de.')
  enC.changePrefix('ja.')
  t.equals(enA.__('x'), '2')
  t.equals(enB.__('x'), '1')
  t.equals(enC.__('x'), '3')
  t.end()
})

test('multiple keys with one being an empty string', function (t) {
  var translate = i18n({'a': '', 'b': 'ho'}).translate
  t.equals(translate('a'), '')
  t.end()
})

test('events example from the documentation', function (t) {
  const parent = i18n({
    de: {site: {title: 'Meine Webseite'}},
    en: {site: {title: 'My Website'}}
  }).section('de', true)
  const translate = parent.section('site')
  t.equals(translate.__('title'), 'Meine Webseite')
  translate.on('contextChange', function () {
    t.equals(translate.__('title'), 'My Website')
    t.end()
  })
  parent.changeSection('en')
})

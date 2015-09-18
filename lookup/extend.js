"use strict";

module.exports = function i18nExtend(i18n, lookup) {
  if (lookup) {
    return {
      get: function (key) {
        return i18n.has(key) ? i18n.__(key) : lookup.get(key);
      }
    };
  }
  return {
    get: function (key) {
      return i18n.has(key) ? i18n.__(key) : null;
    }
  };
};
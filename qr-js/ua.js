"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function canMatchKeywords(e, t) {
  e = e.toLowerCase();
  var n = /[/\s;_-]/,
      o = /[/\s;_-]/;
  return t.some(function (t2) {
    var s = e.indexOf(t2.toLowerCase());
    if (s !== -1 && (n.test(e[s - 1]) || s === 0) && (o.test(e[s + t2.length]) || s + t2.length >= e.length)) return true;
  });
}

function canMatchModelRule(e, t) {
  return !!/;\s*([^;]*?)(?:\s+Build\/|\))/.test(e) && t.test(RegExp.$1);
}

function execRules(e, t) {
  var n;
  return t.some(function (t2) {
    var o,
        s = false;
    return t2.regExp ? (s = t2.regExp.test(e), s && (o = RegExp.$1)) : t2.keywords ? s = canMatchKeywords(e, t2.keywords) : t2.modelRegExp && (s = canMatchModelRule(e, t2.modelRegExp)), s && (n = {
      name: t2.name,
      version: o
    }), s;
  }), n;
}

var osRules = [{
  name: "windows",
  regExp: /\bWindows\s?NT\s?(([\d.]+))\b/
}, {
  name: "ios",
  regExp: /\bOS(?:\s([\d_.]+))?\slike\sMac\sOS\sX\b/
}, {
  name: "macos",
  regExp: /\bMac\sOS\sX(?:\s([\d_.]+))?/
}, {
  name: "android",
  regExp: /\bAndroid;?(?:[-/\s]([\d.]+))?(?:\b|_)/
}, {
  name: "android",
  regExp: /\bAdr\s([\d.]+)(?:\b|_)/
}];

function compareVersions(r, e) {
  var t = /(\.0+)+$/,
      n = String(r).replace(t, "").split("."),
      s = String(e).replace(t, "").split("."),
      i = Math.min(n.length, s.length);

  for (var r2 = 0; r2 < i; r2++) {
    var e2 = parseInt(n[r2]) - parseInt(s[r2]);
    if (e2) return e2;
  }

  return n.length - s.length;
}

var Version = /*#__PURE__*/function () {
  function Version(r) {
    _classCallCheck(this, Version);

    this._ver = (r || "").replace(/_/g, ".").replace(/\.+$/, "");
  }

  _createClass(Version, [{
    key: "_compare",
    value: function _compare(r, e) {
      if (!this._ver || !r) return false;
      var t = Array.isArray(e) ? e : [e],
          n = compareVersions(this._ver, r);
      return t.some(function (r2) {
        return n * r2 > 0 || n === 0 && r2 === 0;
      });
    }
  }, {
    key: "gt",
    value: function gt(r) {
      return this._compare(r, 1);
    }
  }, {
    key: "gte",
    value: function gte(r) {
      return this._compare(r, [1, 0]);
    }
  }, {
    key: "lt",
    value: function lt(r) {
      return this._compare(r, -1);
    }
  }, {
    key: "lte",
    value: function lte(r) {
      return this._compare(r, [-1, 0]);
    }
  }, {
    key: "eq",
    value: function eq(r) {
      return this._compare(r, 0);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this._ver;
    }
  }]);

  return Version;
}();

var propMap = {
  ios: "isIOS",
  android: "isAndroid",
  windows: "isWindows",
  macos: "isMacOS"
};

var OSInfo = /*#__PURE__*/_createClass(function OSInfo(s, o) {
  _classCallCheck(this, OSInfo);

  this.isIOS = false, this.isAndroid = false, this.isWindows = false, this.isMacOS = false;
  var i = execRules(s, osRules);
  i ? (i.name === "macos" && (o == null ? void 0 : o.maxTouchPoints) && (i.name = "ios", i.version = ""), this[propMap[i.name]] = true, this.version = Object.freeze(new Version(i.version))) : this.version = Object.freeze(new Version(""));
});

var appleRules = [{
  name: "ipad",
  regExp: /iPad/
}, {
  name: "ipod",
  regExp: /iPod/
}, {
  name: "iphone",
  regExp: /iPhone/
}];
var androidRules = [{
  name: "huawei",
  regExp: /\b(?:huawei|honor)/i
}, {
  name: "vivo",
  keywords: ["vivo"]
}, {
  name: "oppo",
  keywords: ["oppo"]
}, {
  name: "mi",
  keywords: ["redmi", "hongmi", "xiaomi", "shark"]
}, {
  name: "samsung",
  keywords: ["samsung", "galaxy"]
}, {
  name: "oneplus",
  keywords: ["oneplus", "one"]
}, {
  name: "huawei",
  modelRegExp: /^Mate\s\d{2}/
}, {
  name: "huawei",
  modelRegExp: /^Nova\s\d$/
}, {
  name: "huawei",
  modelRegExp: /^(?:CHE|CHM|Che1|VIE|BND|PAR|JKM|EML|OXF|VOG|JSN|VCE|STK|STF|BZT|YAL|INE|COR|SPN|AGS2|MAR|LYA|BKL|CLT|SEA|MHA|EVR|VKY|ANE|ALP|TIT)-/
}, {
  name: "mi",
  modelRegExp: /^MI\s?(?:\d|CC|Note|MAX|PLAY|PAD)/i
}, {
  name: "mi",
  modelRegExp: /^MIX\s\dS?/
}, {
  name: "mi",
  modelRegExp: /^(?:AWM|SKR|SKW|DLT)-/
}, {
  name: "mi",
  modelRegExp: /^M\d{4}[CJ]\d+[A-Z]+$/
}, {
  name: "samsung",
  modelRegExp: /^S(?:M|[CGP]H)-[A-Za-z0-9]+$/
}, {
  name: "samsung",
  modelRegExp: /^SC-\d{2}[A-Z]$/
}, {
  name: "samsung",
  modelRegExp: /^SH[WV]-/
}, {
  name: "samsung",
  modelRegExp: /^GT[-_][A-Z][A-Z0-9]{3,}$/i
}];
var propMap$1 = {
  ipod: "isIPod",
  iphone: "isIPhone",
  ipad: "isIPad",
  huawei: "isHuawei",
  mi: "isMi",
  oppo: "isOppo",
  vivo: "isVivo",
  oneplus: "isOnePlus",
  samsung: "isSamsung"
};

var BrandInfo = /*#__PURE__*/_createClass(function BrandInfo(i, s) {
  _classCallCheck(this, BrandInfo);

  var e;

  if (this.isHuawei = false, this.isMi = false, this.isOppo = false, this.isVivo = false, this.isOnePlus = false, this.isSamsung = false, this.isIPod = false, this.isIPhone = false, this.isIPad = false, this.isMac = false, this.isApple = false, s.isIOS ? (e = appleRules, this.isApple = true) : s.isMacOS ? (this.isMac = true, this.isApple = true) : s.isAndroid && (e = androidRules), e) {
    var o = execRules(i, e);
    o ? this[propMap$1[o.name]] = true : s.isIOS && (this.isIPad = true);
  }
});

var browserRules = [{
  name: "edge",
  regExp: /\bEdge\/([\d.]+)/
}, {
  name: "chrome",
  regExp: /\b(?:Chrome|CrMo|CriOS)\/([\d.]+)/
}, {
  name: "safari",
  regExp: /\b(?:Version\/([\d.]+).*\s?)?Safari\b/
}, {
  name: "ie",
  regExp: /\bMSIE\s(\d+)/i
}, {
  name: "ie",
  regExp: /\bTrident\/.*;\srv:(\d+)/
}, {
  name: "firefox",
  regExp: /\bFirefox\/([\d.]+)/
}, {
  name: "opera-presto",
  regExp: /\bOpera\/([\d.]+)/
}];
var propMap$2 = {
  chrome: "isChrome",
  safari: "isSafari",
  edge: "isEdge",
  ie: "isIE",
  firefox: "isFirefox",
  "opera-presto": "isPrestoOpera"
};

var BrowserInfo = /*#__PURE__*/_createClass(function BrowserInfo(e) {
  _classCallCheck(this, BrowserInfo);

  this.isChrome = false, this.isSafari = false, this.isEdge = false, this.isIE = false, this.isFirefox = false, this.isPrestoOpera = false;
  var s = execRules(e, browserRules);
  s ? (this[propMap$2[s.name]] = true, this.version = new Version(s.version)) : this.version = new Version(""), Object.freeze(this.version);
});

var clientRules = [{
  name: "wxwork",
  regExp: /\bwxwork\/([\d.]+)/
}, {
  name: "wx",
  regExp: /\bMicroMessenger\/([\d.]+)/
}, {
  name: "ding",
  regExp: /\bDingTalk\/([\d.]+)/
}, {
  name: "qq",
  regExp: /\bQQ\/([\d.]+)/
}, {
  name: "qq",
  regExp: /\bIPadQQ\b/
}, {
  name: "weibo",
  regExp: /(?:\b|_)Weibo(?:\b|_)/i
}, {
  name: "edge",
  regExp: /\bEdge?\/([\d.]+)/
}, {
  name: "opera-blink",
  regExp: /\bOPR\/([\d.]+)/
}, {
  name: "qqbrowser",
  regExp: /\bM?QQBrowser(?:\/([\d.]+))?/i
}, {
  name: "ucbrowser",
  regExp: /\b(?:UCBrowser|UCWEB)(?:-CMCC)?\/?\s?([\d.]+)/
}, {
  name: "ucbrowser",
  regExp: /\bUC\b/
}, {
  name: "quark",
  regExp: /\bQuark\/([\d.]+)/
}, {
  name: "maxthon",
  regExp: /\b(?:Maxthon|MxBrowser)(?:[/\s]([\d.]+))?/
}, {
  name: "theworld",
  regExp: /\bTheWorld(?:\s([\d.]+))?/i
}, {
  name: "baidubrowser",
  regExp: /\b(?:baidubrowser|bdbrowser_i18n|BIDUBrowser)(?:[/\s]([\d.]+))?/i
}, {
  name: "baidubrowser",
  regExp: /\bbaidubrowserpad\b/
}, {
  name: "baiduapp",
  regExp: /\bbaiduboxapp\b\/([\d.]+)?/i
}, {
  name: "baiduapp",
  regExp: /\bbaiduboxpad\b/i
}];
clientRules = clientRules.concat(browserRules);
var propMap$3 = {
  wxwork: "isWxWork",
  wx: "isWx",
  ding: "isDing",
  qq: "isQQ",
  weibo: "isWeibo",
  edge: "isEdge",
  "opera-blink": "isOpera",
  "opera-presto": "isOpera",
  qqbrowser: "isQQBrowser",
  ucbrowser: "isUCBrowser",
  quark: "isQuark",
  maxthon: "isMaxthon",
  theworld: "isTheWorld",
  baidubrowser: "isBaiduBrowser",
  baiduapp: "isBaiduApp",
  chrome: "isChrome",
  safari: "isSafari",
  ie: "isIE",
  firefox: "isFirefox"
};

var ClientInfo = /*#__PURE__*/_createClass(function ClientInfo(i) {
  _classCallCheck(this, ClientInfo);

  this.isWxWork = false, this.isWx = false, this.isDing = false, this.isQQ = false, this.isWeibo = false, this.isEdge = false, this.isOpera = false, this.isQQBrowser = false, this.isUCBrowser = false, this.isQuark = false, this.isMaxthon = false, this.isTheWorld = false, this.isBaiduBrowser = false, this.isBaiduApp = false, this.isChrome = false, this.isSafari = false, this.isIE = false, this.isFirefox = false;
  var s = execRules(i, clientRules);
  s ? (this[propMap$3[s.name]] = true, this.version = new Version(s.version)) : this.version = new Version(""), Object.freeze(this.version);
});

var UAInfo = /*#__PURE__*/_createClass(function UAInfo(o, e) {
  _classCallCheck(this, UAInfo);

  this.os = Object.freeze(new OSInfo(o, e)), this.brand = Object.freeze(new BrandInfo(o, this.os)), this.browser = Object.freeze(new BrowserInfo(o)), this.client = Object.freeze(new ClientInfo(o)), this.isPortable = /mobile|android/i.test(o) || !/\b(Windows\sNT|Macintosh|Linux)\b/.test(o), (this.os.isIOS || this.os.isAndroid) && (this.isPortable = true);
});

var currentUAInfo;

function getCurrentUAInfo() {
  return currentUAInfo || (currentUAInfo = Object.freeze(typeof window != "undefined" ? new UAInfo(window.navigator.userAgent, window.navigator) : new UAInfo(""))), currentUAInfo;
}

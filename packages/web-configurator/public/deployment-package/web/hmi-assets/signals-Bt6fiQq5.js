import { l as l$3, x, t as t$2 } from "./vendor-YOiOz27F.js";
var t$1, r, u$1, i$1, o$1 = 0, f$1 = [], c$1 = l$3, e$1 = c$1.__b, a$1 = c$1.__r, v$2 = c$1.diffed, l$2 = c$1.__c, m = c$1.unmount, s$2 = c$1.__;
function p$2(n2, t2) {
  c$1.__h && c$1.__h(r, n2, o$1 || t2), o$1 = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function d$2(n2) {
  return o$1 = 1, h$2(D, n2);
}
function h$2(n2, u2, i2) {
  var o2 = p$2(t$1++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [D(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r, !r.__f)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = o2.__c.props !== n3;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), c2 && c2.call(this, n3, t2, r2) || i3;
    };
    r.__f = true;
    var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y$1(n2, u2) {
  var i2 = p$2(t$1++, 3);
  !c$1.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
}
function A(n2) {
  return o$1 = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = p$2(t$1++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function j() {
  for (var n2; n2 = f$1.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z), n2.__H.__h.forEach(B), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], c$1.__e(t2, n2.__v);
  }
}
c$1.__b = function(n2) {
  r = null, e$1 && e$1(n2);
}, c$1.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$2 && s$2(n2, t2);
}, c$1.__r = function(n2) {
  a$1 && a$1(n2), t$1 = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u$1 === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t$1 = 0)), u$1 = r;
}, c$1.diffed = function(n2) {
  v$2 && v$2(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f$1.push(t2) && i$1 === c$1.requestAnimationFrame || ((i$1 = c$1.requestAnimationFrame) || w$1)(j)), t2.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u$1 = r = null;
}, c$1.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c$1.__e(r2, n3.__v);
    }
  }), l$2 && l$2(n2, t2);
}, c$1.unmount = function(n2) {
  m && m(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w$1(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
var i = Symbol.for("preact-signals");
function t() {
  if (!(s$1 > 1)) {
    var i2, t2 = false;
    while (void 0 !== h$1) {
      var r2 = h$1;
      h$1 = void 0;
      f++;
      while (void 0 !== r2) {
        var o2 = r2.o;
        r2.o = void 0;
        r2.f &= -3;
        if (!(8 & r2.f) && c(r2)) try {
          r2.c();
        } catch (r3) {
          if (!t2) {
            i2 = r3;
            t2 = true;
          }
        }
        r2 = o2;
      }
    }
    f = 0;
    s$1--;
    if (t2) throw i2;
  } else s$1--;
}
var o = void 0;
function n(i2) {
  var t2 = o;
  o = void 0;
  try {
    return i2();
  } finally {
    o = t2;
  }
}
var h$1 = void 0, s$1 = 0, f = 0, v$1 = 0;
function e(i2) {
  if (void 0 !== o) {
    var t2 = i2.n;
    if (void 0 === t2 || t2.t !== o) {
      t2 = { i: 0, S: i2, p: o.s, n: void 0, t: o, e: void 0, x: void 0, r: t2 };
      if (void 0 !== o.s) o.s.n = t2;
      o.s = t2;
      i2.n = t2;
      if (32 & o.f) i2.S(t2);
      return t2;
    } else if (-1 === t2.i) {
      t2.i = 0;
      if (void 0 !== t2.n) {
        t2.n.p = t2.p;
        if (void 0 !== t2.p) t2.p.n = t2.n;
        t2.p = o.s;
        t2.n = void 0;
        o.s.n = t2;
        o.s = t2;
      }
      return t2;
    }
  }
}
function u(i2, t2) {
  this.v = i2;
  this.i = 0;
  this.n = void 0;
  this.t = void 0;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
u.prototype.brand = i;
u.prototype.h = function() {
  return true;
};
u.prototype.S = function(i2) {
  var t2 = this, r2 = this.t;
  if (r2 !== i2 && void 0 === i2.e) {
    i2.x = r2;
    this.t = i2;
    if (void 0 !== r2) r2.e = i2;
    else n(function() {
      var i3;
      null == (i3 = t2.W) || i3.call(t2);
    });
  }
};
u.prototype.U = function(i2) {
  var t2 = this;
  if (void 0 !== this.t) {
    var r2 = i2.e, o2 = i2.x;
    if (void 0 !== r2) {
      r2.x = o2;
      i2.e = void 0;
    }
    if (void 0 !== o2) {
      o2.e = r2;
      i2.x = void 0;
    }
    if (i2 === this.t) {
      this.t = o2;
      if (void 0 === o2) n(function() {
        var i3;
        null == (i3 = t2.Z) || i3.call(t2);
      });
    }
  }
};
u.prototype.subscribe = function(i2) {
  var t2 = this;
  return E(function() {
    var r2 = t2.value, n2 = o;
    o = void 0;
    try {
      i2(r2);
    } finally {
      o = n2;
    }
  }, { name: "sub" });
};
u.prototype.valueOf = function() {
  return this.value;
};
u.prototype.toString = function() {
  return this.value + "";
};
u.prototype.toJSON = function() {
  return this.value;
};
u.prototype.peek = function() {
  var i2 = o;
  o = void 0;
  try {
    return this.value;
  } finally {
    o = i2;
  }
};
Object.defineProperty(u.prototype, "value", { get: function() {
  var i2 = e(this);
  if (void 0 !== i2) i2.i = this.i;
  return this.v;
}, set: function(i2) {
  if (i2 !== this.v) {
    if (f > 100) throw new Error("Cycle detected");
    this.v = i2;
    this.i++;
    v$1++;
    s$1++;
    try {
      for (var r2 = this.t; void 0 !== r2; r2 = r2.x) r2.t.N();
    } finally {
      t();
    }
  }
} });
function d$1(i2, t2) {
  return new u(i2, t2);
}
function c(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) if (t2.S.i !== t2.i || !t2.S.h() || t2.S.i !== t2.i) return true;
  return false;
}
function a(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) {
    var r2 = t2.S.n;
    if (void 0 !== r2) t2.r = r2;
    t2.S.n = t2;
    t2.i = -1;
    if (void 0 === t2.n) {
      i2.s = t2;
      break;
    }
  }
}
function l$1(i2) {
  var t2 = i2.s, r2 = void 0;
  while (void 0 !== t2) {
    var o2 = t2.p;
    if (-1 === t2.i) {
      t2.S.U(t2);
      if (void 0 !== o2) o2.n = t2.n;
      if (void 0 !== t2.n) t2.n.p = o2;
    } else r2 = t2;
    t2.S.n = t2.r;
    if (void 0 !== t2.r) t2.r = void 0;
    t2 = o2;
  }
  i2.s = r2;
}
function y(i2, t2) {
  u.call(this, void 0);
  this.x = i2;
  this.s = void 0;
  this.g = v$1 - 1;
  this.f = 4;
  this.W = null == t2 ? void 0 : t2.watched;
  this.Z = null == t2 ? void 0 : t2.unwatched;
  this.name = null == t2 ? void 0 : t2.name;
}
y.prototype = new u();
y.prototype.h = function() {
  this.f &= -3;
  if (1 & this.f) return false;
  if (32 == (36 & this.f)) return true;
  this.f &= -5;
  if (this.g === v$1) return true;
  this.g = v$1;
  this.f |= 1;
  if (this.i > 0 && !c(this)) {
    this.f &= -2;
    return true;
  }
  var i2 = o;
  try {
    a(this);
    o = this;
    var t2 = this.x();
    if (16 & this.f || this.v !== t2 || 0 === this.i) {
      this.v = t2;
      this.f &= -17;
      this.i++;
    }
  } catch (i3) {
    this.v = i3;
    this.f |= 16;
    this.i++;
  }
  o = i2;
  l$1(this);
  this.f &= -2;
  return true;
};
y.prototype.S = function(i2) {
  if (void 0 === this.t) {
    this.f |= 36;
    for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.S(t2);
  }
  u.prototype.S.call(this, i2);
};
y.prototype.U = function(i2) {
  if (void 0 !== this.t) {
    u.prototype.U.call(this, i2);
    if (void 0 === this.t) {
      this.f &= -33;
      for (var t2 = this.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
    }
  }
};
y.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 6;
    for (var i2 = this.t; void 0 !== i2; i2 = i2.x) i2.t.N();
  }
};
Object.defineProperty(y.prototype, "value", { get: function() {
  if (1 & this.f) throw new Error("Cycle detected");
  var i2 = e(this);
  this.h();
  if (void 0 !== i2) i2.i = this.i;
  if (16 & this.f) throw this.v;
  return this.v;
} });
function w(i2, t2) {
  return new y(i2, t2);
}
function _(i2) {
  var r2 = i2.u;
  i2.u = void 0;
  if ("function" == typeof r2) {
    s$1++;
    var n2 = o;
    o = void 0;
    try {
      r2();
    } catch (t2) {
      i2.f &= -2;
      i2.f |= 8;
      b(i2);
      throw t2;
    } finally {
      o = n2;
      t();
    }
  }
}
function b(i2) {
  for (var t2 = i2.s; void 0 !== t2; t2 = t2.n) t2.S.U(t2);
  i2.x = void 0;
  i2.s = void 0;
  _(i2);
}
function g(i2) {
  if (o !== this) throw new Error("Out-of-order effect");
  l$1(this);
  o = i2;
  this.f &= -2;
  if (8 & this.f) b(this);
  t();
}
function p$1(i2, t2) {
  this.x = i2;
  this.u = void 0;
  this.s = void 0;
  this.o = void 0;
  this.f = 32;
  this.name = null == t2 ? void 0 : t2.name;
}
p$1.prototype.c = function() {
  var i2 = this.S();
  try {
    if (8 & this.f) return;
    if (void 0 === this.x) return;
    var t2 = this.x();
    if ("function" == typeof t2) this.u = t2;
  } finally {
    i2();
  }
};
p$1.prototype.S = function() {
  if (1 & this.f) throw new Error("Cycle detected");
  this.f |= 1;
  this.f &= -9;
  _(this);
  a(this);
  s$1++;
  var i2 = o;
  o = this;
  return g.bind(this, i2);
};
p$1.prototype.N = function() {
  if (!(2 & this.f)) {
    this.f |= 2;
    this.o = h$1;
    h$1 = this;
  }
};
p$1.prototype.d = function() {
  this.f |= 8;
  if (!(1 & this.f)) b(this);
};
p$1.prototype.dispose = function() {
  this.d();
};
function E(i2, t2) {
  var r2 = new p$1(i2, t2);
  try {
    r2.c();
  } catch (i3) {
    r2.d();
    throw i3;
  }
  var o2 = r2.d.bind(r2);
  o2[Symbol.dispose] = o2;
  return o2;
}
var v, s;
function l(i2, n2) {
  l$3[i2] = n2.bind(null, l$3[i2] || function() {
  });
}
function d(i2) {
  if (s) s();
  s = i2 && i2.S();
}
function h(i2) {
  var r2 = this, f2 = i2.data, o2 = useSignal(f2);
  o2.value = f2;
  var e2 = T(function() {
    var i3 = r2.__v;
    while (i3 = i3.__) if (i3.__c) {
      i3.__c.__$f |= 4;
      break;
    }
    r2.__$u.c = function() {
      var i4, t2 = r2.__$u.S(), f3 = e2.value;
      t2();
      if (t$2(f3) || 3 !== (null == (i4 = r2.base) ? void 0 : i4.nodeType)) {
        r2.__$f |= 1;
        r2.setState({});
      } else r2.base.data = f3;
    };
    return w(function() {
      var i4 = o2.value.value;
      return 0 === i4 ? 0 : true === i4 ? "" : i4 || "";
    });
  }, []);
  return e2.value;
}
h.displayName = "_st";
Object.defineProperties(u.prototype, { constructor: { configurable: true, value: void 0 }, type: { configurable: true, value: h }, props: { configurable: true, get: function() {
  return { data: this };
} }, __b: { configurable: true, value: 1 } });
l("__b", function(i2, r2) {
  if ("string" == typeof r2.type) {
    var n2, t2 = r2.props;
    for (var f2 in t2) if ("children" !== f2) {
      var o2 = t2[f2];
      if (o2 instanceof u) {
        if (!n2) r2.__np = n2 = {};
        n2[f2] = o2;
        t2[f2] = o2.peek();
      }
    }
  }
  i2(r2);
});
l("__r", function(i2, r2) {
  d();
  var n2, t2 = r2.__c;
  if (t2) {
    t2.__$f &= -2;
    if (void 0 === (n2 = t2.__$u)) t2.__$u = n2 = function(i3) {
      var r3;
      E(function() {
        r3 = this;
      });
      r3.c = function() {
        t2.__$f |= 1;
        t2.setState({});
      };
      return r3;
    }();
  }
  v = t2;
  d(n2);
  i2(r2);
});
l("__e", function(i2, r2, n2, t2) {
  d();
  v = void 0;
  i2(r2, n2, t2);
});
l("diffed", function(i2, r2) {
  d();
  v = void 0;
  var n2;
  if ("string" == typeof r2.type && (n2 = r2.__e)) {
    var t2 = r2.__np, f2 = r2.props;
    if (t2) {
      var o2 = n2.U;
      if (o2) for (var e2 in o2) {
        var u2 = o2[e2];
        if (void 0 !== u2 && !(e2 in t2)) {
          u2.d();
          o2[e2] = void 0;
        }
      }
      else n2.U = o2 = {};
      for (var a2 in t2) {
        var c2 = o2[a2], s2 = t2[a2];
        if (void 0 === c2) {
          c2 = p(n2, a2, s2, f2);
          o2[a2] = c2;
        } else c2.o(s2, f2);
      }
    }
  }
  i2(r2);
});
function p(i2, r2, n2, t2) {
  var f2 = r2 in i2 && void 0 === i2.ownerSVGElement, o2 = d$1(n2);
  return { o: function(i3, r3) {
    o2.value = i3;
    t2 = r3;
  }, d: E(function() {
    var n3 = o2.value.value;
    if (t2[r2] !== n3) {
      t2[r2] = n3;
      if (f2) i2[r2] = n3;
      else if (n3) i2.setAttribute(r2, n3);
      else i2.removeAttribute(r2);
    }
  }) };
}
l("unmount", function(i2, r2) {
  if ("string" == typeof r2.type) {
    var n2 = r2.__e;
    if (n2) {
      var t2 = n2.U;
      if (t2) {
        n2.U = void 0;
        for (var f2 in t2) {
          var o2 = t2[f2];
          if (o2) o2.d();
        }
      }
    }
  } else {
    var e2 = r2.__c;
    if (e2) {
      var u2 = e2.__$u;
      if (u2) {
        e2.__$u = void 0;
        u2.d();
      }
    }
  }
  i2(r2);
});
l("__h", function(i2, r2, n2, t2) {
  if (t2 < 3 || 9 === t2) r2.__$f |= 2;
  i2(r2, n2, t2);
});
x.prototype.shouldComponentUpdate = function(i2, r2) {
  var n2 = this.__$u, t2 = n2 && void 0 !== n2.s;
  for (var f2 in r2) return true;
  if (this.__f || "boolean" == typeof this.u && true === this.u) {
    if (!(t2 || 2 & this.__$f || 4 & this.__$f)) return true;
    if (1 & this.__$f) return true;
  } else {
    if (!(t2 || 4 & this.__$f)) return true;
    if (3 & this.__$f) return true;
  }
  for (var o2 in i2) if ("__source" !== o2 && i2[o2] !== this.props[o2]) return true;
  for (var e2 in this.props) if (!(e2 in i2)) return true;
  return false;
};
function useSignal(i2) {
  return T(function() {
    return d$1(i2);
  }, []);
}
function useComputed(i2) {
  var r2 = A(i2);
  r2.current = i2;
  v.__$f |= 4;
  return T(function() {
    return w(function() {
      return r2.current();
    });
  }, []);
}
export {
  A,
  d$2 as a,
  useSignal as b,
  d$1 as d,
  useComputed as u,
  y$1 as y
};

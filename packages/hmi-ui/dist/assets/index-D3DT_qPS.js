var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { l, k, G } from "./vendor-YOiOz27F.js";
import { d, u as useComputed, a as d$1, b as useSignal, A, y } from "./signals-Bt6fiQq5.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var f = 0;
function u(e, t, n, o, i, u2) {
  t || (t = {});
  var a, c, p = t;
  if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
  var l$1 = { type: e, props: p, key: n, ref: a, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i, __self: u2 };
  if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
  return l.vnode && l.vnode(l$1), l$1;
}
const schemaSignal = d(null);
const isLoadingSignal = d(false);
const errorSignal = d(null);
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k2) => typeof obj[obj[k2]] !== "number");
    const filtered = {};
    for (const k2 of validKeys) {
      filtered[k2] = obj[k2];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return __spreadValues(__spreadValues({}, first), second);
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
const getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = __spreadProps(__spreadValues({}, issueData), {
    path: fullPath
  });
  if (issueData.message !== void 0) {
    return __spreadProps(__spreadValues({}, issueData), {
      path: fullPath,
      message: issueData.message
    });
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return __spreadProps(__spreadValues({}, issueData), {
    path: fullPath,
    message: errorMessage
  });
};
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
const INVALID = Object.freeze({
  status: "aborted"
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message != null ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message != null ? message : required_error) != null ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message != null ? message : invalid_type_error) != null ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params == null ? void 0 : params.async) != null ? _a : false,
        contextualErrorMap: params == null ? void 0 : params.errorMap
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err == null ? void 0 : err.message) == null ? void 0 : _a.toLowerCase()) == null ? void 0 : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params == null ? void 0 : params.errorMap,
        async: true
      },
      path: (params == null ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue(__spreadValues({
        code: ZodIssueCode.custom
      }, getIssueProperties(val)));
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    }));
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    }));
  }
  brand() {
    return new ZodBranded(__spreadValues({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this
    }, processCreateParams(this._def)));
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch(__spreadProps(__spreadValues({}, processCreateParams(this._def)), {
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    }));
  }
  describe(description) {
    const This = this.constructor;
    return new This(__spreadProps(__spreadValues({}, this._def), {
      description
    }));
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (e) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (e) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), __spreadValues({
      validation,
      code: ZodIssueCode.invalid_string
    }, errorUtil.errToObj(message)));
  }
  _addCheck(check) {
    return new ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  email(message) {
    return this._addCheck(__spreadValues({ kind: "email" }, errorUtil.errToObj(message)));
  }
  url(message) {
    return this._addCheck(__spreadValues({ kind: "url" }, errorUtil.errToObj(message)));
  }
  emoji(message) {
    return this._addCheck(__spreadValues({ kind: "emoji" }, errorUtil.errToObj(message)));
  }
  uuid(message) {
    return this._addCheck(__spreadValues({ kind: "uuid" }, errorUtil.errToObj(message)));
  }
  nanoid(message) {
    return this._addCheck(__spreadValues({ kind: "nanoid" }, errorUtil.errToObj(message)));
  }
  cuid(message) {
    return this._addCheck(__spreadValues({ kind: "cuid" }, errorUtil.errToObj(message)));
  }
  cuid2(message) {
    return this._addCheck(__spreadValues({ kind: "cuid2" }, errorUtil.errToObj(message)));
  }
  ulid(message) {
    return this._addCheck(__spreadValues({ kind: "ulid" }, errorUtil.errToObj(message)));
  }
  base64(message) {
    return this._addCheck(__spreadValues({ kind: "base64" }, errorUtil.errToObj(message)));
  }
  base64url(message) {
    return this._addCheck(__spreadValues({
      kind: "base64url"
    }, errorUtil.errToObj(message)));
  }
  jwt(options) {
    return this._addCheck(__spreadValues({ kind: "jwt" }, errorUtil.errToObj(options)));
  }
  ip(options) {
    return this._addCheck(__spreadValues({ kind: "ip" }, errorUtil.errToObj(options)));
  }
  cidr(options) {
    return this._addCheck(__spreadValues({ kind: "cidr" }, errorUtil.errToObj(options)));
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck(__spreadValues({
      kind: "datetime",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
      offset: (_a = options == null ? void 0 : options.offset) != null ? _a : false,
      local: (_b = options == null ? void 0 : options.local) != null ? _b : false
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck(__spreadValues({
      kind: "time",
      precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  duration(message) {
    return this._addCheck(__spreadValues({ kind: "duration" }, errorUtil.errToObj(message)));
  }
  regex(regex, message) {
    return this._addCheck(__spreadValues({
      kind: "regex",
      regex
    }, errorUtil.errToObj(message)));
  }
  includes(value, options) {
    return this._addCheck(__spreadValues({
      kind: "includes",
      value,
      position: options == null ? void 0 : options.position
    }, errorUtil.errToObj(options == null ? void 0 : options.message)));
  }
  startsWith(value, message) {
    return this._addCheck(__spreadValues({
      kind: "startsWith",
      value
    }, errorUtil.errToObj(message)));
  }
  endsWith(value, message) {
    return this._addCheck(__spreadValues({
      kind: "endsWith",
      value
    }, errorUtil.errToObj(message)));
  }
  min(minLength, message) {
    return this._addCheck(__spreadValues({
      kind: "min",
      value: minLength
    }, errorUtil.errToObj(message)));
  }
  max(maxLength, message) {
    return this._addCheck(__spreadValues({
      kind: "max",
      value: maxLength
    }, errorUtil.errToObj(message)));
  }
  length(len, message) {
    return this._addCheck(__spreadValues({
      kind: "length",
      value: len
    }, errorUtil.errToObj(message)));
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "trim" }]
    }));
  }
  toLowerCase() {
    return new ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    }));
  }
  toUpperCase() {
    return new ZodString(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    }));
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  var _a;
  return new ZodString(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false
  }, processCreateParams(params)));
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber(__spreadProps(__spreadValues({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    }));
  }
  _addCheck(check) {
    return new ZodNumber(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params == null ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (e) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt(__spreadProps(__spreadValues({}, this._def), {
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    }));
  }
  _addCheck(check) {
    return new ZodBigInt(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt(__spreadValues({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false
  }, processCreateParams(params)));
};
class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params == null ? void 0 : params.coerce) || false
  }, processCreateParams(params)));
};
class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate(__spreadProps(__spreadValues({}, this._def), {
      checks: [...this._def.checks, check]
    }));
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate(__spreadValues({
    checks: [],
    coerce: (params == null ? void 0 : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate
  }, processCreateParams(params)));
};
class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodSymbol
  }, processCreateParams(params)));
};
class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodUndefined
  }, processCreateParams(params)));
};
class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNull
  }, processCreateParams(params)));
};
class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodAny
  }, processCreateParams(params)));
};
class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodUnknown
  }, processCreateParams(params)));
};
class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNever
  }, processCreateParams(params)));
};
class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodVoid
  }, processCreateParams(params)));
};
class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray(__spreadProps(__spreadValues({}, this._def), {
      minLength: { value: minLength, message: errorUtil.toString(message) }
    }));
  }
  max(maxLength, message) {
    return new ZodArray(__spreadProps(__spreadValues({}, this._def), {
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    }));
  }
  length(len, message) {
    return new ZodArray(__spreadProps(__spreadValues({}, this._def), {
      exactLength: { value: len, message: errorUtil.toString(message) }
    }));
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray(__spreadValues({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray
  }, processCreateParams(params)));
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject(__spreadProps(__spreadValues({}, schema._def), {
      shape: () => newShape
    }));
  } else if (schema instanceof ZodArray) {
    return new ZodArray(__spreadProps(__spreadValues({}, schema._def), {
      type: deepPartialify(schema.element)
    }));
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject(__spreadValues(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "strict"
    }), message !== void 0 ? {
      errorMap: (issue, ctx) => {
        var _a, _b, _c, _d;
        const defaultError = (_c = (_b = (_a = this._def).errorMap) == null ? void 0 : _b.call(_a, issue, ctx).message) != null ? _c : ctx.defaultError;
        if (issue.code === "unrecognized_keys")
          return {
            message: (_d = errorUtil.errToObj(message).message) != null ? _d : defaultError
          };
        return {
          message: defaultError
        };
      }
    } : {}));
  }
  strip() {
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "strip"
    }));
  }
  passthrough() {
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      unknownKeys: "passthrough"
    }));
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: () => __spreadValues(__spreadValues({}, this._def.shape()), augmentation)
    }));
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => __spreadValues(__spreadValues({}, this._def.shape()), merging._def.shape()),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      catchall: index
    }));
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: () => shape
    }));
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: () => shape
    }));
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: () => newShape
    }));
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject(__spreadProps(__spreadValues({}, this._def), {
      shape: () => newShape
    }));
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject(__spreadValues({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject
  }, processCreateParams(params)));
};
class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = __spreadProps(__spreadValues({}, ctx), {
          common: __spreadProps(__spreadValues({}, ctx.common), {
            issues: []
          }),
          parent: null
        });
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = __spreadProps(__spreadValues({}, ctx), {
          common: __spreadProps(__spreadValues({}, ctx.common), {
            issues: []
          }),
          parent: null
        });
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion(__spreadValues({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion
  }, processCreateParams(params)));
};
const getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion(__spreadValues({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap
    }, processCreateParams(params)));
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = __spreadValues(__spreadValues({}, a), b);
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection(__spreadValues({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection
  }, processCreateParams(params)));
};
class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple(__spreadProps(__spreadValues({}, this._def), {
      rest
    }));
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple(__spreadValues({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null
  }, processCreateParams(params)));
};
class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord(__spreadValues({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord
      }, processCreateParams(third)));
    }
    return new ZodRecord(__spreadValues({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord
    }, processCreateParams(second)));
  }
}
class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap(__spreadValues({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap
  }, processCreateParams(params)));
};
class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet(__spreadProps(__spreadValues({}, this._def), {
      minSize: { value: minSize, message: errorUtil.toString(message) }
    }));
  }
  max(maxSize, message) {
    return new ZodSet(__spreadProps(__spreadValues({}, this._def), {
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    }));
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet(__spreadValues({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet
  }, processCreateParams(params)));
};
class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy(__spreadValues({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy
  }, processCreateParams(params)));
};
class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral(__spreadValues({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral
  }, processCreateParams(params)));
};
function createZodEnum(values, params) {
  return new ZodEnum(__spreadValues({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum
  }, processCreateParams(params)));
}
class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, __spreadValues(__spreadValues({}, this._def), newDef));
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), __spreadValues(__spreadValues({}, this._def), newDef));
  }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum(__spreadValues({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum
  }, processCreateParams(params)));
};
class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise(__spreadValues({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise
  }, processCreateParams(params)));
};
class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects(__spreadValues({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect
  }, processCreateParams(params)));
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects(__spreadValues({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects
  }, processCreateParams(params)));
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional
  }, processCreateParams(params)));
};
class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable
  }, processCreateParams(params)));
};
class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default
  }, processCreateParams(params)));
};
class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = __spreadProps(__spreadValues({}, ctx), {
      common: __spreadProps(__spreadValues({}, ctx.common), {
        issues: []
      })
    });
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: __spreadValues({}, newCtx)
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch
  }, processCreateParams(params)));
};
class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN(__spreadValues({
    typeName: ZodFirstPartyTypeKind.ZodNaN
  }, processCreateParams(params)));
};
class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}
class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly(__spreadValues({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly
  }, processCreateParams(params)));
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const booleanType = ZodBoolean.create;
const unknownType = ZodUnknown.create;
ZodNever.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
ZodIntersection.create;
ZodTuple.create;
const recordType = ZodRecord.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
ZodPromise.create;
ZodOptional.create;
ZodNullable.create;
const MetadataSchema = objectType({
  name: stringType().min(1).max(100),
  description: stringType().max(500).optional(),
  version: stringType().regex(/^\d+\.\d+\.\d+$/, "Version must be semantic version (x.y.z)"),
  author: stringType().max(100).optional(),
  createdAt: stringType().datetime().optional(),
  updatedAt: stringType().datetime().optional()
});
const ThemeConfigSchema = objectType({
  preset: enumType(["blue", "purple", "green", "orange", "red", "dark", "light"]).default("blue"),
  // Optional: Allow custom overrides
  customColors: objectType({
    primary: stringType().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondary: stringType().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    accent: stringType().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    background: stringType().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    text: stringType().regex(/^#[0-9A-Fa-f]{6}$/).optional()
  }).optional()
}).default({ preset: "blue" });
const SubtabConfigSchema = objectType({
  enabled: booleanType().default(true),
  title: stringType().min(1).max(30).default("Subtab"),
  icon: stringType().optional()
});
const LightingTabConfigSchema = objectType({
  interior: SubtabConfigSchema.default({
    enabled: true,
    title: "Interior",
    icon: "💡"
  }),
  exterior: SubtabConfigSchema.default({
    enabled: true,
    title: "Exterior",
    icon: "🌟"
  }),
  rgb: SubtabConfigSchema.default({
    enabled: false,
    // Disabled by default, enabled when RGB modules are configured
    title: "RGB",
    icon: "🌈"
  })
}).default({
  interior: { enabled: true, title: "Interior", icon: "💡" },
  exterior: { enabled: true, title: "Exterior", icon: "🌟" },
  rgb: { enabled: false, title: "RGB", icon: "🌈" }
});
const HVACTabConfigSchema = objectType({
  heating: SubtabConfigSchema.default({
    enabled: false,
    // Auto-enabled when hvac.heating.enabled is true
    title: "Heating",
    icon: "🔥"
  }),
  cooling: SubtabConfigSchema.default({
    enabled: false,
    // Auto-enabled when hvac.cooling.enabled is true
    title: "Cooling",
    icon: "❄️"
  }),
  ventilation: SubtabConfigSchema.default({
    enabled: false,
    // Auto-enabled when hvac.ventilation.enabled is true
    title: "Ventilation",
    icon: "💨"
  })
}).default({
  heating: { enabled: false, title: "Heating", icon: "🔥" },
  cooling: { enabled: false, title: "Cooling", icon: "❄️" },
  ventilation: { enabled: false, title: "Ventilation", icon: "💨" }
});
const SwitchingTabConfigSchema = objectType({
  switches: SubtabConfigSchema.default({
    enabled: true,
    title: "Switches",
    icon: "🔌"
  }),
  accessories: SubtabConfigSchema.default({
    enabled: true,
    title: "Accessories",
    icon: "⚡"
  }),
  customSection: objectType({
    enabled: booleanType().default(true),
    title: stringType().min(1).max(30).default("Custom Controls")
  }).default({
    enabled: true,
    title: "Custom Controls"
  }).optional()
  // Keep for backwards compatibility
}).default({
  switches: { enabled: true, title: "Switches", icon: "🔌" },
  accessories: { enabled: true, title: "Accessories", icon: "⚡" }
});
const PlumbingTabConfigSchema = objectType({
  switchingSection: objectType({
    enabled: booleanType().default(false),
    title: stringType().min(1).max(30).default("Plumbing Controls")
  }).default({
    enabled: false,
    title: "Plumbing Controls"
  })
}).default({
  switchingSection: { enabled: false, title: "Plumbing Controls" }
});
const HardwareSystemTypeSchema = enumType(["core", "core-lite"]);
const OutputControlTypeSchema = enumType([
  "not-used",
  "push-button",
  "toggle-button",
  "slider",
  "half-bridge",
  "dimmer",
  "special-function"
]);
const HardwareSourceSchema = enumType(["core", "core-lite", "genesis"]);
const OutputChannelSchema = objectType({
  id: stringType(),
  // e.g., "core-01", "core-lite-02", "genesis-01"
  source: HardwareSourceSchema,
  channel: numberType().int().positive(),
  label: stringType().max(50).optional(),
  control: OutputControlTypeSchema.default("not-used"),
  icon: stringType().optional(),
  signalId: numberType().int().positive().optional(),
  signals: objectType({
    toggle: numberType().int().positive().nullable().optional(),
    momentary: numberType().int().positive().nullable().optional(),
    dimmer: numberType().int().positive().nullable().optional()
  }).optional(),
  range: objectType({
    min: numberType(),
    max: numberType(),
    step: numberType().positive()
  }).optional()
});
const HalfBridgePairSchema = objectType({
  source: HardwareSourceSchema,
  channelA: numberType().int().positive(),
  channelB: numberType().int().positive(),
  enabled: booleanType().default(false)
});
const SignalMapEntrySchema = unionType([
  numberType().int().positive(),
  // Simple: channel -> signalId
  objectType({
    "push-button": numberType().int().positive().optional(),
    "toggle-button": numberType().int().positive().optional(),
    slider: numberType().int().positive().optional(),
    default: numberType().int().positive().optional()
  })
  // Complex: different signals per control type
]);
const HardwareConfigSchema = objectType({
  systemType: HardwareSystemTypeSchema.default("core"),
  outputs: arrayType(OutputChannelSchema),
  halfBridgePairs: arrayType(HalfBridgePairSchema).optional(),
  signalMap: recordType(stringType(), SignalMapEntrySchema).optional(),
  genesisBoards: numberType().int().min(0).max(4).default(0)
  // CORE: 0-4 boards, CORE LITE: 1-4 boards (1 included + up to 3 additional)
});
const PowerConfigSchema = objectType({
  dcCharging: objectType({
    secondAlternator: booleanType().default(false),
    orionXs: booleanType().default(false)
  }).default({
    secondAlternator: false,
    orionXs: false
  }),
  solar: objectType({
    enabled: booleanType().default(false),
    primaryArray: booleanType().default(true),
    // Always enabled when solar is enabled
    auxiliaryArray: booleanType().default(false)
  }).default({
    enabled: false,
    primaryArray: true,
    auxiliaryArray: false
  }),
  batteryManagement: enumType(["victron", "expion", "battleborn", "discover"]).default("victron"),
  acLegs: numberType().int().min(1).max(2).default(2),
  multiplus: objectType({
    l1: booleanType().default(false),
    l2: booleanType().default(false)
  }).default({
    l1: false,
    l2: false
  })
});
const HVACConfigSchema = objectType({
  heating: objectType({
    enabled: booleanType().default(false),
    sources: objectType({
      diesel: booleanType().default(false),
      electric: booleanType().default(false),
      engine: booleanType().default(false)
    }).default({
      diesel: false,
      electric: false,
      engine: false
    }),
    distribution: objectType({
      floor: booleanType().default(false),
      fans: booleanType().default(false)
    }).default({
      floor: false,
      fans: false
    }),
    hotWater: booleanType().default(false),
    auxZone: booleanType().default(false)
  }).default({
    enabled: false,
    sources: { diesel: false, electric: false, engine: false },
    distribution: { floor: false, fans: false },
    hotWater: false,
    auxZone: false
  }),
  cooling: objectType({
    enabled: booleanType().default(false),
    brand: enumType(["", "recpro", "truma", "cruisencomfort"]).default("")
  }).default({
    enabled: false,
    brand: ""
  }),
  ventilation: objectType({
    enabled: booleanType().default(false),
    fans: numberType().int().min(0).max(2).default(1)
  }).default({
    enabled: false,
    fans: 1
  })
});
const PlumbingTankSchema = objectType({
  type: enumType(["fresh", "waste", "black"]),
  name: stringType().max(50).default("")
});
const PlumbingConfigSchema = objectType({
  enabled: booleanType().default(true),
  monitoringSource: enumType(["cerbo-gx", "seelevel"]).default("cerbo-gx"),
  count: numberType().int().min(1).max(4).default(3),
  tanks: arrayType(PlumbingTankSchema).min(1).max(4).default([
    { type: "fresh", name: "" },
    { type: "waste", name: "" },
    { type: "black", name: "" }
  ])
});
const AccessoriesConfigSchema = objectType({
  keypad: objectType({
    enabled: booleanType().default(false),
    count: numberType().int().min(1).max(4).default(1),
    buttonsPerKeypad: numberType().int().min(5).max(16).default(8)
  }).default({ enabled: false, count: 1, buttonsPerKeypad: 8 }),
  awning: objectType({
    enabled: booleanType().default(false),
    light: booleanType().default(false),
    controlType: enumType(["rvc", "analog"]).default("rvc")
  }).default({ enabled: false, light: false, controlType: "rvc" }),
  slides: objectType({
    enabled: booleanType().default(false),
    controlType: enumType(["rvc", "analog"]).default("rvc"),
    keypadSecured: booleanType().default(false)
  }).default({ enabled: false, controlType: "rvc", keypadSecured: false }),
  itcLighting: objectType({
    enabled: booleanType().default(false),
    modules: numberType().int().min(0).max(4).default(0),
    zonesPerModule: unionType([literalType(2), literalType(4)]).default(2)
  }).default({ enabled: false, modules: 0, zonesPerModule: 2 })
});
const LightingConfigSchema = objectType({
  enabled: booleanType().default(false),
  modules: numberType().int().min(0).max(4).default(0),
  zonesPerModule: unionType([literalType(2), literalType(4)]).default(2)
}).default({ enabled: false, modules: 0, zonesPerModule: 2 });
const BaseComponentSchema = objectType({
  id: stringType().regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "ID must start with letter and contain only alphanumeric, hyphens, underscores"),
  type: stringType(),
  // Will be refined in specific component schemas
  label: stringType().min(1).max(50),
  icon: stringType().optional(),
  tooltip: stringType().max(200).optional(),
  disabled: booleanType().optional(),
  visible: booleanType().optional()
});
const EmpirBusBindingSchema = objectType({
  type: literalType("empirbus"),
  channel: stringType().regex(/^[a-z][a-z0-9-]*$/, "Channel must be lowercase alphanumeric with hyphens"),
  property: enumType(["state", "intensity", "value"]).optional()
});
const NMEA2000BindingSchema = objectType({
  type: literalType("nmea2000"),
  pgn: numberType().int().positive(),
  field: stringType().min(1),
  instance: numberType().int().nonnegative().optional()
});
const StaticBindingSchema = objectType({
  type: literalType("static"),
  value: unknownType()
});
const BindingSchema = discriminatedUnionType("type", [
  EmpirBusBindingSchema,
  NMEA2000BindingSchema,
  StaticBindingSchema
]);
const ToggleComponentSchema = BaseComponentSchema.extend({
  type: literalType("toggle"),
  variant: enumType(["default", "switch", "checkbox", "round"]).optional(),
  bindings: objectType({
    state: BindingSchema
  })
});
const ButtonBindingsSchema = objectType({
  state: BindingSchema.optional(),
  action: BindingSchema.optional()
}).refine((data) => data.state !== void 0 || data.action !== void 0, "Button must have at least one binding (state or action)");
const ButtonComponentSchema = BaseComponentSchema.extend({
  type: literalType("button"),
  action: enumType(["momentary", "toggle"]),
  variant: enumType(["primary", "secondary", "danger", "round"]).optional(),
  bindings: ButtonBindingsSchema
});
const DimmerComponentBaseSchema = BaseComponentSchema.extend({
  type: literalType("dimmer"),
  min: numberType().min(0).max(100).optional().default(0),
  max: numberType().min(0).max(100).optional().default(100),
  step: numberType().min(1).max(100).optional().default(1),
  bindings: objectType({
    intensity: BindingSchema
  })
});
DimmerComponentBaseSchema.refine((data) => (data.min || 0) < (data.max || 100), "min must be less than max");
const GaugeComponentBaseSchema = BaseComponentSchema.extend({
  type: literalType("gauge"),
  variant: enumType(["circular", "linear", "numeric"]).optional(),
  min: numberType().optional(),
  max: numberType().optional(),
  unit: stringType().max(20).optional(),
  decimals: numberType().int().min(0).max(4).optional().default(0),
  bindings: objectType({
    value: BindingSchema
  })
});
GaugeComponentBaseSchema.refine((data) => {
  if (data.min !== void 0 && data.max !== void 0) {
    return data.min < data.max;
  }
  return true;
}, "min must be less than max");
const IndicatorComponentSchema = BaseComponentSchema.extend({
  type: literalType("indicator"),
  variant: enumType(["led", "badge", "icon"]).optional(),
  color: enumType(["green", "yellow", "red", "blue", "white"]).optional(),
  bindings: objectType({
    state: BindingSchema
  })
});
const SliderComponentBaseSchema = BaseComponentSchema.extend({
  type: literalType("slider"),
  orientation: enumType(["horizontal", "vertical"]).optional().default("horizontal"),
  min: numberType(),
  max: numberType(),
  step: numberType().positive().optional().default(1),
  unit: stringType().max(20).optional(),
  showValue: booleanType().optional().default(true),
  bindings: objectType({
    value: BindingSchema
  })
});
SliderComponentBaseSchema.refine((data) => data.min < data.max, "min must be less than max");
const ComponentSchema = unionType([
  ToggleComponentSchema,
  ButtonComponentSchema,
  DimmerComponentBaseSchema,
  // Use base schema for union
  GaugeComponentBaseSchema,
  // Use base schema for union
  IndicatorComponentSchema,
  SliderComponentBaseSchema
  // Use base schema for union
]);
const SectionSchema = objectType({
  id: stringType().regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "ID must start with letter and contain only alphanumeric, hyphens, underscores"),
  title: stringType().min(1).max(50),
  enabled: booleanType().default(true),
  // Optional in input, required in output (defaults to true)
  type: enumType(["switching", "signal-values", "image", "mixed"]).optional(),
  // For home tab sections
  icon: stringType().optional(),
  collapsible: booleanType().optional(),
  collapsed: booleanType().optional(),
  imageUrl: stringType().optional(),
  // For image type home sections
  components: arrayType(ComponentSchema)
});
const PresetTabIdSchema = enumType([
  "home",
  "lighting",
  "power",
  "hvac",
  "switching",
  "plumbing"
]);
const TabSchema = objectType({
  id: stringType().regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "ID must start with letter and contain only alphanumeric, hyphens, underscores"),
  title: stringType().min(1).max(30),
  icon: stringType().optional(),
  preset: PresetTabIdSchema.optional(),
  // If set, this is a preset tab
  enabled: booleanType().optional().default(true),
  // Allow disabling preset tabs
  sections: arrayType(SectionSchema).min(1)
});
const IconSchema = objectType({
  id: stringType().regex(/^[a-zA-Z][a-zA-Z0-9-_]*$/, "ID must start with letter and contain only alphanumeric, hyphens, underscores"),
  type: enumType(["svg", "png", "jpg"]),
  data: stringType().optional(),
  // base64 or SVG markup
  url: stringType().optional()
  // Relative path or absolute URL
}).refine((data) => data.data !== void 0 || data.url !== void 0, "Icon must have either data or url");
const UISchemaSchema = objectType({
  schemaVersion: stringType().regex(/^\d+\.\d+\.\d+$/, "Schema version must be semantic version (x.y.z)"),
  metadata: MetadataSchema,
  theme: ThemeConfigSchema.optional(),
  lightingTab: LightingTabConfigSchema.optional(),
  hvacTab: HVACTabConfigSchema.optional(),
  switchingTab: SwitchingTabConfigSchema.optional(),
  plumbingTab: PlumbingTabConfigSchema.optional(),
  hardware: HardwareConfigSchema.optional(),
  power: PowerConfigSchema.optional(),
  hvac: HVACConfigSchema.optional(),
  plumbing: PlumbingConfigSchema.optional(),
  accessories: AccessoriesConfigSchema.optional(),
  lighting: LightingConfigSchema.optional(),
  tabs: arrayType(TabSchema).min(1).max(6),
  // Changed to max 6 for preset tabs
  icons: arrayType(IconSchema).optional()
});
function createError(path, message, code) {
  return { path, message, code };
}
function validateUniqueComponentIds(schema) {
  const errors = [];
  const seenIds = /* @__PURE__ */ new Set();
  schema.tabs.forEach((tab, tabIndex) => {
    tab.sections.forEach((section, sectionIndex) => {
      section.components.forEach((component, componentIndex) => {
        if (seenIds.has(component.id)) {
          errors.push(createError([
            "tabs",
            String(tabIndex),
            "sections",
            String(sectionIndex),
            "components",
            String(componentIndex),
            "id"
          ], `Duplicate component ID: "${component.id}". All component IDs must be unique across the entire schema.`, "duplicate_component_id"));
        }
        seenIds.add(component.id);
      });
    });
  });
  return errors;
}
function isDirectIconReference(icon) {
  if (icon.startsWith("/"))
    return true;
  if (icon.startsWith("http://") || icon.startsWith("https://"))
    return true;
  if (icon.length <= 3)
    return true;
  return false;
}
function validateIconReferences(schema) {
  var _a;
  const errors = [];
  const definedIcons = new Set(((_a = schema.icons) == null ? void 0 : _a.map((icon) => icon.id)) || []);
  schema.tabs.forEach((tab, tabIndex) => {
    if (tab.icon && !isDirectIconReference(tab.icon) && !definedIcons.has(tab.icon)) {
      errors.push(createError(["tabs", String(tabIndex), "icon"], `Icon reference "${tab.icon}" not found in schema.icons`, "invalid_icon_reference"));
    }
    tab.sections.forEach((section, sectionIndex) => {
      if (section.icon && !isDirectIconReference(section.icon) && !definedIcons.has(section.icon)) {
        errors.push(createError(["tabs", String(tabIndex), "sections", String(sectionIndex), "icon"], `Icon reference "${section.icon}" not found in schema.icons`, "invalid_icon_reference"));
      }
      section.components.forEach((component, componentIndex) => {
        if (component.icon && !isDirectIconReference(component.icon) && !definedIcons.has(component.icon)) {
          errors.push(createError([
            "tabs",
            String(tabIndex),
            "sections",
            String(sectionIndex),
            "components",
            String(componentIndex),
            "icon"
          ], `Icon reference "${component.icon}" not found in schema.icons`, "invalid_icon_reference"));
        }
      });
    });
  });
  return errors;
}
function validateUniqueIconIds(schema) {
  var _a;
  const errors = [];
  const seenIds = /* @__PURE__ */ new Set();
  (_a = schema.icons) == null ? void 0 : _a.forEach((icon, index) => {
    if (seenIds.has(icon.id)) {
      errors.push(createError(["icons", String(index), "id"], `Duplicate icon ID: "${icon.id}". All icon IDs must be unique.`, "duplicate_icon_id"));
    }
    seenIds.add(icon.id);
  });
  return errors;
}
function validateUniqueTabIds(schema) {
  const errors = [];
  const seenIds = /* @__PURE__ */ new Set();
  schema.tabs.forEach((tab, index) => {
    if (seenIds.has(tab.id)) {
      errors.push(createError(["tabs", String(index), "id"], `Duplicate tab ID: "${tab.id}". All tab IDs must be unique.`, "duplicate_tab_id"));
    }
    seenIds.add(tab.id);
  });
  return errors;
}
function validateUniqueSectionIds(schema) {
  const errors = [];
  schema.tabs.forEach((tab, tabIndex) => {
    const seenIds = /* @__PURE__ */ new Set();
    tab.sections.forEach((section, sectionIndex) => {
      if (seenIds.has(section.id)) {
        errors.push(createError(["tabs", String(tabIndex), "sections", String(sectionIndex), "id"], `Duplicate section ID: "${section.id}" in tab "${tab.id}". Section IDs must be unique within their tab.`, "duplicate_section_id"));
      }
      seenIds.add(section.id);
    });
  });
  return errors;
}
function runCustomValidations(schema) {
  const errors = [];
  errors.push(...validateUniqueComponentIds(schema));
  errors.push(...validateIconReferences(schema));
  errors.push(...validateUniqueIconIds(schema));
  errors.push(...validateUniqueTabIds(schema));
  errors.push(...validateUniqueSectionIds(schema));
  return errors;
}
function validateSchema(data) {
  const zodResult = UISchemaSchema.safeParse(data);
  if (!zodResult.success) {
    const errors = zodResult.error.errors.map((err) => ({
      path: err.path.map(String),
      message: err.message,
      code: err.code
    }));
    return {
      success: false,
      errors
    };
  }
  const customErrors = runCustomValidations(zodResult.data);
  if (customErrors.length > 0) {
    return {
      success: false,
      errors: customErrors
    };
  }
  return {
    success: true,
    data: zodResult.data
  };
}
const PROTOCOL = {
  systemCmd: 48,
  systemReq: 49,
  mfdStatus: 16,
  acknowledgement: 128,
  wduHeartbeat: 5,
  acknowledgementAck: 0
};
const INITIAL_RECONNECT_DELAY = 1e3;
const MAX_RECONNECT_DELAY = 3e4;
class WebSocketAdapter {
  constructor(config = {}) {
    this.ws = null;
    this.shouldAutoReconnect = true;
    this.reconnectTimer = null;
    this.reconnectAttempt = 0;
    this.messageHandlers = [];
    this.openHandlers = [];
    this.closeHandlers = [];
    this.errorHandlers = [];
    this.config = __spreadValues({
      autoConnect: true,
      autoReconnect: true,
      debug: false
    }, config);
    this.shouldAutoReconnect = this.config.autoReconnect !== false;
    if (this.config.autoConnect) {
      this.connect();
    }
  }
  /**
   * Get WebSocket URL from current page location
   */
  getWebSocketUrl() {
    if (this.config.url) {
      return this.config.url;
    }
    const isHttps = window.location.protocol === "https:";
    const scheme = isHttps ? "wss://" : "ws://";
    const host = window.location.host;
    return scheme + host + "/ws";
  }
  /**
   * Log debug message
   */
  log(...args) {
    if (this.config.debug) {
      console.log("[WebSocketAdapter]", ...args);
    }
  }
  /**
   * Clear reconnection timer
   */
  clearReconnectTimer() {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
  /**
   * Schedule reconnection with exponential backoff
   */
  scheduleReconnect(evt) {
    if (!this.shouldAutoReconnect) {
      this.log("Auto-reconnect disabled; skipping reconnect", {
        code: evt ? evt.code : null,
        reason: evt ? evt.reason : null
      });
      return;
    }
    this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, 10);
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempt - 1),
      MAX_RECONNECT_DELAY
    );
    this.log("Scheduling reconnect in " + Math.round(delay / 1e3) + "s", {
      code: evt ? evt.code : null,
      reason: evt ? evt.reason : ""
    });
    this.clearReconnectTimer();
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
  /**
   * Connect to WebSocket server
   */
  connect() {
    this.shouldAutoReconnect = true;
    this.clearReconnectTimer();
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.log("Already connected or connecting");
      return;
    }
    const target = this.getWebSocketUrl();
    this.log("Connecting to", target);
    try {
      this.ws = new WebSocket(target);
    } catch (e) {
      const err = e;
      this.log("WebSocket constructor error:", err.message || err);
      this.scheduleReconnect();
      return;
    }
    this.ws.addEventListener("open", () => {
      this.reconnectAttempt = 0;
      this.clearReconnectTimer();
      this.log("WebSocket connected");
      this.send({
        messagetype: PROTOCOL.systemReq,
        messagecmd: 1,
        size: 3,
        data: [0, 0, 0]
      });
      const handlers = this.openHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log("Error in open handler:", e);
          }
        }
      }
    });
    this.ws.addEventListener("message", (evt) => {
      try {
        const parsed = JSON.parse(evt.data);
        this.log("Received message:", parsed);
        if (parsed.messagetype === PROTOCOL.systemCmd && parsed.messagecmd === PROTOCOL.wduHeartbeat) {
          this.send({
            messagetype: PROTOCOL.acknowledgement,
            messagecmd: PROTOCOL.acknowledgementAck,
            size: 1,
            data: [0]
          });
        }
        const handlers = this.messageHandlers.slice();
        for (let i = 0; i < handlers.length; i++) {
          const handler = handlers[i];
          if (handler) {
            try {
              handler(parsed);
            } catch (e) {
              this.log("Error in message handler:", e);
            }
          }
        }
      } catch (e) {
        this.log("Failed to parse message:", evt.data);
      }
    });
    this.ws.addEventListener("error", (evt) => {
      this.log("WebSocket error:", evt);
      const handlers = this.errorHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log("Error in error handler:", e);
          }
        }
      }
    });
    this.ws.addEventListener("close", (evt) => {
      this.log("WebSocket closed", {
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean
      });
      const handlers = this.closeHandlers.slice();
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];
        if (handler) {
          try {
            handler();
          } catch (e) {
            this.log("Error in close handler:", e);
          }
        }
      }
      this.scheduleReconnect(evt);
    });
  }
  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    this.shouldAutoReconnect = false;
    this.reconnectAttempt = 0;
    this.clearReconnectTimer();
    if (this.ws) {
      try {
        this.ws.close(1e3, "client disconnect");
      } catch (e) {
        this.log("Error closing WebSocket:", e);
      }
    }
  }
  /**
   * Send a message to the server
   */
  send(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log("Cannot send, WebSocket not open");
      return;
    }
    try {
      const payload = JSON.stringify(message);
      this.ws.send(payload);
      this.log("Sent message:", message);
    } catch (e) {
      this.log("Send error:", e);
    }
  }
  /**
   * Check if connected
   */
  isConnected() {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
  /**
   * Get current connection state
   */
  getState() {
    if (!this.ws) return "closed";
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "open";
      case WebSocket.CLOSING:
        return "closing";
      case WebSocket.CLOSED:
        return "closed";
      default:
        return "closed";
    }
  }
  /**
   * Register message handler
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
    const self = this;
    return function() {
      const index = self.messageHandlers.indexOf(handler);
      if (index > -1) {
        self.messageHandlers.splice(index, 1);
      }
    };
  }
  /**
   * Register connection open handler
   */
  onOpen(handler) {
    this.openHandlers.push(handler);
    const self = this;
    return function() {
      const index = self.openHandlers.indexOf(handler);
      if (index > -1) {
        self.openHandlers.splice(index, 1);
      }
    };
  }
  /**
   * Register connection close handler
   */
  onClose(handler) {
    this.closeHandlers.push(handler);
    const self = this;
    return function() {
      const index = self.closeHandlers.indexOf(handler);
      if (index > -1) {
        self.closeHandlers.splice(index, 1);
      }
    };
  }
  /**
   * Register error handler
   */
  onError(handler) {
    this.errorHandlers.push(handler);
    const self = this;
    return function() {
      const index = self.errorHandlers.indexOf(handler);
      if (index > -1) {
        self.errorHandlers.splice(index, 1);
      }
    };
  }
  /**
   * Subscribe to signal updates
   * Sends a subscription message (type 96, cmd 0) with signal IDs
   * Server will then push MFD STATUS messages (type 16) for subscribed signals
   */
  subscribeToSignals(signalIds) {
    if (!signalIds || signalIds.length === 0) {
      this.log("No signals to subscribe");
      return;
    }
    const data = [];
    for (let i = 0; i < signalIds.length; i++) {
      const id = signalIds[i];
      if (typeof id === "number") {
        const lo = id & 255;
        const hi = id >> 8 & 255;
        data.push(lo, hi);
      }
    }
    const message = {
      messagetype: 96,
      // Subscription request
      messagecmd: 0,
      // Subscribe action
      size: data.length,
      data
    };
    this.log("Subscribing to " + signalIds.length + " signals");
    this.send(message);
  }
  /**
   * Extract signal ID from message data
   * Signal ID is encoded in bytes [0] (lo) and [1] (hi)
   */
  static extractSignalId(data) {
    if (!data || data.length < 2) {
      return null;
    }
    const lo = data[0];
    const hi = data[1];
    if (typeof lo !== "number" || typeof hi !== "number") {
      return null;
    }
    return lo | hi << 8;
  }
}
const signalStateSignals = /* @__PURE__ */ new Map();
function getSignalState(signalId) {
  let sig = signalStateSignals.get(signalId);
  if (!sig) {
    sig = d(null);
    signalStateSignals.set(signalId, sig);
  }
  return sig;
}
function updateSignalState(signalId, value) {
  const sig = getSignalState(signalId);
  sig.value = {
    value,
    lastUpdated: Date.now()
  };
}
function handleMfdStatusMessage(msg) {
  if (msg.messagetype !== 16) {
    return;
  }
  console.log("[Signal-State] Processing Type 16 message:", msg);
  if (!msg.data || msg.data.length < 2) {
    console.warn("[Signal-State] Invalid Type 16 message - insufficient data");
    return;
  }
  const lo = msg.data[0];
  const hi = msg.data[1];
  if (typeof lo !== "number" || typeof hi !== "number") {
    return;
  }
  const signalId = lo | hi << 8;
  switch (msg.messagecmd) {
    case 1: {
      if (msg.data.length >= 3) {
        const stateValue = msg.data[2] === 1;
        console.log(`[Signal-State] Signal ${signalId} Toggle: ${stateValue ? "ON" : "OFF"}`);
        const state = {
          state: stateValue,
          lastUpdated: Date.now()
        };
        updateSignalState(signalId, state);
      }
      break;
    }
    case 3: {
      if (msg.data.length >= 5) {
        const index = msg.data[2] || 0;
        const valLo = msg.data[3];
        const valHi = msg.data[4];
        if (typeof valLo === "number" && typeof valHi === "number") {
          const rawValue = valLo | valHi << 8;
          const percent = rawValue > 100 ? rawValue / 10 : rawValue;
          const clampedPercent = Math.max(0, Math.min(100, percent));
          console.log(`[Signal-State] Signal ${signalId} Dimmer: ${clampedPercent}%`);
          const state = {
            index,
            value: clampedPercent,
            lastUpdated: Date.now()
          };
          updateSignalState(signalId, state);
        }
      }
      break;
    }
    case 5: {
      const hasExtended = msg.data.length >= 8;
      let raw;
      if (hasExtended) {
        const valLo = msg.data[4];
        const valHi = msg.data[5];
        if (typeof valLo === "number" && typeof valHi === "number") {
          raw = (valLo | valHi << 8) >>> 0;
        } else {
          break;
        }
      } else if (msg.data.length >= 4) {
        const valLo = msg.data[2];
        const valHi = msg.data[3];
        if (typeof valLo === "number" && typeof valHi === "number") {
          raw = (valLo | valHi << 8) >>> 0;
        } else {
          break;
        }
      } else {
        break;
      }
      const state = {
        raw,
        lastUpdated: Date.now()
      };
      updateSignalState(signalId, state);
      break;
    }
    default:
      updateSignalState(signalId, {
        raw: msg.data,
        lastUpdated: Date.now()
      });
  }
}
const connectionStateSignal = d(
  "disconnected"
);
let wsAdapter = null;
function initializeWebSocket(debug = false) {
  if (wsAdapter) {
    console.warn("WebSocket adapter already initialized");
    return;
  }
  wsAdapter = new WebSocketAdapter({
    autoConnect: true,
    autoReconnect: true,
    debug
  });
  wsAdapter.onOpen(function() {
    connectionStateSignal.value = "connected";
  });
  wsAdapter.onClose(function() {
    connectionStateSignal.value = "disconnected";
  });
  wsAdapter.onError(function() {
    connectionStateSignal.value = "disconnected";
  });
  wsAdapter.onMessage(function(message) {
    handleMfdStatusMessage(message);
  });
  const state = wsAdapter.getState();
  if (state === "open") {
    connectionStateSignal.value = "connected";
  } else if (state === "connecting") {
    connectionStateSignal.value = "connecting";
  } else {
    connectionStateSignal.value = "disconnected";
  }
}
function getWebSocketAdapter() {
  return wsAdapter;
}
function extractSignalIds(schema) {
  console.log("[Schema-Signals] Starting extraction from schema:", {
    hasHardware: !!schema.hardware,
    hasOutputs: !!(schema.hardware && schema.hardware.outputs),
    outputCount: schema.hardware && schema.hardware.outputs ? schema.hardware.outputs.length : 0
  });
  const signals = /* @__PURE__ */ new Set();
  if (schema.hardware && schema.hardware.outputs) {
    console.log("[Schema-Signals] Processing", schema.hardware.outputs.length, "outputs");
    for (let i = 0; i < schema.hardware.outputs.length; i++) {
      const output = schema.hardware.outputs[i];
      if (!output) continue;
      console.log("[Schema-Signals] Output", i, ":", output.id, "signals:", output.signals);
      if (typeof output.signalId === "number") {
        console.log("[Schema-Signals]   Adding signalId:", output.signalId);
        signals.add(output.signalId);
      }
      if (output.signals) {
        const sigs = output.signals;
        if (typeof sigs.toggle === "number") {
          console.log("[Schema-Signals]   Adding toggle:", sigs.toggle);
          signals.add(sigs.toggle);
        }
        if (typeof sigs.momentary === "number") {
          console.log("[Schema-Signals]   Adding momentary:", sigs.momentary);
          signals.add(sigs.momentary);
        }
        if (typeof sigs.dimmer === "number") {
          console.log("[Schema-Signals]   Adding dimmer:", sigs.dimmer);
          signals.add(sigs.dimmer);
        }
        if (typeof sigs.value === "number") {
          console.log("[Schema-Signals]   Adding value:", sigs.value);
          signals.add(sigs.value);
        }
      }
    }
  } else {
    console.log("[Schema-Signals] No hardware.outputs found in schema");
  }
  console.log("[Schema-Signals] Total unique signals collected:", signals.size);
  const signalArray = Array.from(signals);
  signalArray.sort(function(a, b) {
    return a - b;
  });
  return signalArray;
}
function subscribeToSchemaSignals(schema) {
  const wsAdapter2 = getWebSocketAdapter();
  if (!wsAdapter2 || !wsAdapter2.isConnected()) {
    console.warn("[Schema-Signals] Cannot subscribe: WebSocket not connected");
    return;
  }
  fetch("/configuration/hardware-config.json").then(function(response) {
    if (!response.ok) {
      throw new Error("Hardware config not found, falling back to schema signals");
    }
    return response.json();
  }).then(function(hardwareConfig) {
    var _a;
    console.log("[Schema-Signals] Loaded hardware config with", (_a = hardwareConfig.outputs) == null ? void 0 : _a.length, "outputs");
    const allSignals = /* @__PURE__ */ new Set();
    if (hardwareConfig.outputs) {
      hardwareConfig.outputs.forEach(function(output) {
        if (output.signals) {
          const sigs = output.signals;
          if (typeof sigs.toggle === "number") allSignals.add(sigs.toggle);
          if (typeof sigs.momentary === "number") allSignals.add(sigs.momentary);
          if (typeof sigs.dimmer === "number") allSignals.add(sigs.dimmer);
          if (typeof sigs.value === "number") allSignals.add(sigs.value);
        }
      });
    }
    const signalArray = Array.from(allSignals).sort(function(a, b) {
      return a - b;
    });
    console.log(
      "[Schema-Signals] Subscribing to " + signalArray.length + " signals from hardware-config.json:",
      signalArray
    );
    wsAdapter2.subscribeToSignals(signalArray);
  }).catch(function(error) {
    console.warn("[Schema-Signals] Could not load hardware config:", error);
    console.log("[Schema-Signals] Falling back to schema signals");
    const signalIds = extractSignalIds(schema);
    console.log("[Schema-Signals] Extracted signal IDs from schema:", signalIds);
    if (signalIds.length === 0) {
      console.warn("[Schema-Signals] No signals found in schema to subscribe");
      return;
    }
    console.log(
      "[Schema-Signals] Subscribing to " + signalIds.length + " signals from schema:",
      signalIds
    );
    wsAdapter2.subscribeToSignals(signalIds);
  });
}
function setupAutoSubscription(schema) {
  console.log("[Schema-Signals] Setting up auto-subscription");
  const wsAdapter2 = getWebSocketAdapter();
  if (!wsAdapter2) {
    console.warn("[Schema-Signals] WebSocket adapter not initialized");
    return function() {
    };
  }
  console.log("[Schema-Signals] WebSocket adapter found, isConnected:", wsAdapter2.isConnected());
  const unsubscribe = wsAdapter2.onOpen(function() {
    console.log("[Schema-Signals] WebSocket opened - subscribing to signals");
    subscribeToSchemaSignals(schema);
  });
  if (wsAdapter2.isConnected()) {
    console.log("[Schema-Signals] Already connected - subscribing now");
    subscribeToSchemaSignals(schema);
  } else {
    console.log("[Schema-Signals] Not connected yet - waiting for onOpen event");
  }
  return unsubscribe;
}
function cloneSchema(schema) {
  if (typeof structuredClone === "function") {
    return structuredClone(schema);
  }
  return JSON.parse(JSON.stringify(schema));
}
function ensureSection(tab, id, title) {
  let existing = tab.sections.find(function(section) {
    return section.id === id;
  });
  if (!existing) {
    existing = {
      id,
      title,
      enabled: false,
      components: []
    };
    tab.sections.push(existing);
    return existing;
  }
  if (!existing.title) {
    existing.title = title;
  }
  return existing;
}
function applyLightingConfig(tab, schema) {
  const lighting = schema.lightingTab;
  if (!lighting) {
    return;
  }
  const interior = ensureSection(
    tab,
    "section-lighting-interior",
    lighting.interior.title || "Interior Lights"
  );
  interior.title = lighting.interior.title || interior.title;
  interior.enabled = Boolean(lighting.interior.enabled);
  const exterior = ensureSection(
    tab,
    "section-lighting-exterior",
    lighting.exterior.title || "Exterior Lights"
  );
  exterior.title = lighting.exterior.title || exterior.title;
  exterior.enabled = Boolean(lighting.exterior.enabled);
  const rgb = ensureSection(
    tab,
    "section-lighting-rgb",
    lighting.rgb.title || "RGB Lighting"
  );
  rgb.title = lighting.rgb.title || rgb.title;
  rgb.enabled = Boolean(lighting.rgb.enabled);
  tab.uiSubtabs = [
    createSubtab("interior", lighting.interior, "section-lighting-interior"),
    createSubtab("exterior", lighting.exterior, "section-lighting-exterior"),
    createSubtab("rgb", lighting.rgb, "section-lighting-rgb")
  ];
}
function applyHVACConfig(tab, schema) {
  const hvac = schema.hvacTab;
  if (!hvac) {
    return;
  }
  const heating = ensureSection(
    tab,
    "section-hvac-heating",
    hvac.heating.title || "Heating"
  );
  heating.title = hvac.heating.title || heating.title;
  heating.enabled = Boolean(hvac.heating.enabled);
  const cooling = ensureSection(
    tab,
    "section-hvac-cooling",
    hvac.cooling.title || "Cooling"
  );
  cooling.title = hvac.cooling.title || cooling.title;
  cooling.enabled = Boolean(hvac.cooling.enabled);
  const ventilation = ensureSection(
    tab,
    "section-hvac-ventilation",
    hvac.ventilation.title || "Ventilation"
  );
  ventilation.title = hvac.ventilation.title || ventilation.title;
  ventilation.enabled = Boolean(hvac.ventilation.enabled);
  tab.uiSubtabs = [
    createSubtab("heating", hvac.heating, "section-hvac-heating"),
    createSubtab("cooling", hvac.cooling, "section-hvac-cooling"),
    createSubtab("ventilation", hvac.ventilation, "section-hvac-ventilation")
  ];
}
function applySwitchingConfig(tab, schema) {
  const switching = schema.switchingTab;
  if (!switching) {
    return;
  }
  const switches = ensureSection(
    tab,
    "section-switching-switches",
    switching.switches.title || "Switches"
  );
  switches.title = switching.switches.title || switches.title;
  switches.enabled = Boolean(switching.switches.enabled);
  const accessories = ensureSection(
    tab,
    "section-switching-accessories",
    switching.accessories.title || "Accessories"
  );
  accessories.title = switching.accessories.title || accessories.title;
  accessories.enabled = Boolean(switching.accessories.enabled);
  tab.uiSubtabs = [
    createSubtab("switches", switching.switches, "section-switching-switches"),
    createSubtab("accessories", switching.accessories, "section-switching-accessories")
  ];
}
function createSubtab(id, config, sectionId) {
  return {
    id,
    sectionId,
    title: config.title,
    icon: config.icon,
    enabled: Boolean(config.enabled)
  };
}
function regenerateTabContent(input) {
  const schema = cloneSchema(input);
  schema.tabs = schema.tabs.map(function(tab) {
    const derivedTab = __spreadProps(__spreadValues({}, tab), {
      sections: tab.sections ? tab.sections.slice() : []
    });
    delete derivedTab.uiSubtabs;
    const preset = tab.preset || tab.id;
    if (preset === "lighting" || tab.id === "tab-lighting") {
      applyLightingConfig(derivedTab, schema);
    } else if (preset === "hvac" || tab.id === "tab-hvac") {
      applyHVACConfig(derivedTab, schema);
    } else if (preset === "switching" || tab.id === "tab-switching") {
      applySwitchingConfig(derivedTab, schema);
    }
    return derivedTab;
  });
  return schema;
}
async function loadSchema(config = {}) {
  var _a, _b;
  const { schemaPath = "/schema.json", schema: providedSchema, autoSubscribe = true } = config;
  console.log(
    "[Schema-Loader] Starting schema load, path:",
    schemaPath,
    "autoSubscribe:",
    autoSubscribe
  );
  isLoadingSignal.value = true;
  errorSignal.value = null;
  schemaSignal.value = null;
  try {
    let schemaData;
    if (providedSchema) {
      schemaData = providedSchema;
    } else {
      const response = await fetch(schemaPath);
      if (!response.ok) {
        throw new Error("Failed to load schema: " + response.statusText);
      }
      schemaData = await response.json();
    }
    const result = validateSchema(schemaData);
    if (!result.success) {
      const errorMessages = result.errors.map(function(err) {
        return err.path.join(".") + ": " + err.message;
      }).join("; ");
      throw new Error("Schema validation failed: " + errorMessages);
    }
    const validatedSchema = result.data;
    const derivedSchema = regenerateTabContent(validatedSchema);
    schemaSignal.value = derivedSchema;
    console.log(
      "[Schema-Loader] Schema loaded successfully, outputs:",
      ((_b = (_a = derivedSchema.hardware) == null ? void 0 : _a.outputs) == null ? void 0 : _b.length) || 0
    );
    if (autoSubscribe && derivedSchema.hardware) {
      console.log("[Schema-Loader] Calling setupAutoSubscription");
      setupAutoSubscription(derivedSchema);
    } else {
      console.log(
        "[Schema-Loader] Skipping auto-subscription, autoSubscribe:",
        autoSubscribe,
        "has hardware:",
        !!derivedSchema.hardware
      );
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error loading schema";
    errorSignal.value = errorMessage;
    console.error("Schema loading error:", err);
  } finally {
    isLoadingSignal.value = false;
  }
}
const registry = /* @__PURE__ */ new Map();
const warned = /* @__PURE__ */ new Set();
function registerIcons(icons) {
  if (!icons || !Array.isArray(icons)) {
    return;
  }
  icons.forEach(function(icon) {
    if (!icon.id) {
      return;
    }
    const spec = { id: icon.id };
    if (icon.type === "svg" && icon.data) {
      spec.svg = icon.data;
    } else if (icon.url) {
      spec.url = icon.url;
    } else if (icon.data && (icon.type === "png" || icon.type === "jpg")) {
      spec.url = "data:image/" + icon.type + ";base64," + icon.data;
    }
    registry.set(icon.id, spec);
  });
}
function getIcon(id) {
  if (!id) {
    return void 0;
  }
  const spec = registry.get(id);
  if (!spec && !warned.has(id)) {
    console.warn('[Icon] Missing icon with id "' + id + '"');
    warned.add(id);
  }
  return spec;
}
function resolveBindingToChannelId(binding, action) {
  if (!binding) {
    return null;
  }
  if (binding.type === "empirbus") {
    const channelRef = binding.channel;
    if (typeof channelRef === "number") {
      return channelRef;
    }
    if (typeof channelRef === "string") {
      const schema = schemaSignal.value;
      if (!schema || !schema.hardware || !schema.hardware.outputs) {
        console.warn("No hardware config available to resolve channel:", channelRef);
        return null;
      }
      const output = schema.hardware.outputs.find(function(out) {
        return out.id === channelRef;
      });
      if (!output) {
        console.warn("Could not resolve channel reference:", channelRef);
        return null;
      }
      if (output.signals && action && output.signals[action]) {
        console.log(
          "Resolved",
          channelRef,
          "with action",
          action,
          "to signal",
          output.signals[action]
        );
        return output.signals[action];
      }
      if (typeof output.channel === "number") {
        console.warn(
          "Using fallback channel number for",
          channelRef,
          "- consider adding signals to schema"
        );
        return output.channel;
      }
      console.warn("Could not resolve channel reference:", channelRef);
      return null;
    }
  }
  if (binding.type === "nmea2000") {
    return null;
  }
  if (binding.type === "static") {
    return null;
  }
  return null;
}
function encodeChannelId(channelId) {
  return {
    lo: channelId & 255,
    hi: channelId >> 8 & 255
  };
}
function createToggleMessage(channelId, state) {
  const { lo, hi } = encodeChannelId(channelId);
  return {
    messagetype: 17,
    messagecmd: 1,
    size: 3,
    data: [lo, hi, state ? 1 : 0]
  };
}
function createDimmerMessage(channelId, valuePercent, dimmerIndex = 0) {
  const { lo, hi } = encodeChannelId(channelId);
  const idx = Number(dimmerIndex) | 0;
  const pct = Math.max(0, Math.min(100, Number(valuePercent) || 0));
  const t = Math.round(pct * 10);
  const tLo = t & 255;
  const tHi = t >> 8 & 255;
  return {
    messagetype: 17,
    messagecmd: 3,
    size: 5,
    data: [lo, hi, idx, tLo, tHi]
  };
}
const FALLBACK_MAP = {
  home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>',
  power: '<svg viewBox="0 0 24 24"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.12.94-4.02 2.42-5.32L6 5.17A8.94 8.94 0 0 0 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9a8.94 8.94 0 0 0-3.17-6.83z" fill="currentColor"/></svg>',
  lighting: '<svg viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="currentColor"/></svg>',
  hvac: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/></svg>',
  switching: '<svg viewBox="0 0 24 24"><path d="M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="currentColor"/></svg>',
  plumbing: '<svg viewBox="0 0 24 24"><path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 16h14V5H5v14z" fill="currentColor"/></svg>'
};
function getFallbackIcon(presetId) {
  if (!presetId) {
    return void 0;
  }
  return FALLBACK_MAP[presetId.toLowerCase()];
}
const DEFAULT_FALLBACK_SVG = '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="currentColor" opacity="0.3"/></svg>';
function sanitizeSVG(svg) {
  return svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/\s*on\w+="[^"]*"/gi, "").replace(/\s*on\w+='[^']*'/gi, "");
}
function Icon(props) {
  const { iconId, icon, size = "md", preset, title, className = "" } = props;
  let iconSpec = icon;
  if (!iconSpec && iconId) {
    if (iconId.length <= 3) {
      iconSpec = {
        id: iconId,
        svg: '<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="20">' + iconId + "</text>"
      };
    } else {
      iconSpec = getIcon(iconId);
    }
  }
  const sizeClass = "gcg-icon--" + size;
  let content;
  if (iconSpec) {
    if (iconSpec.svg) {
      const sanitized = sanitizeSVG(iconSpec.svg);
      content = /* @__PURE__ */ u("span", { dangerouslySetInnerHTML: { __html: sanitized } });
    } else if (iconSpec.url) {
      content = /* @__PURE__ */ u("img", { src: iconSpec.url, alt: "", role: "presentation" });
    } else {
      content = /* @__PURE__ */ u("span", { dangerouslySetInnerHTML: { __html: DEFAULT_FALLBACK_SVG } });
    }
  } else {
    const fallbackSvg = getFallbackIcon(preset);
    if (fallbackSvg) {
      content = /* @__PURE__ */ u("span", { dangerouslySetInnerHTML: { __html: fallbackSvg } });
    } else {
      content = /* @__PURE__ */ u("span", { dangerouslySetInnerHTML: { __html: DEFAULT_FALLBACK_SVG } });
    }
  }
  return /* @__PURE__ */ u(
    "span",
    {
      class: "gcg-icon " + sizeClass + (className ? " " + className : ""),
      title,
      "data-icon-id": iconId,
      "aria-hidden": !title,
      children: content
    }
  );
}
function Toggle(props) {
  const { component, value, onChange } = props;
  let signalId = null;
  let staticValue = null;
  if (component.bindings && component.bindings.state) {
    const binding = component.bindings.state;
    if (binding.type === "static") {
      staticValue = binding.value;
    } else {
      signalId = resolveBindingToChannelId(binding, "toggle");
    }
  }
  const signalState = signalId !== null ? getSignalState(signalId) : null;
  const isOn = useComputed(function() {
    if (signalState && signalState.value) {
      const state = signalState.value.value;
      if (state && typeof state.state === "boolean") {
        return state.state;
      }
    }
    if (staticValue !== null) {
      return staticValue;
    }
    if (typeof value === "boolean") {
      return value;
    }
    return false;
  });
  const handleClick = function() {
    const currentValue = isOn.value;
    console.log(
      "[Toggle]",
      component.label,
      "- Click - Current state:",
      currentValue,
      "SignalID:",
      signalId
    );
    if (signalId !== null) {
      const wsAdapter2 = getWebSocketAdapter();
      if (wsAdapter2 && wsAdapter2.isConnected()) {
        const pressMessage = createToggleMessage(signalId, true);
        console.log("[Toggle]", component.label, "- Sending press (1)");
        wsAdapter2.send(pressMessage);
        setTimeout(function() {
          const releaseMessage = createToggleMessage(signalId, false);
          console.log("[Toggle]", component.label, "- Sending release (0)");
          wsAdapter2.send(releaseMessage);
        }, 75);
      } else {
        console.warn("[Toggle]", component.label, "- WebSocket not connected");
      }
    } else {
      console.warn("[Toggle]", component.label, "- No signal ID configured");
    }
    if (onChange) {
      onChange(!currentValue);
    }
  };
  const variant = component.variant || "default";
  const baseClass = "gcg-toggle";
  const variantClass = baseClass + "--" + variant;
  const stateClass = isOn.value ? baseClass + "--on" : baseClass + "--off";
  const disabledClass = component.disabled ? baseClass + "--disabled" : "";
  const className = [baseClass, variantClass, stateClass, disabledClass].filter(function(cls) {
    return cls;
  }).join(" ");
  return /* @__PURE__ */ u("div", { className: "gcg-component-wrapper", children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className,
        onClick: handleClick,
        disabled: component.disabled,
        "aria-pressed": isOn.value,
        "aria-label": component.label,
        title: component.tooltip,
        children: [
          (variant === "default" || variant === "switch") && /* @__PURE__ */ u(k, { children: [
            /* @__PURE__ */ u("div", { className: "gcg-toggle__track", children: /* @__PURE__ */ u("div", { className: "gcg-toggle__thumb" }) }),
            /* @__PURE__ */ u("span", { className: "gcg-toggle__label", children: component.label })
          ] }),
          variant === "round" && /* @__PURE__ */ u(k, { children: component.icon ? /* @__PURE__ */ u("div", { className: "gcg-toggle__icon", children: /* @__PURE__ */ u(Icon, { iconId: component.icon, size: "md" }) }) : /* @__PURE__ */ u("span", { className: "gcg-toggle__text", children: "ON/OFF" }) }),
          variant === "checkbox" && /* @__PURE__ */ u(k, { children: [
            /* @__PURE__ */ u("div", { className: "gcg-toggle__checkbox", children: /* @__PURE__ */ u(
              "svg",
              {
                className: "gcg-toggle__checkmark",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                children: /* @__PURE__ */ u(
                  "polyline",
                  {
                    points: "20 6 9 17 4 12",
                    strokeWidth: "3",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ u("span", { className: "gcg-toggle__label", children: component.label })
          ] })
        ]
      }
    ),
    variant === "round" && component.label && /* @__PURE__ */ u("div", { className: "gcg-component-label", children: component.label }),
    component.tooltip && /* @__PURE__ */ u("div", { className: "gcg-component-tooltip", children: component.tooltip })
  ] });
}
function Button(props) {
  const { component, onAction } = props;
  const [isPressed, setIsPressed] = d$1(false);
  let signalId = null;
  if (component.bindings && component.bindings.action) {
    signalId = resolveBindingToChannelId(component.bindings.action, "momentary");
  }
  const sendWebSocketMessage = function(pressed) {
    if (signalId !== null) {
      const wsAdapter2 = getWebSocketAdapter();
      if (wsAdapter2 && wsAdapter2.isConnected()) {
        const message = createToggleMessage(signalId, pressed);
        console.log(
          "[Button]",
          component.label,
          "-",
          pressed ? "Press (1)" : "Release (0)",
          "SignalID:",
          signalId
        );
        wsAdapter2.send(message);
      } else {
        console.warn("[Button]", component.label, "- WebSocket not connected");
      }
    } else {
      console.warn("[Button]", component.label, "- No signal ID configured");
    }
  };
  const handlePointerDown = function(e) {
    e.preventDefault();
    if (isPressed || component.disabled) {
      return;
    }
    console.log("[Button]", component.label, "- Pointer Down");
    setIsPressed(true);
    sendWebSocketMessage(true);
    if (onAction) {
      onAction(true);
    }
  };
  const handlePointerUp = function(e) {
    e.preventDefault();
    if (isPressed) {
      console.log("[Button]", component.label, "- Pointer Up");
      setIsPressed(false);
      sendWebSocketMessage(false);
      if (onAction) {
        onAction(false);
      }
    }
  };
  const handlePointerCancel = function() {
    if (isPressed) {
      console.log("[Button]", component.label, "- Pointer Cancel");
      setIsPressed(false);
      sendWebSocketMessage(false);
      if (onAction) {
        onAction(false);
      }
    }
  };
  const handlePointerLeave = function() {
    if (isPressed) {
      console.log("[Button]", component.label, "- Pointer Leave");
      setIsPressed(false);
      sendWebSocketMessage(false);
      if (onAction) {
        onAction(false);
      }
    }
  };
  const variant = component.variant || "secondary";
  const baseClass = "gcg-button";
  const variantClass = baseClass + "--" + variant;
  const stateClass = isPressed ? baseClass + "--pressed" : "";
  const disabledClass = component.disabled ? baseClass + "--disabled" : "";
  const className = [baseClass, variantClass, stateClass, disabledClass].filter(function(cls) {
    return cls;
  }).join(" ");
  return /* @__PURE__ */ u("div", { className: "gcg-component-wrapper", children: [
    /* @__PURE__ */ u("div", { className: "gcg-button-container", children: [
      /* @__PURE__ */ u("label", { className: "gcg-button-label", children: component.label }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className,
          disabled: component.disabled,
          onPointerDown: handlePointerDown,
          onPointerUp: handlePointerUp,
          onPointerCancel: handlePointerCancel,
          onPointerLeave: handlePointerLeave,
          "aria-label": component.label,
          "aria-pressed": isPressed,
          title: component.tooltip,
          children: [
            variant === "round" && /* @__PURE__ */ u(k, { children: component.icon ? /* @__PURE__ */ u("div", { className: "gcg-button__icon", children: /* @__PURE__ */ u(Icon, { iconId: component.icon, size: "md" }) }) : /* @__PURE__ */ u("span", { className: "gcg-button__label", children: "ON/OFF" }) }),
            variant !== "round" && component.icon && /* @__PURE__ */ u("div", { className: "gcg-button__icon", children: /* @__PURE__ */ u(Icon, { iconId: component.icon, size: "sm" }) })
          ]
        }
      )
    ] }),
    component.tooltip && /* @__PURE__ */ u("div", { className: "gcg-component-tooltip", children: component.tooltip })
  ] });
}
function Dimmer(props) {
  const { component, value, onChange } = props;
  let dimmerSignalId = null;
  let toggleSignalId = null;
  if (component.bindings && component.bindings.intensity) {
    dimmerSignalId = resolveBindingToChannelId(component.bindings.intensity, "dimmer");
    toggleSignalId = resolveBindingToChannelId(component.bindings.intensity, "toggle");
  }
  const dimmerSignalState = dimmerSignalId !== null ? getSignalState(dimmerSignalId) : null;
  const toggleSignalState = toggleSignalId !== null ? getSignalState(toggleSignalId) : null;
  const isDragging = useSignal(false);
  const sliderRef = A(null);
  const displayIntensity = useSignal(value || component.min || 0);
  const isOn = useComputed(function() {
    if (toggleSignalState && toggleSignalState.value) {
      const state = toggleSignalState.value.value;
      if (state && typeof state.state === "boolean") {
        return state.state;
      }
    }
    return false;
  });
  y(() => {
    if (!sliderRef.current || isDragging.value) return;
    if (document.activeElement === sliderRef.current) return;
    if (dimmerSignalState && dimmerSignalState.value) {
      const state = dimmerSignalState.value.value;
      if (state && typeof state.value === "number") {
        sliderRef.current.value = String(state.value);
        displayIntensity.value = state.value;
      }
    }
  });
  const currentIntensity = useComputed(function() {
    if (dimmerSignalState && dimmerSignalState.value) {
      const state = dimmerSignalState.value.value;
      if (state && typeof state.value === "number") {
        return state.value;
      }
    }
    return value !== void 0 ? value : component.min || 0;
  });
  const handleToggle = function() {
    console.log("[Dimmer] Toggle click - Current:", isOn.value, "ToggleSignalID:", toggleSignalId);
    if (toggleSignalId !== null) {
      const wsAdapter2 = getWebSocketAdapter();
      if (wsAdapter2 && wsAdapter2.isConnected()) {
        const pressMessage = createToggleMessage(toggleSignalId, true);
        console.log("[Dimmer] Sending toggle press (1):", JSON.stringify(pressMessage));
        wsAdapter2.send(pressMessage);
        setTimeout(function() {
          const releaseMessage = createToggleMessage(toggleSignalId, false);
          console.log("[Dimmer] Sending toggle release (0):", JSON.stringify(releaseMessage));
          wsAdapter2.send(releaseMessage);
        }, 75);
      } else {
        console.warn("[Dimmer] WebSocket not connected");
      }
    } else {
      console.warn("[Dimmer] No toggle signal ID");
    }
  };
  const handleChange = function(newValue) {
    const min2 = component.min || 0;
    const max2 = component.max || 100;
    const step2 = component.step || 1;
    const steppedValue = Math.round(newValue / step2) * step2;
    const clampedValue = Math.max(min2, Math.min(max2, steppedValue));
    if (dimmerSignalId !== null) {
      const wsAdapter2 = getWebSocketAdapter();
      if (wsAdapter2 && wsAdapter2.isConnected()) {
        const message = createDimmerMessage(dimmerSignalId, clampedValue, 0);
        console.log(
          "[Dimmer] Sending intensity:",
          clampedValue + "%",
          "DimmerSignalID:",
          dimmerSignalId,
          JSON.stringify(message)
        );
        wsAdapter2.send(message);
      } else {
        console.warn("[Dimmer] WebSocket not connected");
      }
    } else {
      console.warn("[Dimmer] No dimmer signal ID");
    }
    if (onChange) {
      onChange(clampedValue);
    }
  };
  const handleInput = function(e) {
    const target = e.target;
    const newValue = parseFloat(target.value);
    if (!isNaN(newValue)) {
      isDragging.value = true;
      displayIntensity.value = newValue;
    }
  };
  const handleChangeEnd = function(e) {
    const target = e.target;
    const newValue = parseFloat(target.value);
    if (!isNaN(newValue)) {
      handleChange(newValue);
    }
    isDragging.value = false;
  };
  const baseClass = "gcg-dimmer";
  const className = baseClass;
  const toggleStateClass = isOn.value ? "gcg-dimmer__toggle--on" : "gcg-dimmer__toggle--off";
  const min = component.min || 0;
  const max = component.max || 100;
  const step = component.step || 1;
  return /* @__PURE__ */ u("div", { className: "gcg-component-wrapper", children: [
    /* @__PURE__ */ u("div", { className, children: [
      /* @__PURE__ */ u("div", { className: "gcg-dimmer__header", children: [
        /* @__PURE__ */ u("label", { className: "gcg-dimmer__label", children: /* @__PURE__ */ u("span", { className: "gcg-dimmer__label-text", children: component.label }) }),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "gcg-dimmer__toggle " + toggleStateClass,
            onClick: handleToggle,
            disabled: component.disabled,
            "aria-pressed": isOn.value,
            "aria-label": "Toggle " + component.label,
            children: /* @__PURE__ */ u("div", { className: "gcg-dimmer__toggle-indicator" })
          }
        )
      ] }),
      /* @__PURE__ */ u("div", { className: "gcg-dimmer__slider-container", children: [
        /* @__PURE__ */ u(
          "input",
          {
            ref: sliderRef,
            type: "range",
            className: "gcg-dimmer__slider",
            min,
            max,
            step,
            defaultValue: currentIntensity.value,
            onInput: handleInput,
            onChange: handleChangeEnd,
            disabled: component.disabled,
            "aria-label": component.label,
            "aria-valuemin": min,
            "aria-valuemax": max,
            "aria-valuenow": displayIntensity.value
          }
        ),
        /* @__PURE__ */ u("div", { className: "gcg-dimmer__track", children: /* @__PURE__ */ u(
          "div",
          {
            className: "gcg-dimmer__fill",
            style: {
              width: (displayIntensity.value - min) / (max - min) * 100 + "%"
            }
          }
        ) })
      ] })
    ] }),
    component.tooltip && /* @__PURE__ */ u("div", { className: "gcg-component-tooltip", children: component.tooltip })
  ] });
}
function Gauge(props) {
  const { component, value } = props;
  let signalId = null;
  if (component.bindings && component.bindings.value) {
    signalId = resolveBindingToChannelId(component.bindings.value);
  }
  const signalState = signalId !== null ? getSignalState(signalId) : null;
  const currentValue = useComputed(function() {
    if (signalState && signalState.value) {
      const state = signalState.value.value;
      if (state && typeof state.raw === "number") {
        return state.raw;
      }
    }
    return value !== void 0 ? value : 0;
  });
  const variant = component.variant || "numeric";
  const min = component.min !== void 0 ? component.min : 0;
  const max = component.max !== void 0 ? component.max : 100;
  const unit = component.unit || "";
  const decimals = component.decimals !== void 0 ? component.decimals : 0;
  const formattedValue = decimals > 0 ? currentValue.value.toFixed(decimals) : Math.round(currentValue.value).toString();
  const percentage = Math.max(0, Math.min(100, (currentValue.value - min) / (max - min) * 100));
  const baseClass = "gcg-gauge";
  const variantClass = baseClass + "--" + variant;
  const className = [baseClass, variantClass].join(" ");
  return /* @__PURE__ */ u("div", { className: "gcg-component-wrapper", children: [
    /* @__PURE__ */ u(
      "div",
      {
        className,
        role: "meter",
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": currentValue.value,
        children: [
          variant === "circular" && /* @__PURE__ */ u("div", { className: "gcg-gauge__circular", children: [
            /* @__PURE__ */ u("svg", { className: "gcg-gauge__svg", viewBox: "0 0 100 100", children: [
              /* @__PURE__ */ u(
                "path",
                {
                  className: "gcg-gauge__track",
                  d: "M 10,50 A 40,40 0 1,1 90,50",
                  fill: "none",
                  strokeWidth: "8",
                  strokeLinecap: "round"
                }
              ),
              /* @__PURE__ */ u(
                "path",
                {
                  className: "gcg-gauge__fill",
                  d: "M 10,50 A 40,40 0 1,1 90,50",
                  fill: "none",
                  strokeWidth: "8",
                  strokeLinecap: "round",
                  strokeDasharray: String(percentage * 2.51) + " 251"
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "gcg-gauge__value-container", children: [
              /* @__PURE__ */ u("span", { className: "gcg-gauge__value", children: formattedValue }),
              unit && /* @__PURE__ */ u("span", { className: "gcg-gauge__unit", children: unit })
            ] }),
            /* @__PURE__ */ u("label", { className: "gcg-gauge__label", children: component.label })
          ] }),
          variant === "linear" && /* @__PURE__ */ u("div", { className: "gcg-gauge__linear", children: [
            /* @__PURE__ */ u("label", { className: "gcg-gauge__label", children: component.label }),
            /* @__PURE__ */ u("div", { className: "gcg-gauge__track-container", children: [
              /* @__PURE__ */ u("div", { className: "gcg-gauge__track", children: /* @__PURE__ */ u(
                "div",
                {
                  className: "gcg-gauge__fill",
                  style: {
                    width: percentage + "%"
                  }
                }
              ) }),
              /* @__PURE__ */ u("div", { className: "gcg-gauge__value-container", children: [
                /* @__PURE__ */ u("span", { className: "gcg-gauge__value", children: formattedValue }),
                unit && /* @__PURE__ */ u("span", { className: "gcg-gauge__unit", children: unit })
              ] })
            ] })
          ] }),
          variant === "numeric" && /* @__PURE__ */ u("div", { className: "gcg-gauge__numeric", children: [
            /* @__PURE__ */ u("label", { className: "gcg-gauge__label", children: component.label }),
            /* @__PURE__ */ u("div", { className: "gcg-gauge__value-container", children: [
              /* @__PURE__ */ u("span", { className: "gcg-gauge__value", children: formattedValue }),
              unit && /* @__PURE__ */ u("span", { className: "gcg-gauge__unit", children: unit })
            ] })
          ] })
        ]
      }
    ),
    component.tooltip && /* @__PURE__ */ u("div", { className: "gcg-component-tooltip", children: component.tooltip })
  ] });
}
function Indicator(props) {
  const { component, value } = props;
  const binding = component.bindings && component.bindings.state;
  const isStaticBinding = binding && binding.type === "static";
  let signalId = null;
  if (binding && binding.type === "empirbus") {
    signalId = resolveBindingToChannelId(binding);
  }
  const signalState = signalId !== null ? getSignalState(signalId) : null;
  const isActive = useComputed(function() {
    if (isStaticBinding && binding.type === "static") {
      return binding.value === true;
    }
    if (signalState && signalState.value) {
      const state2 = signalState.value.value;
      if (state2 && typeof state2.state === "boolean") {
        return state2.state;
      }
    }
    if (value === true) return true;
    if (value === false) return false;
    return false;
  });
  let state = "off";
  if (isActive.value) {
    state = "on";
  } else if (value === "warning") {
    state = "warning";
  } else if (value === "error") {
    state = "error";
  }
  const variant = component.variant || "led";
  const baseClass = "gcg-indicator";
  const variantClass = baseClass + "--" + variant;
  const stateClass = baseClass + "--" + state;
  const className = [baseClass, variantClass, stateClass].filter(function(c) {
    return c;
  }).join(" ");
  return /* @__PURE__ */ u("div", { className: "gcg-component-wrapper", children: [
    /* @__PURE__ */ u("div", { className, role: "status", "aria-label": component.label, children: [
      /* @__PURE__ */ u("div", { className: "gcg-indicator__light" }),
      /* @__PURE__ */ u("span", { className: "gcg-indicator__label", children: component.label })
    ] }),
    component.tooltip && /* @__PURE__ */ u("div", { className: "gcg-component-tooltip", children: component.tooltip })
  ] });
}
function Slider(props) {
  const { component, value, onChange } = props;
  const isDragging = useSignal(false);
  const sliderRef = A(null);
  const displayValue = useSignal(value || component.min);
  let signalId = null;
  if (component.bindings && component.bindings.value) {
    signalId = resolveBindingToChannelId(component.bindings.value, "dimmer");
  }
  const signalState = signalId !== null ? getSignalState(signalId) : null;
  y(() => {
    if (!sliderRef.current || isDragging.value) return;
    if (document.activeElement === sliderRef.current) return;
    if (signalState && signalState.value) {
      const state = signalState.value.value;
      if (state && typeof state.value === "number") {
        const scaledValue = state.value / 100 * (component.max - component.min) + component.min;
        sliderRef.current.value = String(scaledValue);
        displayValue.value = scaledValue;
      }
    }
  });
  const currentValue = useComputed(() => {
    if (signalState && signalState.value) {
      const state = signalState.value.value;
      if (state && typeof state.value === "number") {
        return state.value / 100 * (component.max - component.min) + component.min;
      }
    }
    return displayValue.value;
  });
  const sendValue = (newValue) => {
    const adapter = getWebSocketAdapter();
    if (!adapter || signalId === null) {
      console.warn("No WebSocket adapter or signal ID available for slider");
      return;
    }
    const clampedValue = Math.max(component.min, Math.min(component.max, newValue));
    const steppedValue = Math.round(clampedValue / component.step) * component.step;
    const percentage2 = (steppedValue - component.min) / (component.max - component.min) * 100;
    const message = createDimmerMessage(signalId, percentage2);
    adapter.send(message);
    if (onChange) {
      onChange(steppedValue);
    }
  };
  const handleSliderChange = (event) => {
    const target = event.target;
    const newValue = parseFloat(target.value);
    displayValue.value = newValue;
    if (!isDragging.value) {
      sendValue(newValue);
    }
  };
  const handleSliderStart = () => {
    isDragging.value = true;
  };
  const handleSliderEnd = () => {
    if (isDragging.value) {
      sendValue(displayValue.value);
      isDragging.value = false;
    }
  };
  const formatValue = (val) => {
    const decimals = Math.max(0, Math.ceil(Math.log10(1 / component.step)));
    const formatted = val.toFixed(decimals);
    return component.unit ? `${formatted} ${component.unit}` : formatted;
  };
  const percentage = (currentValue.value - component.min) / (component.max - component.min) * 100;
  const isDisabled = signalId === null;
  const isVertical = component.orientation === "vertical";
  return /* @__PURE__ */ u(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        alignItems: "center",
        gap: "0.5rem",
        padding: "1rem",
        background: "var(--component-background)",
        borderRadius: "12px",
        border: "1px solid var(--component-border)",
        minWidth: isVertical ? "120px" : "200px",
        minHeight: isVertical ? "200px" : "80px",
        opacity: isDisabled ? 0.5 : 1
      },
      children: [
        /* @__PURE__ */ u(
          "div",
          {
            style: {
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              textAlign: "center",
              order: isVertical ? 2 : 1
            },
            children: component.label
          }
        ),
        /* @__PURE__ */ u(
          "div",
          {
            style: {
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              order: isVertical ? 1 : 2,
              width: isVertical ? "60px" : "100%",
              height: isVertical ? "100%" : "40px"
            },
            children: [
              /* @__PURE__ */ u(
                "input",
                {
                  ref: sliderRef,
                  type: "range",
                  min: component.min,
                  max: component.max,
                  step: component.step,
                  value: displayValue.value,
                  disabled: isDisabled,
                  onInput: handleSliderChange,
                  onMouseDown: handleSliderStart,
                  onMouseUp: handleSliderEnd,
                  onTouchStart: handleSliderStart,
                  onTouchEnd: handleSliderEnd,
                  style: {
                    appearance: "none",
                    background: "transparent",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    width: isVertical ? "40px" : "100%",
                    height: isVertical ? "100%" : "40px",
                    transform: isVertical ? "rotate(-90deg)" : "none",
                    transformOrigin: "center"
                  },
                  className: "gcg-slider"
                }
              ),
              /* @__PURE__ */ u(
                "div",
                {
                  style: {
                    position: "absolute",
                    background: "var(--slider-track-bg, rgba(255, 255, 255, 0.2))",
                    borderRadius: "20px",
                    width: isVertical ? "8px" : "100%",
                    height: isVertical ? "100%" : "8px",
                    pointerEvents: "none",
                    zIndex: 1
                  }
                }
              ),
              /* @__PURE__ */ u(
                "div",
                {
                  style: {
                    position: "absolute",
                    background: "var(--theme-accent, #3b82f6)",
                    borderRadius: "20px",
                    width: isVertical ? "8px" : `${percentage}%`,
                    height: isVertical ? `${percentage}%` : "8px",
                    [isVertical ? "bottom" : "left"]: "0",
                    pointerEvents: "none",
                    zIndex: 2,
                    transition: isDragging.value ? "none" : "all 0.2s ease"
                  }
                }
              )
            ]
          }
        ),
        component.showValue && /* @__PURE__ */ u(
          "div",
          {
            style: {
              fontSize: "0.75rem",
              color: "var(--color-text)",
              fontFamily: "monospace",
              minWidth: "60px",
              textAlign: "center",
              order: isVertical ? 3 : 3
            },
            children: formatValue(currentValue.value)
          }
        ),
        false
      ]
    }
  );
}
const COMPONENT_REGISTRY = {
  toggle: Toggle,
  button: Button,
  dimmer: Dimmer,
  gauge: Gauge,
  indicator: Indicator,
  slider: Slider
};
function Section(props) {
  const { section, hideTitle } = props;
  return /* @__PURE__ */ u("div", { className: "gcg-section", children: [
    !hideTitle && /* @__PURE__ */ u("h2", { className: "gcg-section__title", children: section.title }),
    /* @__PURE__ */ u("div", { className: "gcg-section__grid", children: section.components.map(function(component, index) {
      const ComponentCtor = COMPONENT_REGISTRY[component.type];
      if (!ComponentCtor) {
        console.warn("Unknown component type:", component.type, component);
        return null;
      }
      return /* @__PURE__ */ u(ComponentCtor, { component }, component.id || index);
    }) })
  ] });
}
function HomeLayout(props) {
  const { sections } = props;
  const enabledSections = sections.filter(function(section) {
    return section.enabled !== false;
  });
  const sectionCount = enabledSections.length;
  if (sectionCount === 0) {
    return /* @__PURE__ */ u("div", { className: "gcg-home-layout gcg-home-layout--empty", children: /* @__PURE__ */ u("p", { children: "No sections configured" }) });
  }
  if (sectionCount === 1) {
    return /* @__PURE__ */ u("div", { className: "gcg-home-layout gcg-home-layout--single", children: /* @__PURE__ */ u(Section, { section: enabledSections[0] }) });
  }
  return /* @__PURE__ */ u("div", { className: "gcg-home-layout gcg-home-layout--dual", children: [
    /* @__PURE__ */ u("div", { className: "gcg-home-layout__section", children: /* @__PURE__ */ u(Section, { section: enabledSections[0] }) }),
    /* @__PURE__ */ u("div", { className: "gcg-home-layout__section", children: /* @__PURE__ */ u(Section, { section: enabledSections[1] }) })
  ] });
}
function StatusBar(props) {
  const { leftInfo, centerInfo, rightInfo } = props;
  return /* @__PURE__ */ u("div", { className: "gcg-status-bar", children: [
    /* @__PURE__ */ u("div", { className: "gcg-status-bar__content", children: [
      /* @__PURE__ */ u("div", { className: "gcg-status-bar__section gcg-status-bar__section--left", children: leftInfo || "INTERIOR: --" }),
      /* @__PURE__ */ u("div", { className: "gcg-status-bar__section gcg-status-bar__section--center", children: centerInfo || "EXTERIOR: --" }),
      /* @__PURE__ */ u("div", { className: "gcg-status-bar__section gcg-status-bar__section--right", children: rightInfo || "TIME TO GO: --" })
    ] }),
    /* @__PURE__ */ u("div", { className: "gcg-status-bar__divider" })
  ] });
}
function TabBar(props) {
  const { tabs, activeTabId, onTabChange } = props;
  const enabledTabs = tabs.filter(function(tab) {
    return tab.enabled !== false;
  });
  return /* @__PURE__ */ u("nav", { className: "gcg-tab-bar", children: enabledTabs.map(function(tab) {
    const isActive = tab.id === activeTabId;
    const className = isActive ? "gcg-tab-bar__item gcg-tab-bar__item--active" : "gcg-tab-bar__item";
    return /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className,
        onClick: function() {
          onTabChange(tab.id);
        },
        "aria-label": tab.title,
        "aria-current": isActive ? "page" : void 0,
        children: [
          /* @__PURE__ */ u("div", { className: "gcg-tab-bar__icon", children: /* @__PURE__ */ u(Icon, { iconId: tab.icon, preset: tab.preset, size: "md" }) }),
          /* @__PURE__ */ u("span", { className: "gcg-tab-bar__label", children: tab.title })
        ]
      },
      tab.id
    );
  }) });
}
function SubtabBar(props) {
  const { subtabs, activeSubtabId, onSubtabChange } = props;
  const enabledSubtabs = subtabs.filter(function(subtab) {
    return subtab.enabled !== false;
  });
  if (enabledSubtabs.length <= 1) {
    return null;
  }
  return /* @__PURE__ */ u("nav", { className: "gcg-subtab-bar", children: enabledSubtabs.map(function(subtab) {
    const isActive = subtab.id === activeSubtabId;
    const className = isActive ? "gcg-subtab-bar__item gcg-subtab-bar__item--active" : "gcg-subtab-bar__item";
    return /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className,
        onClick: function() {
          onSubtabChange(subtab.id);
        },
        "aria-label": subtab.title,
        "aria-current": isActive ? "page" : void 0,
        children: [
          subtab.icon && /* @__PURE__ */ u("span", { className: "gcg-subtab-bar__icon", children: /* @__PURE__ */ u(Icon, { iconId: subtab.icon, size: "sm" }) }),
          /* @__PURE__ */ u("span", { className: "gcg-subtab-bar__title", children: subtab.title })
        ]
      },
      subtab.id
    );
  }) });
}
const App = () => {
  console.log("[App] HMI UI App component mounting...");
  const activeTabId = useSignal(null);
  const activeSubtabId = useSignal({});
  y(function() {
    console.log("[App] Loading schema...");
    loadSchema();
  }, []);
  const schema = schemaSignal.value;
  const isLoading = isLoadingSignal.value;
  const error = errorSignal.value;
  y(
    function() {
      if (schema && schema.icons) {
        registerIcons(schema.icons);
      }
    },
    [schema]
  );
  y(
    function() {
      if (schema && schema.theme) {
        const theme = schema.theme;
        const root2 = document.documentElement;
        if (theme.preset) {
          root2.setAttribute("data-theme", theme.preset);
        } else {
          root2.setAttribute("data-theme", "blue");
        }
        if (theme.customColors) {
          if (theme.customColors.primary) {
            root2.style.setProperty("--color-primary", theme.customColors.primary);
          }
          if (theme.customColors.secondary) {
            root2.style.setProperty("--color-secondary", theme.customColors.secondary);
          }
          if (theme.customColors.accent) {
            root2.style.setProperty("--color-accent", theme.customColors.accent);
          }
          if (theme.customColors.background) {
            root2.style.setProperty("--color-bg", theme.customColors.background);
          }
          if (theme.customColors.text) {
            root2.style.setProperty("--color-text", theme.customColors.text);
          }
        }
      } else {
        document.documentElement.setAttribute("data-theme", "blue");
      }
    },
    [schema]
  );
  y(
    function() {
      if (schema && schema.tabs && schema.tabs.length > 0 && !activeTabId.value) {
        const firstEnabledTab = schema.tabs.find(function(tab) {
          return tab.enabled !== false;
        });
        if (firstEnabledTab) {
          activeTabId.value = firstEnabledTab.id;
        }
      }
    },
    [schema]
  );
  y(
    function() {
      if (!schema) {
        return;
      }
      const currentMap = activeSubtabId.value;
      let nextMap = currentMap;
      let changed = false;
      schema.tabs.forEach(function(tab) {
        const derivedTab = tab;
        const subtabs = derivedTab.uiSubtabs;
        if (!subtabs || subtabs.length === 0) {
          if (Object.prototype.hasOwnProperty.call(currentMap, tab.id)) {
            if (!changed) {
              nextMap = Object.assign({}, currentMap);
              changed = true;
            }
            delete nextMap[tab.id];
          }
          return;
        }
        const current = currentMap[tab.id];
        const currentIsValid = current && subtabs.some(function(subtab) {
          return subtab.id === current && subtab.enabled !== false;
        });
        if (!currentIsValid) {
          const fallbackId = getFirstEnabledSubtabId(subtabs);
          if (fallbackId) {
            if (!changed) {
              nextMap = Object.assign({}, currentMap);
              changed = true;
            }
            nextMap[tab.id] = fallbackId;
          }
        }
      });
      if (changed) {
        activeSubtabId.value = nextMap;
      }
    },
    [schema]
  );
  const getFirstEnabledSubtabId = function(subtabs) {
    var _a, _b;
    if (!subtabs || subtabs.length === 0) {
      return void 0;
    }
    const firstEnabled = subtabs.find(function(subtab) {
      return subtab.enabled !== false;
    });
    if (firstEnabled) {
      return firstEnabled.id;
    }
    return ((_a = subtabs[0]) == null ? void 0 : _a.id) || ((_b = subtabs[0]) == null ? void 0 : _b.id) || "";
  };
  const activeTab = schema ? schema.tabs.find(function(tab) {
    return tab.id === activeTabId.value;
  }) : void 0;
  const activeTabSubtabs = activeTab && activeTab.uiSubtabs ? activeTab.uiSubtabs : [];
  const resolvedSubtabId = activeTab && activeTabSubtabs.length > 0 ? activeSubtabId.value[activeTab.id] || getFirstEnabledSubtabId(activeTabSubtabs) : void 0;
  const renderActiveContent = function() {
    if (!activeTab) {
      return null;
    }
    const isHomeTab = activeTab.preset === "home" || activeTab.id === "tab-home";
    if (isHomeTab) {
      return /* @__PURE__ */ u(HomeLayout, { sections: activeTab.sections });
    }
    if (activeTabSubtabs.length > 0) {
      if (!resolvedSubtabId) {
        return null;
      }
      const currentSubtab = activeTabSubtabs.find(function(subtab) {
        return subtab.id === resolvedSubtabId;
      });
      if (!currentSubtab) {
        return null;
      }
      const activeSection = activeTab.sections.find(function(section) {
        return section.id === currentSubtab.sectionId && section.enabled !== false;
      });
      if (activeSection) {
        return /* @__PURE__ */ u(Section, { section: activeSection, hideTitle: true }, activeSection.id);
      }
      return /* @__PURE__ */ u("div", { style: { padding: "2rem", textAlign: "center", color: "var(--color-text)" }, children: "No content available for this section" });
    }
    const enabledSections = activeTab.sections.filter(function(section) {
      return section.enabled !== false;
    });
    return /* @__PURE__ */ u("div", { children: enabledSections.map(function(section) {
      return /* @__PURE__ */ u(Section, { section }, section.id);
    }) });
  };
  return /* @__PURE__ */ u(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "2rem",
        textAlign: "center"
      },
      children: [
        isLoading && /* @__PURE__ */ u(
          "div",
          {
            style: {
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "500px"
            },
            children: [
              /* @__PURE__ */ u(
                "div",
                {
                  style: {
                    fontSize: "2rem",
                    marginBottom: "1rem"
                  },
                  children: "⏳"
                }
              ),
              /* @__PURE__ */ u(
                "h2",
                {
                  style: {
                    fontSize: "1.5rem",
                    marginBottom: "0.5rem",
                    color: "#e2e8f0"
                  },
                  children: "Loading Schema..."
                }
              ),
              /* @__PURE__ */ u("p", { style: { color: "#94a3b8", fontSize: "0.875rem" }, children: "Fetching and validating configuration" })
            ]
          }
        ),
        error && !isLoading && /* @__PURE__ */ u(
          "div",
          {
            style: {
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "500px"
            },
            children: [
              /* @__PURE__ */ u(
                "div",
                {
                  style: {
                    fontSize: "2rem",
                    marginBottom: "1rem"
                  },
                  children: "❌"
                }
              ),
              /* @__PURE__ */ u(
                "h2",
                {
                  style: {
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                    color: "#fca5a5"
                  },
                  children: "Schema Load Error"
                }
              ),
              /* @__PURE__ */ u(
                "p",
                {
                  style: {
                    color: "#fca5a5",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    background: "rgba(0, 0, 0, 0.3)",
                    padding: "1rem",
                    borderRadius: "4px",
                    wordBreak: "break-word"
                  },
                  children: error
                }
              ),
              /* @__PURE__ */ u(
                "button",
                {
                  onClick: function() {
                    loadSchema();
                  },
                  style: {
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  },
                  children: "Retry"
                }
              )
            ]
          }
        ),
        schema && !isLoading && !error && /* @__PURE__ */ u(
          "div",
          {
            style: {
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column"
            },
            children: [
              /* @__PURE__ */ u(
                StatusBar,
                {
                  leftInfo: "INTERIOR: 72°F",
                  centerInfo: "EXTERIOR: 65°F",
                  rightInfo: "TIME TO GO: 3:42"
                }
              ),
              activeTab && activeTabSubtabs.length > 0 && resolvedSubtabId && /* @__PURE__ */ u(
                SubtabBar,
                {
                  subtabs: activeTabSubtabs,
                  activeSubtabId: resolvedSubtabId,
                  onSubtabChange: function(subtabId) {
                    const currentMap = activeSubtabId.value;
                    if (currentMap[activeTab.id] === subtabId) {
                      return;
                    }
                    const nextMap = Object.assign({}, currentMap);
                    nextMap[activeTab.id] = subtabId;
                    activeSubtabId.value = nextMap;
                  }
                }
              ),
              /* @__PURE__ */ u(
                "div",
                {
                  className: "gcg-main-content",
                  style: {
                    flex: 1,
                    overflow: "hidden",
                    padding: "1rem"
                  },
                  children: renderActiveContent()
                }
              ),
              /* @__PURE__ */ u(
                TabBar,
                {
                  tabs: schema.tabs,
                  activeTabId: activeTabId.value || "",
                  onTabChange: function(tabId) {
                    activeTabId.value = tabId;
                    if (!schema) {
                      return;
                    }
                    const targetTab = schema.tabs.find(function(tab) {
                      return tab.id === tabId;
                    });
                    if (!targetTab || !targetTab.uiSubtabs || targetTab.uiSubtabs.length === 0) {
                      const currentMap2 = activeSubtabId.value;
                      if (Object.prototype.hasOwnProperty.call(currentMap2, tabId)) {
                        const nextMap2 = Object.assign({}, currentMap2);
                        delete nextMap2[tabId];
                        activeSubtabId.value = nextMap2;
                      }
                      return;
                    }
                    const fallbackId = getFirstEnabledSubtabId(targetTab.uiSubtabs);
                    if (!fallbackId) {
                      return;
                    }
                    const currentMap = activeSubtabId.value;
                    if (currentMap[tabId] === fallbackId) {
                      return;
                    }
                    const nextMap = Object.assign({}, currentMap);
                    nextMap[tabId] = fallbackId;
                    activeSubtabId.value = nextMap;
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
};
console.log("=== HMI UI STARTING ===");
console.log("Location:", window.location.href);
const isDebug = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
console.log("Debug mode:", isDebug);
console.log("Initializing WebSocket...");
initializeWebSocket(isDebug);
const root = document.getElementById("root");
console.log("Root element found:", !!root);
if (!root) {
  console.error("ROOT ELEMENT NOT FOUND!");
  throw new Error("Root element not found");
}
console.log("Rendering app...");
G(/* @__PURE__ */ u(App, {}), root);
console.log("App rendered successfully");

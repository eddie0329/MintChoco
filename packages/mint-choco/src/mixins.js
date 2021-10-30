import _get from "lodash/get";
import _isArray from "lodash/isArray";
import _isObject from "lodash/isObject";
import { err } from "../utils";

const typeValidator = {
  data: {
    string: true,
  },
  validate(el) {
    this.data[typeof el] ?? err(`el must string: ${el} : ${typeof el}`);
  },
};

const objectEntryMapper = ({ name, contextValue, entries }) => {
  const _target = {};
  Object.entries(entries).forEach(([key, value]) => {
    typeValidator.validate(value);
    _target[key] = function (payload) {
      const valueGotten = _get(this, `${name}.${contextValue}.${value}`);
      return typeof valueGotten === "function"
        ? valueGotten(payload)
        : valueGotten;
    };
  });
  return _target;
};

const arrayEntryMapper = ({ name, contextValue, entries }) => {
  const _target = {};
  entries.forEach((entry) => {
    typeValidator.validate(entry);
    _target[entry] = function (payload) {
      const valueGotten = _get(this, `${name}.${contextValue}.${entry}`);
      return typeof valueGotten === "function"
        ? valueGotten(payload)
        : valueGotten;
    };
  });
  return _target;
};

const getMappedTarget = ({ name, contextValue, target, entries }) => {
  switch (true) {
    case _isArray(entries):
      return arrayEntryMapper({ name, contextValue, target, entries });
    case _isObject(entries):
      return objectEntryMapper({ name, contextValue, target, entries });
    default:
      err(`entries should either array or object: ${entries}`);
  }
};

export const mapContextState = (name) => {
  const _mapContextState = (state) => {
    let _state = getMappedTarget({
      name,
      contextValue: "state",
      entries: state,
    });
    return {
      inject: [name],
      computed: {
        ..._state,
      },
      beforeDestroy() {
        _state = null;
      },
    };
  };
  return _mapContextState;
};

export const mapContextGetters = (name) => {
  const _mapContextGetters = (getters) => {
    let _getters = getMappedTarget({
      name,
      contextValue: "getters",
      entries: getters,
    });
    return {
      inject: [name],
      computed: {
        ..._getters,
      },
      beforeDestroy() {
        _getters = null;
      },
    };
  };
  return _mapContextGetters;
};

export const mapContextMutations = (name) => {
  const _mapContextMutations = (mutations) => {
    let _mutations = getMappedTarget({
      name,
      contextValue: "mutations",
      entries: mutations,
    });
    return {
      inject: [name],
      methods: {
        ..._mutations,
      },
      beforeDestroy() {
        _mutations = null;
      },
    };
  };
  return _mapContextMutations;
};

import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import { err } from '../utils';

const typeValidator = {
  data: {
    string: true,
  },
  validate(el) {
    this.data[typeof el] ?? err(`el must string: ${el} : ${typeof el}`);
  }
};

const objectEntryMapper = ({ contextValue, target, entries }) => {
  Object.entries(entries).forEach(([key, value]) => {
    typeValidator.validate(value);
    target[key] = function(payload) {
      const valueGotten = _get(this, `${contextValue}.${value}`);
      return typeof valueGotten === 'function'
        ? valueGotten(payload)
        : valueGotten;
    };
  });
};

const arrayEntryMapper = ({ contextValue, target, entries }) => {
  entries.forEach(entry => {
    typeValidator.validate(entry);
    target[entry] = function(payload) {
      const valueGotten = _get(this, `${contextValue}.${entry}`);
      return typeof valueGotten === 'function'
        ? valueGotten(payload)
        : valueGotten;
    };
  });
};

const entryTypeTable = ({ contextValue, target, entries }) => {
  switch (true) {
    case _isArray(entries):
      arrayEntryMapper({ contextValue, target, entries });
      break;
    case _isObject(entries):
      objectEntryMapper({ contextValue, target, entries });
      break;
    default:
      err(`entries should either array or object: ${entries}`);
  }
};

export const mapContextState = state => {
  let _state = {};
  const contextValue = 'state';
  entryTypeTable({ 
    contextValue, 
    target: _state, 
    entries: state 
  });
  return {
    inject: [contextValue],
    computed: {
      ..._state
    },
    beforeDestroy() {
      _state = null;
    }
  };
};

export const mapContextGetters = getters => {
  let _getters = {};
  const contextValue = 'getters';
  entryTypeTable({
    contextValue,
    target: _getters,
    entries: getters
  });
  return {
    inject: [contextValue],
    computed: {
      ..._getters
    },
    beforeDestroy() {
      _getters = null;
    }
  };
};

export const mapContextMutations = mutations => {
  let _mutations = {};
  const contextValue = 'mutations';
  entryTypeTable({
    contextValue,
    target: _mutations,
    entries: mutations
  });
  return {
    inject: [contextValue],
    methods: {
      ..._mutations
    },
    beforeDestroy() {
      _mutations = null;
    }
  };
};
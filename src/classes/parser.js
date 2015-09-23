/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 20:56, 06/09/15.
 */

'use strict';

const TYPES = {
  DATE: ['before', 'after'],
  NUMBER: ['greater', 'smaller', 'min', 'max', 'divisible', 'divisibleby'],
  STRING: ['contains', 'alphanumeric', 'numeric', 'equals', 'alpha', 'len', 'length', 'bytelength', 'lowercase', 'uppercase', 'null'],
  STANDALONE: ['email', 'regex', 'url', 'json', 'ip', 'ipv4', 'ipv6', 'uuid', 'uuidv3', 'uuidv4', 'uuidv5', 'array', 'creditcard', 'int', 'float', 'decimal', 'date', 'hexadecimal', 'hexcolor'],
  PATTERN: ['matches', 'is', 'not'],
  BOOL: ['boolean'],
  ARRAY: ['in'],
  NONE: ['empty']
};

const STANDALONE = {
  EMAIL: 'email address',
  CREDITCARD: 'credit card number',
  INT: 'integer value',
  FLOAT: 'float value',
  DECIMAL: 'decimal value',
  IP: 'ip address',
  IPV4: 'ipv4 address',
  IPV6: 'ipv6 address',
  JSON: 'json string',
  HEXCOLOR: 'hex color code'
};

const STRING = {
  LOWERCASE: 'consist of lowercase letters',
  UPPERCASE: 'consist of uppercase letters',
  ALPHA: 'consist of only letters',
  ALPHANUMERIC: 'consist of only letters & numbers',
  EQUALS: 'equal to %s',
  CONTAINS: 'containing %s in it',
  LEN: 'between %s to %s characters',
  LENGTH: 'between %s to %s characters',
  BYTELENGTH: 'between %s to %s characters',
  ATLEAST: 'at least %s characters long',
  NUMERIC: 'consist of only numbers',
  NULL: 'a null string'
};

const PATTERN = {
  MATCHES: 'matching with %s regex',
  IS: 'matching with %s regex',
  NOT: 'matching with %s regex'
};

const NUMBER = {
  GREATER: 'greater than %s',
  SMALLER: 'smaller than %s',
  MIN: 'minimum %s',
  MAX: 'maximum %s',
  DIVISIBLE: 'divisible by %s',
  DIVISIBLEBY: 'divisible by %s'
};

const BOOL = {
  BOOLEAN: 'either %s or %s'
};

const ARRAY = {
  BINARY: 'either %s or %s',
  N: 'one of these values (%s)',
  ONE: 'equal to %s'
};

import { format } from 'util';

import { humanize, flatten } from '../utils';

export default class Parser {

  /**
   * Static method to parse operator.
   *
   * Possible inputs can be:
   * - Positives: empty, isEmpty, !notEmpty, !isNotEmpty
   * - Negatives: !empty, !isEmpty, notEmpty
   * @param operator
   * @returns {*[]}
   */
  static operator(operator) {
    let _count = 0;
    let _not = false;
    let _operator;
    let _type;

    operator = String(operator);
    if (operator.includes('!')) {
      _not = !_not;
      _count++;
    }
    if (operator.substr(0, 3).toLowerCase().includes('is')) _count += 2;
    if (operator.includes('not')) {
      _not = !_not;
      _count += 3;
    }
    _operator = operator.substr(_count, operator.length).toLowerCase();
    _type = Parser.type(_operator);

    return [_not, _operator, _type];
  }

  /**
   * Static method to get the type of the operator.
   *
   * @param operator
   * @returns {string}
   */
  static type(operator) {
    if (!Parser.isSupported(operator)) throw new Error(`Provided operator \`${operator}\` is not supported.`);
    for (let type of Object.keys(TYPES)) {
      if (Parser._containsAny(operator, TYPES[type])) return String(type).toLowerCase();
    }
  }

  /**
   * Static method that wraps all type wise operations.
   *
   * @returns {*}
   */
  static get methods() {
    return {
      date() {
        let [_operator, _args] = Array.from(arguments);
        return `${_operator} than ${ humanize(_args) }`;
      },
      number() {
        let [_operator, _args] = Array.from(arguments);
        return `${format(NUMBER[_operator.toUpperCase()], _args) || _operator }`;
      },
      string() {
        let [_operator, _args] = Array.from(arguments);
        let _msg;

        if (_operator === 'len' || _operator === 'length' || _operator === 'bytelength' || _operator === 'equals' || _operator === 'contains') {
          if ((_operator === 'len' || _operator === 'length' || _operator === 'bytelength') && _args.length === 1) _operator = 'atleast';
          _msg = format(STRING[_operator.toUpperCase()], ..._args);
        }
        else _msg = `${ STRING[_operator.toUpperCase()] || _operator }`;

        return _msg;
      },
      standalone() {
        let [_operator] = Array.from(arguments);
        return `a valid ${ STANDALONE[_operator.toUpperCase()] || _operator }`;
      },
      bool() {
        let [_operator, _args] = Array.from(arguments);
        return `${format(BOOL[_operator.toUpperCase()], ..._args) || _operator }`;
      },
      array() {
        let [, _args] = Array.from(arguments);
        let _msg;

        if (Array.isArray(_args)) _args = flatten(_args);

        if (_args.length === 2) _msg = `${ format(ARRAY['BINARY'], ..._args) }`;
        else if (_args.length > 2) _msg = `${ format(ARRAY['N'], _args.join(', ')) }`;
        else _msg = `${ format(ARRAY['ONE'], typeof _args[0] === 'object' ? JSON.stringify(_args[0]) : _args[0]) }`;

        return _msg;
      },
      pattern() {
        let [_operator, _args] = Array.from(arguments);
        let _regex;

        if (_args.length > 1) _regex = new RegExp(_args[0], _args[1]);
        else _regex = new RegExp(_args[0]);

        return `${format(PATTERN[_operator.toUpperCase()], _regex) || _operator }`;
      },
      none(operator) {
        return operator;
      }
    };
  }

  /**
   * Return true if provided operator is valid.
   *
   * @param operator
   * @returns {*}
   */
  static isSupported(operator) {
    let _all = [];
    operator = String(operator).toLowerCase();

    if (operator === 'not' || operator === 'is' || operator === 'notnot' || operator === 'isis') return true;

    for (let type of Object.keys(TYPES)) {
      _all.push(...TYPES[type]);
    }

    _all.splice(_all.indexOf('not'), 1);
    _all.splice(_all.indexOf('is'), 1);

    return Parser._containsAny(operator, _all);
  }

  /**
   * Search through an array and returns true if any value of array matches the provided needle.
   *
   * @param needle
   * @param haystack
   * @returns {boolean}
   * @private
   */
  static _containsAny(needle, haystack) {
    for (let straw of haystack) {
      if (needle.indexOf(straw.toLowerCase()) > -1) return true;
    }
    return false;
  }

  /**
   * Parse arguments.
   *
   * @returns {*[]}
   */
  static args() {
    let [_first, _second, _third] = Array.from(arguments);
    return Parser.isSupported(_first) ? [_third, _first, _second] : [_first, _second, _third];
  }
}

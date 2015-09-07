/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 20:56, 06/09/15.
 */

'use strict';

const TYPES = {
  DATE: ['before', 'after'],
  NUMBER: ['greater', 'smaller', 'min', 'max'],
  STRING: ['contains', 'alphanumeric', 'equals', 'alpha', 'len', 'length', 'lowercase', 'uppercase'],
  STANDALONE: ['email', 'url', 'ip', 'uuid', 'array', 'creditcard', 'int', 'float', 'decimal', 'date'],
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
  IP: 'ip address'
};

const STRING = {
  LOWERCASE: 'consist of lowercase letters',
  UPPERCASE: 'consist of uppercase letters',
  ALPHA: 'consist of only letters',
  ALPHANUMERIC: 'consist of only letters & numbers',
  EQUALS: 'equal to %s',
  CONTAINS: 'contains %s in it',
  LEN: 'between %s to %s characters',
  LENGTH: 'between %s to %s characters'
};

const NUMBER = {
  GREATER: 'greater than %s',
  SMALLER: 'smaller than %s',
  MIN: 'minimum %s',
  MAX: 'maximum %s'
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

import { humanize } from '../utils';

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

    if (operator.includes('!')) {
      _not = !_not;
      _count++;
    }
    if (operator.includes('is')) _count += 2;
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
      if (TYPES[type].includes(operator)) return String(type).toLowerCase();
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

        if (_operator === 'len' || _operator === 'length' || _operator === 'equals' || _operator === 'contains') _msg = format(STRING[_operator.toUpperCase()], ..._args);
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

        if (_args.length === 2) _msg = `${ format(ARRAY['BINARY'], ..._args) }`;
        else if (_args.length > 2) _msg = `${ format(ARRAY['N'], _args.join(', ')) }`;
        else _msg = `${ format(ARRAY['ONE'], ..._args) }`;

        return _msg;
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
    for (let type of Object.keys(TYPES)) {
      _all.push(...TYPES[type]);
    }
    return Parser._containsAny(operator.toLowerCase(), _all);
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
      if (needle.includes(straw)) return true;
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

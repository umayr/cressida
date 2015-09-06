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
  ARRAY: ['in']
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

  static type(operator) {
    for (let type of Object.keys(TYPES)) {
      if (TYPES[type].includes(operator)) return String(type).toLowerCase();
    }
    return 'none';
  }

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

;
}

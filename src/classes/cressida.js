/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 17:05, 17/08/15.
 */

'use strict';

const DEFAULTS = {
  auxiliary: 'should'
};

import Parser from './parser';

export default class Cressida {
  static message(name, operator, args) {
    if (typeof operator === 'undefined' || !operator) throw new Error('Operator can\'t be empty.');

    let [_not, _operator, _type] = Parser.operator(operator);
    let options = Cressida._options;
    let base = `${options.auxiliary} ${ _not ? 'not be' : 'be'}`;
    let suffix = Parser.methods[_type](_operator, args);

    return `${name} ${base} ${suffix}.`;
  }

  static create(options) {
    Cressida._options = Object.assign({}, DEFAULTS, options);
    return Cressida.message;
  }
}

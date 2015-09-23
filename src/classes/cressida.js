/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 17:05, 17/08/15.
 */

'use strict';

const DEFAULTS = {
  auxiliary: 'should',
  includeName: true
};

import Parser from './parser';

export default class Cressida {
  /**
   * Core method to generate messages.
   *
   * @returns {*}
   */
  static message() {
    let [_name, _raw, _args] = Parser.args(...arguments);
    if (typeof _raw === 'undefined' || !_raw) throw new Error('Operator can\'t be empty.');

    let [_not, _operator, _type] = Parser.operator(_raw);
    let options = Cressida._options;
    let base = `${options.auxiliary} ${ _not ? 'not be' : 'be'}`;
    let suffix = Parser.methods[_type](_operator, _args);

    return (options.includeName && typeof _name !== 'undefined') ? `${_name} ${base} ${suffix}.` : `${base} ${suffix}.`;
  }

  /**
   * Factory method that return the main function to generate messages.
   *
   * @param options
   * @returns {Cressida.message}
   */
  static create(options) {

    // Polyfill for string.includes();
    if (!String.prototype.includes) {
      String.prototype.includes = () => {
        return String.prototype.indexOf.apply(this, arguments) > -1;
      };
    }

    // Polyfill for array.includes();
    if (!Array.prototype.includes) {
      Array.prototype.includes = () => {
        return Array.prototype.indexOf.apply(this, arguments) > -1;
      };
    }

    Cressida._options = Object.assign({}, DEFAULTS, options);
    return Cressida.message;
  }
}

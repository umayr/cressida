/**
 * Created by Umayr Shahid on 8/18/2015.
 */

/* eslint-env node, mocha */
'use strict';

import { equal } from 'assert';

import Cressida from '../src';

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function make(operator, message, args, instance = Cressida.create()) {
  let positives = [operator, `is${ capitalise(operator) }`, `!not${ capitalise(operator) }`];
  let negatives = [`!${operator}`, `not${ capitalise(operator) }`];

  positives.map((o) => {
    equal(instance('foo', o, args), `foo ${ Cressida._options.auxiliary } be ${ message }`);
    equal(instance(o, args), `${ Cressida._options.auxiliary } be ${ message }`);
  });

  negatives.map((o) => {
    equal(instance('foo', o, args), `foo ${ Cressida._options.auxiliary } not be ${ message }`);
    equal(instance(o, args), `${ Cressida._options.auxiliary } not be ${ message }`);
  });
}

describe('Cressida', () => {
  describe('generic', () => {
    let Message = Cressida.create();

    describe('#string', () => {

      let src = {
        alpha: {
          message: 'consist of only letters.'
        },
        alphanumeric: {
          message: 'consist of only letters & numbers.'
        },
        uppercase: {
          message: 'consist of uppercase letters.'
        },
        lowercase: {
          message: 'consist of lowercase letters.'
        },
        equals: {
          message: 'equal to bar.',
          args: ['bar']
        },
        contains: {
          message: 'containing bar in it.',
          args: ['bar']
        },
        length: {
          message: 'between 10 to 20 characters.',
          args: [10, 20]
        }
      };

      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          make(operator, src[operator].message, src[operator].args, Message);
        });
      }

    });
    describe('#number', () => {

      let src = {
        greater: {
          message: 'greater than 5.',
          args: ['5']
        },
        smaller: {
          message: 'smaller than 5.',
          args: [5]
        },
        max: {
          message: 'maximum 5.',
          args: 5
        },
        min: {
          message: 'minimum 5.',
          args: 5
        },
        divisible: {
          message: 'divisible by 5.',
          args: 5
        }
      };
      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          make(operator, src[operator].message, src[operator].args, Message);
        });
      }
    });
    describe('#date', () => {
      let src = {
        before: {
          message: 'before than 5th September 2015.',
          args: new Date('09/05/2015')
        },
        after: {
          message: 'after than 5th September 2015.',
          args: '09/05/2015'
        }
      };

      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          make(operator, src[operator].message, src[operator].args, Message);
        });
      }
    });
    describe('#standalone', () => {
      let src = {
        email: {
          message: 'a valid email address.'
        },
        creditcard: {
          message: 'a valid credit card number.'
        },
        int: {
          message: 'a valid integer value.'
        },
        float: {
          message: 'a valid float value.'
        },
        decimal: {
          message: 'a valid decimal value.'
        },
        array: {
          message: 'a valid array.'
        },
        ip: {
          message: 'a valid ip address.'
        },
        ipv4: {
          message: 'a valid ipv4 address.'
        },
        ipv6: {
          message: 'a valid ipv6 address.'
        },
        json: {
          message: 'a valid json string.'
        },
        url: {
          message: 'a valid url.'
        },
        uuid: {
          message: 'a valid uuid.'
        },
        date: {
          message: 'a valid date.'
        }
      };

      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          make(operator, src[operator].message, src[operator].args, Message);
        });
      }
    });
    describe('#boolean', () => {
      let src = {
        boolean: {
          message: 'either male or female.',
          args: ['male', 'female']
        }
      };

      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          make(operator, src[operator].message, src[operator].args, Message);
        });
      }
    });
    describe('#array', () => {
      let src = {
        'in': [
          {
            message: 'either male or female.',
            args: ['male', 'female']
          },
          {
            message: 'equal to male.',
            args: ['male']
          },
          {
            message: 'one of these values (1, 2, 3, 4, 5).',
            args: [1, 2, 3, 4, 5]
          }
        ]
      };

      for (let operator of Object.keys(src)) {
        it(`should generate \`${operator}\` messages`, () => {
          src[operator].map((elem) => {
            make(operator, elem.message, elem.args, Message);
          });
        });
      }
    });
  });
  describe('options', () => {
    describe('#auxiliary', () => {
      it('should set the `auxiliary` option correctly', () => {
        {
          let Message = Cressida.create({auxiliary: 'must'});
          equal(Message('foo', '!empty'), 'foo must not be empty.');
        }

        {
          let Message = Cressida.create({auxiliary: 'can'});
          equal(Message('foo', 'empty'), 'foo can be empty.');
        }
      });
      it('should set the `includeName` option correctly', () => {
        let Message = Cressida.create({includeName: false});

        equal(Message('foo', '!empty'), 'should not be empty.');
        equal(Message('foo', 'len', [10, 20]), 'should be between 10 to 20 characters.');
      });
    });
  });
  describe('exceptions', () => {
    describe('#len', () => {
      it('should work with aliases like length & bytelength', () => {
        let Message = Cressida.create();

        equal('should be between 10 to 20 characters.', Message('len', [10, 20]));
        equal('should be between 10 to 20 characters.', Message('length', [10, 20]));
        equal('should be between 10 to 20 characters.', Message('bytelength', [10, 20]));
      });

      it('should be a bit more intelligent', () => {
        let Message = Cressida.create();

        equal('should be 3 characters long.', Message('len', [3, 3]));
        equal('should be at least 3 characters long.', Message('len', [3, undefined]));
        equal('should be at least 3 characters long.', Message('len', [3, 0]));
        equal('should be at max 3 characters long.', Message('len', [undefined, 3]));
        equal('should be at max 3 characters long.', Message('len', [0, 3]));
      });
    });
    describe('#all', () => {
      it('should work if the name contains any operator', () => {
        let Message = Cressida.create();

        equal('Middle Initial should be at max 3 characters long.', Message('Middle Initial', 'len', [0, 3]));
        equal('Alphabetic should be at max 3 characters long.', Message('Alphabetic', 'len', [0, 3]));
      });
    });
  });
});

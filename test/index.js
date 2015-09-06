/**
 * Created by Umayr Shahid on 8/18/2015.
 */

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
  });

  negatives.map((o) => {
    equal(instance('foo', o, args), `foo ${ Cressida._options.auxiliary } not be ${ message }`);
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
          message: 'contains bar in it.',
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

    describe('#auxiliary', () =>{
      it('should set the options correctly', () => {
        {
          let Message = Cressida.create({auxiliary : 'must'});
          equal(Message('foo', '!empty'), 'foo must not be empty.')
        }

        {
          let Message = Cressida.create({auxiliary : 'can'});
          equal(Message('foo', 'empty'), 'foo can be empty.')
        }
      })
    });

  });
});

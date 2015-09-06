## Cressida
> Validation messages done simply.

Sole purpose of this library is to generate validation error messages to provide application wide consistency. The perfect use could be automatic message generation as [Uranus](https://github.com/umayr/uranus) does.

### Installation

``` bash
 $ npm install --save cressida
```

### Tests

``` bash
 # clone this repository & change directory
 $ git clone https://github.com/umayr/cressida && cd $_
 
 # install dependencies
 $ npm install
 
 # run tests
 $ npm test
```

### API

``` javascript
 var Cressida = require('cressida');
 var Message = Cressida.create();
 
 Message('foo', '!empty') // foo should not be empty.
```
Cressida supports numerous operators such as: 
```
 'contains', // string contains a substring
 'alphanumeric', // string is alphanumeric
 'equals', // string equals to another string
 'alpha', // string consists for only letters
 'len', // string is between given length
 'length', // alias for `len`
 'lowercase', // string is lowercase
 'uppercase', // string is uppercase
 'email', // value is email
 'url', // value is url
 'ip', // value is ip address
 'uuid', // value is valid uuid
 'array', // value is an array
 'creditcard', // value is a credit card number
 'int', // value is an integer
 'float', // value is a float number
 'decimal', // value is decimal number
 'date', // value is valid date
 'boolean', // value is either this or that
 'in', // value is in provided array
 'before', // date is before than provided date
 'after', // date is after than provided date
 'greater', // number is greater than provided value
 'smaller', // number is smaller than provided value
 'min', // number limit is minimum this
 'max' // number limit is maximum this
```

Every operator can be either positive or negative using `!`, `is` and/or `not` prefixes.

``` javascript
 Message('foo', 'empty') // foo should be empty.
 Message('foo', '!empty') // foo should not be empty.
 Message('foo', 'isEmpty') // foo should be empty.
 Message('foo', '!isEmpty') // foo should not be empty.
 Message('foo', 'notEmpty') // foo should not be empty.
 Message('foo', '!notEmpty') // foo should be empty.
 Message('foo', 'isNotEmpty') // foo should not be empty.
 Message('foo', '!isNotEmpty') // foo should be empty.
```

### Options

Right now, Cressida only supports to change auxiliary verb in the message that is `should` by default.

``` javascript
 var Message = Cressida.create({ auxiliary : 'must' });
 
 Message('foo', '!empty') // foo must not be empty.
```

### Examples

``` javascript
 Message('birth date', 'before', '09/05/2014'); // birth date should be before than 9th September 2014.
 Message('first name', 'length', [10, 20]); // first name should be between 10 to 20 characters.
 Message('username', 'alphanumeric'); // username should be consist of only letters & numbers.
 Message('age', 'min', 13); // age should be minimum 13.
 Message('birth date', 'date'); // birth date should be a valid date.
 Message('gender', 'boolean', ['male', 'female']); // gender should be either male or female.
 Message('fruit', 'in', ['apple', 'orange']); // fruit should be either apple or orange.
 Message('selected number', 'in', [1, 2, 3, 4, 5, 6]); // selected number should be one of these values (1, 2, 3, 4, 5, 6).
```
### Contribute

If there is any idea, feedback, issue you may consider worth mentioning, please feel free to open an issue or send a pull request.

### Lisence

```
The MIT License (MIT)

Copyright (c) 2015 Umayr Shahid <umayrr@hotmail.co.uk>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

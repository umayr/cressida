/**
 * Author: Umayr Shahid <umayrr@hotmail.com>,
 * Created: 21:00, 06/09/15.
 */

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Makes date a bit more humane.
 *
 * @param value
 * @returns {*}
 */
export function humanize(value) {
  let _date = (typeof value === 'undefined') ? new Date() : new Date(value);

  if (_date.toDateString() === 'Invalid Date') throw new Error('Invalid date.');

  return `${ _date.getDate() }th ${ MONTHS[_date.getMonth()] } ${ _date.getFullYear() }`;
}

export const inputAlphaNumeric = (e, callback) => {
  const value = e ? e.replace(/[^0-9a-zA-Z]+/gi, '') : '';

  if (e !== value) {
    e = value;
  }

  if (typeof callback === 'function') {
    return callback(value);
  }
};

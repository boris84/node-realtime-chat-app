let moment = require('moment');

let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf() // returns the Unix Timestamp in milliseconds.
  };
};


let generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf() // returns the Unix Timestamp in milliseconds.
  };
};

module.exports = {generateMessage, generateLocationMessage};

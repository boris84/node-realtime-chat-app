let moment = require('moment');

let generateMessage = (from, text, backgroundColor) => {
  return {
    from,
    text,
    backgroundColor,
    createdAt: moment().valueOf() // returns the Unix Timestamp in milliseconds.
  };
};


let generateLocationMessage = (from, latitude, longitude, backgroundColor) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    backgroundColor,
    createdAt: moment().valueOf() // returns the Unix Timestamp in milliseconds.
  };
};


let generateImage = (from, image, backgroundColor) => {
  return {
    from,
    image,
    backgroundColor,
    createdAt: moment().valueOf() // returns the Unix Timestamp in milliseconds.
  };
};

module.exports = {generateMessage, generateLocationMessage, generateImage};

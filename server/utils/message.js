let moment = require('moment');

let generateMessage = (from, text, sound) => {
  return {
    from,
    text,
    sound,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage};

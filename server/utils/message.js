let moment = require('moment');

let generateMessage = (from, text, notification) => {
  return {
    from,
    text,
    notification,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage};

const expect = require('expect');
const {generateMessage, generateLocationMessage, generateImage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Bob';
    let text = 'Some message';
    let backgroundColor = 'blue';
    let message = generateMessage(from, text, backgroundColor);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text, backgroundColor});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Jon';
    let latitude = 13;
    let longitude = 17;
    let backgroundColor = 'red'
    let url = 'https://www.google.com/maps?q=13,17';
    let message = generateLocationMessage(from, latitude, longitude, backgroundColor);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url, backgroundColor});
  });
});

describe('generateImage', () => {
  it('should generate correct message object', () => {
    let from = 'Harry';
    let image = 'Some image';
    let backgroundColor = 'green';
    let message = generateImage(from, image, backgroundColor);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, image, backgroundColor});
  });
});

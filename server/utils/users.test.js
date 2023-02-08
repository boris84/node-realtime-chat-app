const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Harry',
      room: 'Room A',
      backgroundColor: 'yellow'
    },
    {
      id: '2',
      name: 'Jon',
      room: 'Room B',
      backgroundColor: 'blue'
    },
    {
      id: '3',
      name: 'Abraham',
      room: 'Room A',
      backgroundColor: 'green'
    }];
  });

  it('should add new user', () => {
     let users = new Users();
     let user = {
       id: '938',
       name: 'Bob',
       room: 'The Elite',
       backgroundColor: 'red'
     };
   let resUser = users.addUser(user.id, user.name, user.room, user.backgroundColor);
   expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '2';
    let user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2)
  });

  it('should not remove user', () => {
    let userId = '44';
    let user = users.removeUser(userId);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    let userId = '1';
    let user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find a user', () => {
    let userId = '13';
    let user = users.getUser(userId);
    expect(user).toNotExist();
  });

  it('should return names for room a', () => {
    let userList = users.getUserList('Room A');
    expect(userList).toEqual(['Harry', 'Abraham']);
  });

  it('should return names for room b', () => {
    let userList = users.getUserList('Room B');
    expect(userList).toEqual(['Jon']);
  });
});

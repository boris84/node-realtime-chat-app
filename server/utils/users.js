[
  {
     id: "/#923dnci233438jfncrf3dc",
     name: 'Bob',
     room: 'The Elite',
     backgroundColor: 'red'
  }
]

// add user(id, name, room, backgroundColor) - post
// removeUser(id) - delete
// getUser - get single user
// getUserList(room) - get all users


class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room, backgroundColor) {
    let user = {id, name, room, backgroundColor};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    let user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id)
    }

    return user;
  }
  getUser (id) {
    // get a single user by id
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList (room) {
    // get a list of all the usernames by roomname which means iterating through users array and looking for all users who's room matches the room specified. Returns an array of strings.
    let users = this.users.filter((user) => user.room === room);
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users};


// class Person {
//   constructor (name, age) {
//     this.name = name;
//     this.age = age;
//   }
//   getUserDescription() {
//     return `${this.name} is ${this.age} years old`;
//   }
// }
//
// let me = new Person('harry', 20);
// let description = me.getUserDescription();
// console.log(description)

const axios = require('axios');
const Dev = require('../models/Dev');
const begin = require('../../../scrape/index.js')

module.exports = {
  async index(req, res) {
    const { user, password } = req.headers;
    console.log(user, password)

    const loggedDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ],
    })

    return res.json(users);
  },

  async store(req, res) {
    const { username, password } = req.body;
    console.log(username, password)
    x = await begin.begin(username, password)

    x = x.substring(3);
    console.log("Searching for user id", x);
    let userExists = await Dev.findOne({ user: x });
    if (userExists) {
      return res.json(userExists);
    }

    for (let i = 0; i < 5; i++) {
      await new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, 10000);
      })
      console.log('we waited maybe')

      userExists = await Dev.findOne({ user: x });
      console.log(userExists)
      if (userExists) {
        return res.json(userExists);
      }
    }
    console.log('yo dawg no user found :"((((((')

    //const response = await axios.get(`https://api.github.com/users/${username}`);
    /*
        const { name, bio, avatar_url: avatar } = response.data;
    
        const dev = await Dev.create({
          name,
          user: username,
          bio,
          avatar
        })
    */
    return;
  }
};

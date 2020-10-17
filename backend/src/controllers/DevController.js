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
    begin.begin(username, password)

    const userExists = await Dev.findOne({ user: username });
    if (userExists) {
     console.log("User", username, "already exists")
    } else {
      //
    }
    return;
  }
};

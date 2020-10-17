const dependencies = {
  fs: require('fs'),
  config: require('../config.json'),
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const DevSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  // TODO Add a "sources" array field for each user that by default has the user id of the person that scanned them (maybe store userid or email)
  positions: [{
    title: String,
    companyName: String
  }],
  profile: {
    name: { type: String, required: true },
    headline: String,
    imageurl: { type: String, default: "https://static.wikia.nocookie.net/virtualyoutuber/images/e/e8/Shirakami_Fubuki_Portrait.jpg" },
    location: String,
    summary: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dev',
  }],
}, {
  timestamps: true,
});

const Dev = mongoose.model('Dev', DevSchema)

module.exports = async (profileId, content, injection) => {

  console.log('saving')
  //console.log(content)
  
  const userExists = await Dev.findOne({ user: profileId });
  if (userExists || !content.profile) {
    // TODO append to list sources of the person that's currently scanning them if they are not already in the sources array (maybe store userid or email)
    return;
  }

  profile = new Dev({
    user: profileId,
    ...content
  });


  profile.save(function (err) {
    console.log("in save callback");
    if (err) return console.log(err);
    console.log("saved")
  });
  
}
